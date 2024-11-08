import type { Prettify, PartialDeep } from "./type";

import { defaultTheme, type Theme } from "./theme";

function isPlainObject(value: unknown): value is object {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  let proto: unknown = value;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }

  return Object.getPrototypeOf(value) === proto;
}

function deepMerge<T extends object>(...objects: Partial<T>[]): T {
  const output: Record<string, unknown> = {};

  for (const obj of objects) {
    for (const [key, value] of Object.entries(obj)) {
      const prevValue = output[key];

      output[key] =
        isPlainObject(prevValue) && isPlainObject(value)
          ? deepMerge(prevValue, value)
          : value;
    }
  }

  return output as T;
}

export function makeTheme<SpecificTheme extends object>(
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  ...themes: readonly (undefined | PartialDeep<Theme<SpecificTheme>>)[]
): Prettify<Theme<SpecificTheme>> {
  const themesToMerge = [
    defaultTheme,
    // eslint-disable-next-line eqeqeq
    ...themes.filter((theme) => theme != null),
  ] as Theme<SpecificTheme>[];
  return deepMerge(...themesToMerge);
}
