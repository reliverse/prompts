// 2-mono-example.ts: A fun example of a quiz game. Inspired by CLI-game created by Fireship. The example demonstrates how to use a mono prompt() component.

import { prompt } from "~/components/mono/mono.js";
import { spinner } from "~/components/spinner/index.js";
import { createAsciiArt } from "~/components/visual/ascii-art/ascii-art.js";
import { animateText, inputPrompt } from "~/main.js";
import { colorize } from "~/utils/colorize.js";
import { errorHandler } from "~/utils/errors.js";

async function main() {
  console.clear();
  await prompt({
    type: "start",
    id: "welcome",
    title: "Mono Component Example",
    titleColor: "passionGradient",
    titleTypography: "bold",
  });

  await animateText({
    title: "Who Wants to Be a JS Mil?",
    anim: "rainbow",
    titleColor: "gradientGradient",
  });

  console.log(`
    ${colorize("HOW TO PLAY", "white", "bold")} 
    I am a process on your computer.
    If you get any question wrong I will be ${colorize("killed", "red", "bold")}
    So get all the questions right...
  `);

  const player_name = await inputPrompt({
    title: "What is your name?",
    defaultValue: "Player",
  });
  // TODO: fix [object object]
  const playerName = player_name ?? "Player";

  const { answer } = await prompt({
    type: "numSelect",
    id: "answer",
    title: "JavaScript was created in 10 days then released on",
    choices: [
      { title: "May 23rd, 1995", id: "May 23rd, 1995" },
      { title: "Nov 24th, 1995", id: "Nov 24th, 1995" },
      { title: "Dec 4th, 1995", id: "Dec 4th, 1995" },
      { title: "Dec 17, 1996", id: "Dec 17, 1996" },
    ],
  });

  await spinner({
    initialMessage: "Checking answer...",
    successMessage: "Answer checked successfully.",
    spinnerSolution: "ora",
    spinnerType: "arc",
    action: async (updateMessage) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      updateMessage(
        answer === "Dec 4th, 1995"
          ? `Nice work ${playerName}. That's a legit answer!`
          : `🫠 Game over, ${playerName}! You lose!`,
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  });

  const message = `Congrats !\n $ 1 , 0 0 0 , 0 0 0`;

  await createAsciiArt({
    message,
    font: "Standard",
  });

  await prompt({
    type: "end",
    id: "winner",
    title: `
      Programming isn't about what you know; 
      it's about making the command line look cool!`,
    titleColor: "bgCyanBright",
    titleTypography: "bold",
    border: false,
  });
  process.exit(0);
}

await main().catch((error) => errorHandler(error));