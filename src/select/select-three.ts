import type { PromptOptions } from "~/prompts/prompt.js";

import Prompt from "~/prompts/prompt.js";

type SelectOptions<T extends { value: any }> = {
  options: T[];
  initialValue?: T["value"];
} & PromptOptions<SelectPrompt<T>>;
export default class SelectPrompt<T extends { value: any }> extends Prompt {
  options: T[];
  cursor = 0;

  private get _value() {
    return this.options[this.cursor];
  }

  private changeValue() {
    this.value = this._value.value;
  }

  constructor(opts: SelectOptions<T>) {
    super(opts, false);

    this.options = opts.options;
    this.cursor = this.options.findIndex(
      ({ value }) => value === opts.initialValue,
    );
    if (this.cursor === -1) {
      this.cursor = 0;
    }
    this.changeValue();

    this.on("cursor", (key) => {
      switch (key) {
        case "left":
        case "up":
          this.cursor =
            this.cursor === 0 ? this.options.length - 1 : this.cursor - 1;
          break;
        case "down":
        case "right":
          this.cursor =
            this.cursor === this.options.length - 1 ? 0 : this.cursor + 1;
          break;
      }
      this.changeValue();
    });
  }
}
