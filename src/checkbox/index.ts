import ansiEscapes from "ansi-escapes";
import pc from "picocolors";

import type { PartialDeep } from "~/types/utils.js";

import {
  createPrompt,
  useState,
  useKeypress,
  usePrefix,
  usePagination,
  useRef,
  useMemo,
  makeTheme,
  isUpKey,
  isDownKey,
  isSpaceKey,
  isNumberKey,
  isEnterKey,
  ValidationError,
  Separator,
  type Theme,
  type Status,
} from "~/core/index.js";
import figures from "~/figures/index.js";

type CheckboxTheme = {
  icon: {
    checked: string;
    unchecked: string;
    cursor: string;
  };
  style: {
    disabledChoice: (text: string) => string;
    renderSelectedChoices: <T>(
      selectedChoices: readonly NormalizedChoice<T>[],
      allChoices: readonly (NormalizedChoice<T> | Separator)[],
    ) => string;
    description: (text: string) => string;
  };
  helpMode: "always" | "never" | "auto";
};

const checkboxTheme: CheckboxTheme = {
  icon: {
    checked: pc.green(figures.circleFilled),
    unchecked: figures.circle,
    cursor: figures.pointer,
  },
  style: {
    disabledChoice: (text: string) => pc.dim(`- ${text}`),
    renderSelectedChoices: (selectedChoices) =>
      selectedChoices.map((choice) => choice.short).join(", "),
    description: (text: string) => pc.cyan(text),
  },
  helpMode: "auto",
};

type Choice<Value> = {
  value: Value;
  name?: string;
  description?: string;
  short?: string;
  disabled?: boolean | string;
  checked?: boolean;
  type?: never;
};

type NormalizedChoice<Value> = {
  value: Value;
  name: string;
  description?: string;
  short: string;
  disabled: boolean | string;
  checked: boolean;
};

type CheckboxConfig<Value, ChoicesObject = readonly (string | Separator)[]> = {
  message: string;
  prefix?: string;
  pageSize?: number;
  instructions?: string | boolean;
  choices: ChoicesObject extends readonly (string | Separator)[]
    ? ChoicesObject
    : readonly (Choice<Value> | Separator)[];
  loop?: boolean;
  required?: boolean;
  validate?: (
    choices: readonly Choice<Value>[],
  ) => boolean | string | Promise<string | boolean>;
  theme?: PartialDeep<Theme<CheckboxTheme>>;
};

type Item<Value> = NormalizedChoice<Value> | Separator;

function isSelectable<Value>(
  item: Item<Value>,
): item is NormalizedChoice<Value> {
  return !Separator.isSeparator(item) && !item.disabled;
}

function isChecked<Value>(item: Item<Value>): item is NormalizedChoice<Value> {
  return isSelectable(item) && Boolean(item.checked);
}

function toggle<Value>(item: Item<Value>): Item<Value> {
  return isSelectable(item) ? { ...item, checked: !item.checked } : item;
}

function check(checked: boolean) {
  return function <Value>(item: Item<Value>): Item<Value> {
    return isSelectable(item) ? { ...item, checked } : item;
  };
}

function normalizeChoices<Value>(
  choices: readonly (string | Separator)[],
): Item<Value>[] {
  return choices.map((choice) => {
    if (Separator.isSeparator(choice)) {
      return choice;
    }

    if (typeof choice === "string") {
      return {
        value: choice as Value,
        name: choice,
        short: choice,
        disabled: false,
        checked: false,
      };
    }

    // @ts-expect-error - TODO: fix ts
    const name = choice.name ?? String(choice.value);
    return {
      // @ts-expect-error - TODO: fix ts
      value: choice.value,
      name,
      // @ts-expect-error - TODO: fix ts
      short: choice.short ?? name,
      // @ts-expect-error - TODO: fix ts
      description: choice.description,
      // @ts-expect-error - TODO: fix ts
      disabled: choice.disabled ?? false,
      // @ts-expect-error - TODO: fix ts
      checked: choice.checked ?? false,
    };
  });
}

