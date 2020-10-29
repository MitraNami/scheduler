import { useState } from "react";


const useVisualMode = (initial) => {
  const [mode, setMode] = useState(initial);

  //takes a new mode and updates the mode state with the new value
  const transition = (newMode) => {
    setMode(newMode);
  };

  return {mode, transition}
};

export default useVisualMode