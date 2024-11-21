import type { OptionalPromptOptions } from "~/unsorted/types/general";

export const basicConfig = {
  titleColor: "cyanBright",
  titleTypography: "bold",
  borderColor: "viceGradient",
} satisfies OptionalPromptOptions;

export const extendedConfig = {
  ...basicConfig,
  contentTypography: "italic",
  contentColor: "dim",
  answerColor: "none", // white in dark mode, black in light mode
} satisfies OptionalPromptOptions;