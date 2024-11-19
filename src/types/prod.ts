import type { AnimationName } from "@figliolia/chalk-animation";
import type { TSchema } from "@sinclair/typebox";

export type MsgType =
  | "M_NULL"
  | "M_START"
  | "M_MIDDLE"
  | "M_GENERAL"
  | "M_INFO"
  | "M_NEWLINE"
  | "M_END"
  | "M_END_ANIMATED"
  | "M_ERROR";

export type TypographyName = "bold" | "strikethrough" | "underline" | "italic";

export type Variant =
  | "box"
  | "doubleBox"
  | "banner"
  | "underline"
  | "none"
  | "animated";

export type ColorName =
  | "dim"
  | "inverse"
  | "black"
  | "red"
  | "redBright"
  | "bgRed"
  | "bgRedBright"
  | "green"
  | "greenBright"
  | "bgGreen"
  | "bgGreenBright"
  | "yellow"
  | "yellowBright"
  | "blue"
  | "blueBright"
  | "magenta"
  | "cyan"
  | "cyanBright"
  | "bgCyan"
  | "bgCyanBright"
  | "white"
  | "gray"
  | "gradientGradient"
  | "rainbowGradient"
  | "cristalGradient"
  | "mindGradient"
  | "passionGradient"
  | "viceGradient"
  | "retroGradient"
  | "none";

export type MsgConfig = {
  symbol: string;
  prefix?: string;
  color?: (text: string) => string;
  newLineBefore?: boolean;
  newLineAfter?: boolean;
  suffix?: string;
};

export type FmtMsgOptions = {
  type: MsgType;
  title?: string;
  titleAfterAnim?: string;
  content?: string;
  titleColor?: ColorName;
  titleTypography?: TypographyName;
  titleVariant?: Variant;
  contentColor?: ColorName;
  contentTypography?: TypographyName;
  contentVariant?: Variant;
  hint?: string;
  border?: boolean;
  borderColor?: ColorName;
  variantOptions?: {
    box?: {
      limit?: number;
    };
  };
  errorMessage?: string;
  addNewLineBefore?: boolean;
  addNewLineAfter?: boolean;
};

export type RequiredPromptOptions = {
  id: string;
  title: string;
};

export type OptionalPromptOptions<T extends TSchema = any> = {
  schema?: T;
  titleColor?: ColorName;
  titleTypography?: TypographyName;
  titleVariant?: Variant;
  titleAnimation?: AnimationName;
  titleAnimationDelay?: number;
  content?: string;
  contentColor?: ColorName;
  contentTypography?: TypographyName;
  contentVariant?: Variant;
  hint?: string;
  validate?: (value: any) => boolean | string | Promise<boolean | string>;
  defaultValue?: string | string[] | number | boolean;
  defaultColor?: ColorName;
  defaultTypography?: TypographyName;
  choices?: ChoiceOptions[];
  variantOptions?: {
    box?: {
      limit?: number;
    };
  };
  action?: () => Promise<void>;
  border?: boolean;
  borderColor?: ColorName;
  clearConsole?: boolean;
  additionalLinesToDelete?: number;
  answerColor?: ColorName;
  hintColor?: ColorName;
};

export type PromptOptions<T extends TSchema = any> = RequiredPromptOptions &
  OptionalPromptOptions<T>;

export type ChoiceRequiredOptions = {
  id: string;
  title: string;
};

export type ChoiceOptionalOptions = {
  description?: string;
  titleTypography?: TypographyName;
  action?: () => Promise<void>;
};

export type ChoiceOptions = ChoiceRequiredOptions & ChoiceOptionalOptions;

export type PromptType =
  | "text"
  | "number"
  | "confirm"
  | "numSelect"
  | "select"
  | "multiselect"
  | "password"
  | "date"
  | "start"
  | "nextSteps"
  | "end";