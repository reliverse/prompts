import { figures } from "@/external/terkelg/src/lib/util";
import { dim } from "picocolors";

/**
 * Separator object
 * Used to space/separate choices group
 */

export class Separator {
  readonly separator = dim(Array.from({ length: 15 }).join(figures.line));
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