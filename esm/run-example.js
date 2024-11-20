import { relinka } from "~/create.js";
import { errorHandler } from "~/utils/errors.js";
async function examplesRunner() {
    const exampleToRun = await relinka.prompt("Choose an example to run", {
        type: "select",
        options: [
            { label: "1-main-example", value: "1-main-example", hint: "recommended" },
            {
                label: "2-mono-example",
                value: "2-mono-example",
                hint: "not finished",
            },
            {
                label: "3-basic-example",
                value: "3-basic-example",
                hint: "not finished",
            },
            {
                label: "4-experimental",
                value: "4-experimental",
                hint: "experimental",
            },
            { label: "exit", value: "exit" },
        ],
        initial: "1-main-example",
    });
    switch (exampleToRun) {
        case "1-main-example":
            await import("./1-main-example");
            break;
        case "2-mono-example":
            await import("./2-mono-example");
            break;
        case "3-basic-example":
            await import("./3-basic-example");
            break;
        case "4-experimental":
            await import("./4-experimental");
            break;
        default:
            break;
    }
}
await examplesRunner().catch((error) => errorHandler(error));
