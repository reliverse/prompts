// examples/win-mln-js.ts: A fun example of a quiz game. Inspired by CLI-game created by Fireship.

import { errorHandler } from "examples/helpers/error-handler";
import figlet from "figlet";

import { prompts } from "~/components/all-in-one";
import { createAsciiArt } from "~/components/ascii-art";
import { colorize } from "~/utils/colorize";

import { handleAnswer } from "./state/utils/handleAnswer";

async function main() {
  await prompts({
    type: "start",
    id: "welcome",
    title: "Who Wants To Be A JavaScript Millionaire?",
    titleColor: "gradientGradient",
    titleTypography: "bold",
    titleVariant: "animated",
  });
  console.log(`
    ${colorize("HOW TO PLAY", "white", "bold")} 
    I am a process on your computer.
    If you get any question wrong I will be ${colorize("killed", "red", "bold")}
    So get all the questions right...
  `);

  const player_name = await prompts({
    type: "text",
    id: "player_name",
    title: "What is your name?",
    defaultValue: "Player",
  });
  // TODO: fix [object object]
  const playerName = String(player_name) ?? "Player";

  const { answer } = await prompts({
    type: "select",
    id: "answer",
    title: "JavaScript was created in 10 days then released on",
    choices: [
      { title: "May 23rd, 1995", id: "May 23rd, 1995" },
      { title: "Nov 24th, 1995", id: "Nov 24th, 1995" },
      { title: "Dec 4th, 1995", id: "Dec 4th, 1995" },
      { title: "Dec 17, 1996", id: "Dec 17, 1996" },
    ],
  });
  await handleAnswer(
    answer === "Dec 4th, 1995",
    `Nice work ${playerName}. That's a legit answer!`,
    `💀💀💀 Game over, you lose ${playerName}!`,
  );

  const message = `Congrats !\n $ 1 , 0 0 0 , 0 0 0`;

  await createAsciiArt({
    message,
    font: "Standard",
  });

  await prompts({
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
