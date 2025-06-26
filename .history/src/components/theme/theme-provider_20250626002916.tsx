// Enhanced theme provider
"use client";

import { useThemeStore } from "@/lib/themes/store";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type React from "react";
import { useEffect } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { currentTheme, mode, customizations, setMode } = useThemeStore();

  useEffect(() => {
    // Apply theme on mount and when theme changes
    const applyTheme = () => {
      const root = document.documentElement;
      const isDark =
        mode === "dark" ||
        (mode === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);

      const colors = isDark
        ? currentTheme.colors.dark
        : currentTheme.colors.light;

      // Apply all theme variables
      Object.entries(colors).forEach(([key, value]) => {
        const cssVar = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
        root.style.setProperty(cssVar, value);
      });

      // Apply fonts
      root.style.setProperty("--font-sans", currentTheme.fonts.sans.join(", "));
      root.style.setProperty("--font-mono", currentTheme.fonts.mono.join(", "));
      if (currentTheme.fonts.heading) {
        root.style.setProperty(
          "--font-heading",
          currentTheme.fonts.heading.join(", ")
        );
      }

      // Apply spacing
      const spacing =
        currentTheme.spacing.scale * (customizations.spacing || 1);
      root.style.setProperty("--spacing-scale", spacing.toString());

      // Apply border radius
      Object.entries(currentTheme.borderRadius).forEach(([key, value]) => {
        root.style.setProperty(`--radius-${key}`, value);
      });

      // Apply animations
      const animationsEnabled =
        customizations.animations !== false && currentTheme.animations.enabled;
      root.style.setProperty(
        "--animation-duration",
        animationsEnabled ? currentTheme.animations.duration : "0ms"
      );

      // Apply customizations
      if (customizations.primaryColor) {
        root.style.setProperty("--primary", customizations.primaryColor);
      }

      if (customizations.fontFamily) {
        root.style.setProperty(
          "--font-sans",
          `${customizations.fontFamily}, ${currentTheme.fonts.sans.join(", ")}`
        );
      }
    };

    applyTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (mode === "system") {
        applyTheme();
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [currentTheme, mode, customizations]);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={mode}
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
