import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import styled from "styled-components";
import GameBoard from "./components/GameBoard";
import TwoPlayerGameBoard from "./components/twoPlayer/TwoPlayerGameBoard";
import { theme } from "./theme";
import "./App.css";

type GameMode = "menu" | "singlePlayer" | "twoPlayer";

const App: React.FC = () => {
  const [gameMode, setGameMode] = useState<GameMode>("menu");

  const renderContent = () => {
    switch (gameMode) {
      case "singlePlayer":
        return (
          <>
            <BackButton onClick={() => setGameMode("menu")}>
              ← Back to Menu
            </BackButton>
            <GameBoard />
          </>
        );
        
      case "twoPlayer":
        return (
          <>
            <BackButton onClick={() => setGameMode("menu")}>
              ← Back to Menu
            </BackButton>
            <TwoPlayerGameBoard />
          </>
        );
        
      default:
        return (
          <MenuContainer>
            <MenuTitle>🚢 Battleship Game</MenuTitle>
            <MenuSubtitle>
              Choose your game mode
            </MenuSubtitle>
            
            <MenuButtons>
              <MenuButton onClick={() => setGameMode("singlePlayer")}>
                <ButtonTitle>Practice Mode</ButtonTitle>
                <ButtonDescription>
                  Find and sink all hidden ships
                </ButtonDescription>
              </MenuButton>
              
              <MenuButton onClick={() => setGameMode("twoPlayer")}>
                <ButtonTitle>Battle Mode</ButtonTitle>
                <ButtonDescription>
                  Place your ships and battle the computer
                </ButtonDescription>
              </MenuButton>
            </MenuButtons>
          </MenuContainer>
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        {renderContent()}
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;

const AppContainer = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
`;

const BackButton = styled.button`
  position: fixed;
  top: ${({ theme }) => theme.spacing.md};
  left: ${({ theme }) => theme.spacing.md};
  z-index: 100;
  
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.mobile.body};
  font-weight: 600;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  border: 2px solid ${({ theme }) => theme.colors.border};

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundDark};
    border-color: ${({ theme }) => theme.colors.borderActive};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.large};
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.borderActive};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    
    &:hover {
      transform: none;
    }

    &:active {
      transform: none;
    }
  }
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.background};
  text-align: center;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const MenuTitle = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.mobile.title};
  font-weight: bold;
  margin: 0;
  line-height: 1.2;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.title};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: ${({ theme }) => theme.typography.desktop.title};
  }
`;

const MenuSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.typography.mobile.body};
  margin: 0;
  line-height: 1.4;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.body};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: ${({ theme }) => theme.typography.desktop.body};
  }
`;

const MenuButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  max-width: 400px;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
    max-width: 800px;
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

const MenuButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  padding: ${({ theme }) => theme.spacing.xl};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  background-color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  
  flex: 1;
  min-height: 140px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    border-color: ${({ theme }) => theme.colors.borderActive};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.large};
  }

  &:active {
    transform: translateY(0);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.borderActive};
    outline-offset: 2px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    min-height: 160px;
    padding: ${({ theme }) => theme.spacing.xxl};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    
    &:hover {
      transform: none;
    }

    &:active {
      transform: none;
    }
  }
`;

const ButtonTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.mobile.subtitle};
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.subtitle};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: ${({ theme }) => theme.typography.desktop.subtitle};
  }
`;

const ButtonDescription = styled.div`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.typography.mobile.body};
  line-height: 1.4;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.tablet.body};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: ${({ theme }) => theme.typography.desktop.body};
  }
`;
