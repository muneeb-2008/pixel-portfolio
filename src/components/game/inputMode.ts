"use client";

import { createContext, useContext, useEffect, useState } from "react";

/** "touch" = D-pad + tap copy; "keyboard" = key hints. Follows the last input used. */
export type InputMode = "keyboard" | "touch";

export const InputModeContext = createContext<InputMode>("keyboard");
export const useInputModeValue = () => useContext(InputModeContext);

export function useInputModeTracker(): InputMode {
  const [mode, setMode] = useState<InputMode>(() =>
    typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches ? "touch" : "keyboard",
  );
  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === "touch" || e.pointerType === "pen") setMode("touch");
    };
    const onKey = (e: KeyboardEvent) => {
      // ignore modifier-only presses (e.g. screenshots, OS shortcuts)
      if (e.key.length === 1 || e.key.startsWith("Arrow") || e.key === "Enter" || e.key === "Tab") setMode("keyboard");
    };
    window.addEventListener("pointerdown", onPointer, true);
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("pointerdown", onPointer, true);
      window.removeEventListener("keydown", onKey, true);
    };
  }, []);
  return mode;
}
