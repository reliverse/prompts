import { withPointer } from "./hook-engine.js";

type PointerValue<Value> = {
  value: Value;
  dependencies: readonly unknown[];
};

export function useMemo<Value>(
  fn: () => Value,
  dependencies: readonly unknown[],
): Value {
  return withPointer<PointerValue<Value>, Value>((pointer) => {
    const prev = pointer.get();
    if (
      !prev ||
      prev.dependencies.length !== dependencies.length ||
      prev.dependencies.some((dep, i) => dep !== dependencies[i])
    ) {
      const value = fn();
      pointer.set({ value, dependencies });
      return value;
    }

    return prev.value;
  });
}
