import { cursor } from "sisteransi";

import type { PromptOptions } from "../prompts/prompt.js";

import Prompt from "../prompts/prompt.js";

type ConfirmOptions = {
  active: string;
  inactive: string;
  initialValue?: boolean;
} & PromptOptions<ConfirmPrompt>;
export default class ConfirmPrompt extends Prompt {
  get cursor() {
    return this.value ? 0 : 1;
  }

  private get _value() {
    return this.cursor === 0;
  }

  constructor(opts: ConfirmOptions) {
    super(opts, false);
    this.value = !!opts.initialValue;

    this.on("value", () => {
      this.value = this._value;
    });

    this.on("confirm", (confirm) => {
      this.output.write(cursor.move(0, -1));
      this.value = confirm;
      this.state = "submit";
      this.close();
    });

    this.on("cursor", () => {
      this.value = !this.value;
    });
  }
}
