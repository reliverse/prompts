import pc from "picocolors";

import type { Prettify } from "~/types/index.js";

import figures from "~/figures/index.js";

/**
 * Union type representing the possible statuses of a prompt.
 *
 * -   `'loading'`: The prompt is currently loading.
 * -   `'idle'`: The prompt is loaded and currently waiting for the user to
 *     submit an answer.
 * -   `'done'`: The user has submitted an answer and the prompt is finished.
 * -   `string`: Any other string: The prompt is in a custom state.
 */
export type Status = "loading" | "idle" | "done" | (string & {});

type DefaultTheme = {
  /**
   * Prefix to prepend to the message. If a function is provided, it will be
   * called with the current status of the prompt, and the return value will be
   * used as the prefix.
   *
   * @remarks
   * If `status === 'loading'`, this property is ignored and the spinner (styled
   * by the `spinner` property) will be displayed instead.
   *
   * @defaultValue
   * ```ts
   * // import colors from 'yoctocolors-cjs';
   * (status) => status === 'done' ? pc.green('✔') : pc.blue('?')
   * ```
   */
  prefix: string | Prettify<Omit<Record<Status, string>, "loading">>;

  /**
   * Configuration for the spinner that is displayed when the prompt is in the
   * `'loading'` state.
   *
   * We recommend the use of {@link https://github.com/sindresorhus/cli-spinners|cli-spinners} for a list of available spinners.
   */
  spinner: {
    /**
     * The time interval between frames, in milliseconds.
     *
     * @defaultValue
     * ```ts
     * 80
     * ```
     */
    interval: number;

    /**
     * A list of frames to show for the spinner.
     *
     * @defaultValue
     * ```ts
     * ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
     * ```
     */
    frames: string[];
  };
  /**
   * Object containing functions to style different parts of the prompt.
   */
  style: {
    /**
     * Style to apply to the user's answer once it has been submitted.
     *
     * @param text - The user's answer.
     * @returns The styled answer.
     *
     * @defaultValue
     * ```ts
     * // import colors from 'yoctocolors-cjs';
     * (text) => pc.cyan(text)
     * ```
     */
    answer: (text: string) => string;

    /**
     * Style to apply to the message displayed to the user.
     *
     * @param text - The message to style.
     * @param status - The current status of the prompt.
     * @returns The styled message.
     *
     * @defaultValue
     * ```ts
     * // import colors from 'yoctocolors-cjs';
     * (text, status) => pc.bold(text)
     * ```
     */
    message: (text: string, status: Status) => string;

    /**
     * Style to apply to error messages.
     *
     * @param text - The error message.
     * @returns The styled error message.
     *
     * @defaultValue
     * ```ts
     * // import colors from 'yoctocolors-cjs';
     * (text) => pc.red(`> ${text}`)
     * ```
     */
    error: (text: string) => string;

    /**
     * Style to apply to the default answer when one is provided.
     *
     * @param text - The default answer.
     * @returns The styled default answer.
     *
     * @defaultValue
     * ```ts
     * // import colors from 'yoctocolors-cjs';
     * (text) => pc.dim(`(${text})`)
     * ```
     */
    defaultAnswer: (text: string) => string;

    /**
     * Style to apply to help text.
     *
     * @param text - The help text.
     * @returns The styled help text.
     *
     * @defaultValue
     * ```ts
     * // import colors from 'yoctocolors-cjs';
     * (text) => pc.dim(text)
     * ```
     */
    help: (text: string) => string;

    /**
     * Style to apply to highlighted text.
     *
     * @param text - The text to highlight.
     * @returns The highlighted text.
     *
     * @defaultValue
     * ```ts
     * // import colors from 'yoctocolors-cjs';
     * (text) => pc.cyan(text)
     * ```
     */
    highlight: (text: string) => string;

    /**
     * Style to apply to keyboard keys referred to in help texts.
     *
     * @param text - The key to style.
     * @returns The styled key.
     *
     * @defaultValue
     * ```ts
     * // import colors from 'yoctocolors-cjs';
     * (text) => pc.cyan(pc.bold(`<${text}>`))
     * ```
     */
    key: (text: string) => string;
  };
};

export type Theme<Extension extends object = object> = Prettify<
  Extension & DefaultTheme
>;

export const defaultTheme: DefaultTheme = {
  prefix: {
    idle: pc.blue("?"),
    // TODO: use figure
    done: pc.green(figures.tick),
  },
  spinner: {
    interval: 80,
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"].map((frame) =>
      pc.yellow(frame),
    ),
  },
  style: {
    answer: pc.cyan,
    message: pc.bold,
    error: (text) => pc.red(`> ${text}`),
    defaultAnswer: (text) => pc.dim(`(${text})`),
    help: pc.dim,
    highlight: pc.cyan,
    key: (text: string) => pc.cyan(pc.bold(`<${text}>`)),
  },
};
