import React from "react";
import { ThemeProvider } from "styled-components";
import GameBoard from "./components/GameBoard";
import { theme } from "./theme";
import "./App.css";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GameBoard />
    </ThemeProvider>
  );
};

export default App;
