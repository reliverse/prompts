import type { CommandContext, CommandDef, ArgsDef } from "./types.js";

import { resolveValue } from "./_utils.js";
import { parseArgs } from "./args.js";

export function defineCommand<T extends ArgsDef = ArgsDef>(
  def: CommandDef<T>,
): CommandDef<T> {
  return def;
}

export type RunCommandOptions = {
  rawArgs: string[];
  data?: any;
  showUsage?: boolean;
};

export async function runCommand<T extends ArgsDef = ArgsDef>(
  cmd: CommandDef<T>,
  opts: RunCommandOptions,
): Promise<{ result: unknown }> {
  const cmdArgs = await resolveValue(cmd.args || {});
  const parsedArgs = parseArgs<T>(opts.rawArgs, cmdArgs);

  const context: CommandContext<T> = {
    rawArgs: opts.rawArgs,
    args: parsedArgs,
    data: opts.data,
    cmd,
  };

  // Setup hook
  if (typeof cmd.setup === "function") {
    await cmd.setup(context);
  }

  // Handle sub command
  let result: unknown;
  try {
    const subCommands = await resolveValue(cmd.subCommands);
    if (subCommands && Object.keys(subCommands).length > 0) {
      const subCommandArgIndex = opts.rawArgs.findIndex(
        (arg) => !arg.startsWith("-"),
      );
      const subCommandName = opts.rawArgs[subCommandArgIndex];
      if (subCommandName) {
        if (!subCommands[subCommandName]) {
          throw new Error(`Unknown command \`${subCommandName}\``);
        }
        const subCommand = await resolveValue(subCommands[subCommandName]);
        if (subCommand) {
          await runCommand(subCommand, {
            rawArgs: opts.rawArgs.slice(subCommandArgIndex + 1),
          });
        }
      } else if (!cmd.run) {
        throw new Error("No command specified.");
      }
    }

    // Handle main command
    if (typeof cmd.run === "function") {
      result = await cmd.run(context);
    }
  } finally {
    if (typeof cmd.cleanup === "function") {
      await cmd.cleanup(context);
    }
  }
  return { result };
}

export async function resolveSubCommand<T extends ArgsDef = ArgsDef>(
  cmd: CommandDef<T>,
  rawArgs: string[],
  parent?: CommandDef<T>,
): Promise<[CommandDef<T>, CommandDef<T>?]> {
  const subCommands = await resolveValue(cmd.subCommands);
  if (subCommands && Object.keys(subCommands).length > 0) {
    const subCommandArgIndex = rawArgs.findIndex((arg) => !arg.startsWith("-"));
    const subCommandName = rawArgs[subCommandArgIndex];
    const subCommand = await resolveValue(subCommands[subCommandName]);
    if (subCommand) {
      return resolveSubCommand(
        subCommand,
        rawArgs.slice(subCommandArgIndex + 1),
        cmd,
      );
    }
  }
  return [cmd, parent];
}
