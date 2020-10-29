import { useState } from "react";


const useVisualMode = (initial) => {
  const [mode, setMode] = useState(initial);
  //history is a statefull array that contains the modes
  const [history, setHistory] = useState([initial]);

  //takes a new mode and updates the mode state with the new value
  //and puts it in history array
  const transition = (newMode, replace=false) => {
    setMode(newMode);
    
    if (replace) {
      setHistory([...history.slice(0, history.length-1), newMode])
    } else {
      setHistory([...history, newMode]);
    }
  };

  //sets the mode to the previous item in history array
  const back = () => {
    const newHistory = history.length > 1 ? history.slice(0, history.length-1) : history
    setHistory(newHistory);
    setMode(newHistory[newHistory.length-1])
    
  };

  return {mode, transition, back}
};

export default useVisualMode