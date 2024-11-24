// @ts-nocheck
import { magenta } from "picocolors";
import ProgressBar from "../index.js";

// helper function to display preset
function showPreset(name, pos) {
  console.log(magenta("Preset: " + name));

  // create a new progress bar with preset
  const bar = new _progress.Bar(
    {
      align: pos,
    },
    _progress.Presets[name] || _progress.Presets.legacy,
  );
  bar.start(200, 0);

  // random value 1..200
  bar.update(Math.floor(Math.random() * 200 + 1));
  bar.stop();
  console.log("");
}

console.log("");
showPreset("legacy", "center");
showPreset("shades_classic", "right");
showPreset("shades_grey", "left");
showPreset("rect", "center");
