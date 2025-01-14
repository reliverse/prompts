import { fmt, restoreCursor } from "@reliverse/relinka";
import logUpdate from "log-update";

const DEFAULT_MESSAGE = "Press any key to continue...";

type Options = {
  ctrlC?: number | "reject" | false;
  preserveLog?: boolean;
  hideMessage?: boolean;
};

const CTRL_C_CODE = 3;

export async function anykeyPrompt(
  message: string = DEFAULT_MESSAGE,
  options: Options = {},
): Promise<void> {
  const { ctrlC = 1, preserveLog = false, hideMessage = false } = options;

  if (message) {
    const { text } = fmt({
      hintPlaceholderColor: "gray",
      type: "M_GENERAL",
      title: message,
      titleColor: "dim",
      dontRemoveBar: true,
    });
    message = text;
  }

  if (message && !hideMessage) {
    logUpdate(message);
  }

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      process.stdin.removeListener("data", handler);
      if (
        process.stdin.isTTY &&
        typeof process.stdin.setRawMode === "function"
      ) {
        process.stdin.setRawMode(false);
      }
      process.stdin.pause();
      restoreCursor();
    };

    const handleCtrlC = () => {
      cleanup();
      if (ctrlC === "reject") {
        reject(new Error("User pressed CTRL+C"));
      } else if (ctrlC === false) {
        resolve();
      } else if (typeof ctrlC === "number") {
        process.exit(ctrlC);
      } else {
        throw new TypeError("Invalid ctrlC option");
      }
    };

    const handler = (buffer: Buffer) => {
      cleanup();

      if (message && !preserveLog) {
        logUpdate.clear();
      } else {
        logUpdate.done();
        process.stdout.write("\n");
      }

      const [firstByte] = buffer;
      if (firstByte === CTRL_C_CODE) {
        handleCtrlC();
      } else {
        resolve();
      }
    };

    process.stdin.resume();
    if (process.stdin.isTTY && typeof process.stdin.setRawMode === "function") {
      process.stdin.setRawMode(true);
    }
    process.stdin.once("data", handler);
  });
}
