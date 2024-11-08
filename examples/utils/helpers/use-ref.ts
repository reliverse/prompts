import { useState } from "./use-state";

export function useRef<Value>(val: Value): { current: Value };
export function useRef<Value>(val?: Value): { current: Value | undefined };
export function useRef<Value>(val: Value) {
  return useState({ current: val })[0];
}
