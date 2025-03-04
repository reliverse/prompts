import { re } from "@reliverse/relico";

import type { ArgsDef, CommandDef } from "./types.js";

import { formatLineColumns, resolveValue } from "./_utils.js";
import { resolveArgs } from "./args.js";

export async function showUsage<T extends ArgsDef = ArgsDef>(
  cmd: CommandDef<T>,
  parent?: CommandDef<T>,
) {
  try {
    console.log(`${await renderUsage(cmd, parent)}\n`);
  } catch (error) {
    console.error(error);
  }
}

export async function renderUsage<T extends ArgsDef = ArgsDef>(
  cmd: CommandDef<T>,
  parent?: CommandDef<T>,
) {
  const cmdMeta = await resolveValue(cmd.meta || {});
  const cmdArgs = resolveArgs(await resolveValue(cmd.args || {}));
  const parentMeta = await resolveValue(parent?.meta || {});

  const commandName =
    (parentMeta.name ? `${parentMeta.name} ` : "") +
    (cmdMeta.name || process.argv[1]);

  const argLines: string[][] = [];
  const posLines: string[][] = [];
  const commandsLines: string[][] = [];
  const usageLine = [];

  for (const arg of cmdArgs) {
    if (arg.type === "positional") {
      const name = arg.name.toUpperCase();
      const isRequired = arg.required && arg.default === undefined;
      const defaultHint = arg.default ? `="${arg.default}"` : "";
      posLines.push([
        `\`${name}${defaultHint}\``,
        arg.description || "",
        arg.valueHint ? `<${arg.valueHint}>` : "",
      ]);
      usageLine.push(isRequired ? `<${name}>` : `[${name}]`);
    } else {
      const isRequired = arg.required && arg.default === undefined;
      const argStr =
        (arg.type === "boolean" && arg.default
          ? [
              ...(arg.alias || []).map((a) => `--no-${a}`),
              `--no-${arg.name}`,
            ].join(", ")
          : [...(arg.alias || []).map((a) => `-${a}`), `--${arg.name}`].join(
              ", ",
            )) +
        (arg.type === "string" && (arg.valueHint || arg.default)
          ? `=${
              arg.valueHint ? `<${arg.valueHint}>` : `"${arg.default || ""}"`
            }`
          : "") +
        (arg.type === "enum" && arg.options
          ? `=<${arg.options.join("|")}>`
          : "");

      const isNegative = arg.type === "boolean" && arg.default;
      const description = isNegative
        ? arg.negativeDescription || arg.description
        : arg.description;
      argLines.push([
        `\`${argStr}${isRequired ? " (required)" : ""}\``,
        description || "",
      ]);
      if (isRequired) {
        usageLine.push(argStr);
      }
    }
  }

  if (cmd.subCommands) {
    const commandNames: string[] = [];
    const subCommands = await resolveValue(cmd.subCommands);
    for (const [name, sub] of Object.entries(subCommands)) {
      const subCmd = await resolveValue(sub);
      const meta = await resolveValue(subCmd?.meta);
      if (meta?.hidden) {
        continue;
      }
      commandsLines.push([`\`${name}\``, meta?.description || ""]);
      commandNames.push(name);
    }
    usageLine.push(commandNames.join("|"));
  }

  const usageLines: (string | undefined)[] = [];

  const version = cmdMeta.version || parentMeta.version;

  usageLines.push(
    re.gray(
      `${cmdMeta.description} (${
        commandName + (version ? ` v${version}` : "")
      })`,
    ),
    "",
  );

  const hasOptions = argLines.length > 0 || posLines.length > 0;
  usageLines.push(
    `${re.underline(re.bold("USAGE"))} \`${commandName}${
      hasOptions ? " [OPTIONS]" : ""
    } ${usageLine.join(" ")}\``,
    "",
  );

  if (posLines.length > 0) {
    usageLines.push(re.underline(re.bold("ARGUMENTS")), "");
    usageLines.push(formatLineColumns(posLines, "  "));
    usageLines.push("");
  }

  if (argLines.length > 0) {
    usageLines.push(re.underline(re.bold("OPTIONS")), "");
    usageLines.push(formatLineColumns(argLines, "  "));
    usageLines.push("");
  }

  if (commandsLines.length > 0) {
    usageLines.push(re.underline(re.bold("COMMANDS")), "");
    usageLines.push(formatLineColumns(commandsLines, "  "));
    usageLines.push(
      "",
      `Use \`${commandName} <command> --help\` for more information about a command.`,
    );
  }

  return usageLines.filter((l) => typeof l === "string").join("\n");
}