const checkbox = createPrompt(
  <Value>(config: CheckboxConfig<Value>, done: (value: Value[]) => void) => {
    const {
      instructions,
      pageSize = 7,
      loop = true,
      required,
      validate = () => true,
    } = config;
    const theme = makeTheme<CheckboxTheme>(checkboxTheme, config.theme);
    const firstRender = useRef(true);
    const [status, setStatus] = useState<Status>("idle");
    const prefix = usePrefix({ status, theme });
    const [items, setItems] = useState<readonly Item<Value>[]>(
      normalizeChoices(config.choices),
    );

    const bounds = useMemo(() => {
      const first = items.findIndex(isSelectable);
      const last = items.findLastIndex(isSelectable);

      if (first === -1) {
        throw new ValidationError(
          "[checkbox prompt] No selectable choices. All choices are disabled.",
        );
      }

      return { first, last };
    }, [items]);

    const [active, setActive] = useState(bounds.first);
    const [showHelpTip, setShowHelpTip] = useState(true);
    const [errorMsg, setError] = useState<string>();

    useKeypress(async (key) => {
      if (isEnterKey(key)) {
        const selection = items.filter(isChecked);
        const isValid = await validate([...selection]);
        if (required && !items.some(isChecked)) {
          setError("At least one choice must be selected");
        } else if (isValid === true) {
          setStatus("done");
          done(selection.map((choice) => choice.value));
        } else {
          setError(isValid || "You must select a valid value");
        }
      } else if (isUpKey(key) || isDownKey(key)) {
        if (
          loop ||
          (isUpKey(key) && active !== bounds.first) ||
          (isDownKey(key) && active !== bounds.last)
        ) {
          const offset = isUpKey(key) ? -1 : 1;
          let next = active;
          do {
            next = (next + offset + items.length) % items.length;
          } while (!isSelectable(items[next]));
          setActive(next);
        }
      } else if (isSpaceKey(key)) {
        setError(undefined);
        setShowHelpTip(false);
        setItems(
          items.map((choice, i) => (i === active ? toggle(choice) : choice)),
        );
      } else if (key.name === "a") {
        const selectAll = items.some(
          (choice) => isSelectable(choice) && !choice.checked,
        );
        setItems(items.map(check(selectAll)));
      } else if (key.name === "i") {
        setItems(items.map(toggle));
      } else if (isNumberKey(key)) {
        // We adjust index to start at 1
        const position = Number(key.name) - 1;
        const item = items[position];
        if (item != null && isSelectable(item)) {
          setActive(position);
          setItems(
            items.map((choice, i) =>
              i === position ? toggle(choice) : choice,
            ),
          );
        }
      }
    });

    const message = theme.style.message(config.message, status);

    let description: string | undefined;
    const page = usePagination({
      items,
      active,
      renderItem({ item, isActive }) {
        if (Separator.isSeparator(item)) {
          return ` ${item.separator}`;
        }

        if (item.disabled) {
          const disabledLabel =
            typeof item.disabled === "string" ? item.disabled : "(disabled)";
          return theme.style.disabledChoice(`${item.name} ${disabledLabel}`);
        }

        if (isActive) {
          description = item.description;
        }

        const checkbox = item.checked
          ? theme.icon.checked
          : theme.icon.unchecked;
        const color = isActive ? theme.style.highlight : (x: string) => x;
        const cursor = isActive ? theme.icon.cursor : " ";
        return color(`${cursor}${checkbox} ${item.name}`);
      },
      pageSize,
      loop,
    });

    if (status === "done") {
      const selection = items.filter(isChecked);
      const answer = theme.style.answer(
        theme.style.renderSelectedChoices(selection, items),
      );

      return `${prefix} ${message} ${answer}`;
    }

    let helpTipTop = "";
    let helpTipBottom = "";
    if (
      theme.helpMode === "always" ||
      (theme.helpMode === "auto" &&
        showHelpTip &&
        (instructions === undefined || instructions))
    ) {
      if (typeof instructions === "string") {
        helpTipTop = instructions;
      } else {
        const keys = [
          `${theme.style.key("space")} to select`,
          `${theme.style.key("a")} to toggle all`,
          `${theme.style.key("i")} to invert selection`,
          `and ${theme.style.key("enter")} to proceed`,
        ];
        helpTipTop = ` (Press ${keys.join(", ")})`;
      }

      if (
        items.length > pageSize &&
        (theme.helpMode === "always" ||
          (theme.helpMode === "auto" && firstRender.current))
      ) {
        helpTipBottom = `\n${theme.style.help("(Use arrow keys to reveal more choices)")}`;
        firstRender.current = false;
      }
    }

    const choiceDescription = description
      ? `\n${theme.style.description(description)}`
      : ``;

    let error = "";
    if (errorMsg) {
      error = `\n${theme.style.error(errorMsg)}`;
    }

    return `${prefix} ${message}${helpTipTop}\n${page}${helpTipBottom}${choiceDescription}${error}${ansiEscapes.cursorHide}`;
  },
);

export default checkbox;
export { Separator } from "~/core/index.js";
