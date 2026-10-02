import { useState } from "react";

// Only validated data is accepted. A blocked/full browser store must not crash the app.
export default function useLocalStorage(key, initialValue, isValid) {
  const [problem, setProblem] = useState("");
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved === null) return initialValue;
      const parsed = JSON.parse(saved);
      return isValid(parsed) ? parsed : initialValue;
    } catch {
      return initialValue;
    }
  });

  function update(nextValue) {
    setValue(nextValue);
    try {
      localStorage.setItem(key, JSON.stringify(nextValue));
      setProblem("");
    } catch {
      setProblem(
        "Your browser could not save this change. It will last only for this session.",
      );
    }
  }
  return [value, update, problem];
}
