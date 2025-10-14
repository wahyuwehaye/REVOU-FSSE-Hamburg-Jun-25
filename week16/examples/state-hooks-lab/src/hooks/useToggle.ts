import { useCallback, useState } from "react";

export function useToggle(defaultValue = false) {
  const [value, setValue] = useState(defaultValue);
  const toggle = useCallback(() => setValue((prev) => !prev), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse };
}
