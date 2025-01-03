import pc from "picocolors";

import figures from "~/figures/index.js";

/**
 * Separator object
 * Used to space/separate choices group
 */

export class Separator {
  readonly separator = pc.dim(Array.from({ length: 15 }).join(figures.line));
  readonly type = "separator";

  constructor(separator?: string) {
    if (separator) {
      this.separator = separator;
    }
  }

  static isSeparator(choice: unknown): choice is Separator {
    return Boolean(
      choice &&
        typeof choice === "object" &&
        "type" in choice &&
        choice.type === "separator",
    );
  }
}
