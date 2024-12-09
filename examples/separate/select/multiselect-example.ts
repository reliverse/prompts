// 👉 bun examples/separate/select/select-example.ts

import { showEndPrompt, showStartPrompt } from "@/src/prompts.js";

import { multiselectPrompt, selectPrompt } from "~/main.js";
import { errorHandler } from "~/utils/errors.js";

export async function detailedExample() {
  await showStartPrompt();

  await multiselectPrompt({
    title:
      "['truncate' linesHandler] What web technologies do you like? 42 is the answer to everything. What do you think about testing the very long text? Is something broken for you? What category best describes your project?",
    content:
      "Let's embark on a creative journey and build something completely new! Afterward, it's all yours to refine. What category best describes your project? What web technologies do you like? 42 is the answer to everything. What do you think about testing the very very very long text? Is something broken for you?",
    linesHandler: "truncate",
    defaultValue: ["react", "typescript"],
    options: [
      {
        label: "React",
        value: "react",
        hint: "A library for building user interfaces.",
      },
      {
        label: "TypeScript",
        value: "typescript",
        hint: "A programming language that adds static typing to JavaScript.",
      },
      {
        label: "ESLint",
        value: "eslint",
        hint: "A tool for identifying patterns in JavaScript code.",
      },
    ] as const,
  });

  await showEndPrompt();
}

await detailedExample().catch((error) => errorHandler(error));
