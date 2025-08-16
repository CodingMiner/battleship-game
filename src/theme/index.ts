export const breakpoints = {
  mobile: "320px",
  mobileLarge: "480px",
  tablet: "768px",
  desktop: "1024px",
  large: "1440px",
} as const;

export const theme = {
  colors: {
    water: "#4A90E2",
    waterHover: "#357ABD",
    hit: "#E74C3C",
    hitGlow: "#FF6B6B",
    miss: "#95A5A6",
    missLight: "#BDC3C7",
    ship: "#2C3E50",
    background: "#ECF0F1",
    backgroundDark: "#D5DBDB",
    border: "#BDC3C7",
    borderActive: "#3498DB",
    text: "#2C3E50",
    textLight: "#7F8C8D",
    success: "#27AE60",
    successLight: "#58D68D",
    warning: "#F39C12",
    error: "#E74C3C",
    white: "#FFFFFF",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
  breakpoints,
  grid: {
    mobile: {
      cellSize: "26px",
      gap: "1px",
      containerPadding: "8px",
      maxWidth: "280px",
    },

    mobileLarge: {
      cellSize: "32px",
      gap: "2px",
      containerPadding: "12px",
      maxWidth: "360px",
    },

    tablet: {
      cellSize: "42px",
      gap: "3px",
      containerPadding: "16px",
      maxWidth: "480px",
    },

    desktop: {
      cellSize: "52px",
      gap: "4px",
      containerPadding: "24px",
      maxWidth: "600px",
    },

    large: {
      cellSize: "58px",
      gap: "5px",
      containerPadding: "32px",
      maxWidth: "680px",
    },
  },
  transitions: {
    fast: "0.15s ease-in-out",
    normal: "0.3s ease-in-out",
    slow: "0.5s ease-in-out",
    bounce: "0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },
  shadows: {
    small: "0 2px 4px rgba(0, 0, 0, 0.1)",
    medium: "0 4px 8px rgba(0, 0, 0, 0.15)",
    large: "0 8px 16px rgba(0, 0, 0, 0.2)",
    glow: "0 0 20px rgba(74, 144, 226, 0.3)",
    hitGlow: "0 0 15px rgba(231, 76, 60, 0.5)",
    interactive: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  borderRadius: {
    small: "4px",
    medium: "8px",
    large: "12px",
    round: "50%",
  },
  typography: {
    mobile: {
      title: "20px",
      subtitle: "16px",
      body: "14px",
      small: "12px",
    },
    tablet: {
      title: "28px",
      subtitle: "20px",
      body: "16px",
      small: "14px",
    },
    desktop: {
      title: "36px",
      subtitle: "24px",
      body: "18px",
      small: "16px",
    },
  },

  touch: {
    minTarget: "44px",
    comfortableTarget: "48px",
  },

  easing: {
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },
} as const;

export type Theme = typeof theme;
