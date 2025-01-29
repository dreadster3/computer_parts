import defaultTheme from "tailwindcss/defaultTheme";
export enum EScreenSizeBreakpoints {
  sm,
  md,
  lg,
  xl,
  "2xl",
}

export function get_active_screen_size_breakpoint(): EScreenSizeBreakpoints {
  const breakpoints = {
    "2xl": defaultTheme.screens["2xl"],
    xl: defaultTheme.screens.xl,
    lg: defaultTheme.screens.lg,
    md: defaultTheme.screens.md,
    sm: defaultTheme.screens.sm,
  };

  const width = window.innerWidth;
  const keys = Object.keys(breakpoints);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const breakpoint = breakpoints[key as keyof typeof breakpoints];

    if (width > Number.parseInt(breakpoint)) {
      return EScreenSizeBreakpoints[key as keyof typeof EScreenSizeBreakpoints];
    }
  }

  return EScreenSizeBreakpoints.sm;
}
