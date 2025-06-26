// Theme store using Zustand
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { themePresets } from "./presets";
import type { ThemeConfig } from "./types";

interface ThemeState {
  // Current theme
  currentTheme: ThemeConfig;
  customThemes: ThemeConfig[];

  // Theme mode
  mode: "light" | "dark" | "system";

  // Dynamic customizations
  customizations: {
    primaryColor?: string;
    fontFamily?: string;
    borderRadius?: string;
    spacing?: number;
    animations?: boolean;
  };

  // Actions
  setTheme: (theme: ThemeConfig) => void;
  setMode: (mode: "light" | "dark" | "system") => void;
  addCustomTheme: (theme: ThemeConfig) => void;
  updateCustomizations: (
    customizations: Partial<ThemeState["customizations"]>
  ) => void;
  resetCustomizations: () => void;

  // API integration
  loadThemeFromAPI: (themeId: string) => Promise<void>;
  saveThemeToAPI: (theme: ThemeConfig) => Promise<void>;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: themePresets[0],
      customThemes: [],
      mode: "system",
      customizations: {},

      setTheme: (theme) => {
        set({ currentTheme: theme });
        applyThemeToDOM(theme, get().mode, get().customizations);
      },

      setMode: (mode) => {
        set({ mode });
        applyThemeToDOM(get().currentTheme, mode, get().customizations);
      },

      addCustomTheme: (theme) => {
        set((state) => ({
          customThemes: [...state.customThemes, theme],
        }));
      },

      updateCustomizations: (customizations) => {
        const newCustomizations = {
          ...get().customizations,
          ...customizations,
        };
        set({ customizations: newCustomizations });
        applyThemeToDOM(get().currentTheme, get().mode, newCustomizations);
      },

      resetCustomizations: () => {
        set({ customizations: {} });
        applyThemeToDOM(get().currentTheme, get().mode, {});
      },

      loadThemeFromAPI: async (themeId) => {
        try {
          const response = await fetch(`/api/themes/${themeId}`);
          const theme = await response.json();
          get().setTheme(theme);
        } catch (error) {
          console.error("Failed to load theme from API:", error);
        }
      },

      saveThemeToAPI: async (theme) => {
        try {
          await fetch("/api/themes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(theme),
          });
        } catch (error) {
          console.error("Failed to save theme to API:", error);
        }
      },
    }),
    {
      name: "theme-store",
      partialize: (state) => ({
        currentTheme: state.currentTheme,
        customThemes: state.customThemes,
        mode: state.mode,
        customizations: state.customizations,
      }),
    }
  )
);

// Apply theme to DOM
function applyThemeToDOM(
  theme: ThemeConfig,
  mode: "light" | "dark" | "system",
  customizations: ThemeState["customizations"]
) {
  const root = document.documentElement;
  const isDark =
    mode === "dark" ||
    (mode === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const colors = isDark ? theme.colors.dark : theme.colors.light;

  // Apply color variables
  Object.entries(colors).forEach(([key, value]) => {
    const cssVar = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
    root.style.setProperty(cssVar, value);
  });

  // Apply font variables
  root.style.setProperty("--font-sans", theme.fonts.sans.join(", "));
  root.style.setProperty("--font-mono", theme.fonts.mono.join(", "));
  if (theme.fonts.heading) {
    root.style.setProperty("--font-heading", theme.fonts.heading.join(", "));
  }

  // Apply spacing
  const spacing = theme.spacing.scale * (customizations.spacing || 1);
  root.style.setProperty("--spacing-scale", spacing.toString());
  root.style.setProperty("--container-padding", theme.spacing.containerPadding);
  root.style.setProperty("--section-spacing", theme.spacing.sectionSpacing);

  // Apply border radius
  const radiusMultiplier =
    customizations.borderRadius === "rounded"
      ? 1.5
      : customizations.borderRadius === "square"
      ? 0.5
      : 1;
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    const adjustedValue = `calc(${value} * ${radiusMultiplier})`;
    root.style.setProperty(`--radius-${key}`, adjustedValue);
  });

  // Apply animations
  const animationsEnabled =
    customizations.animations !== false && theme.animations.enabled;
  root.style.setProperty(
    "--animation-duration",
    animationsEnabled ? theme.animations.duration : "0ms"
  );
  root.style.setProperty("--animation-easing", theme.animations.easing);

  // Apply custom primary color if set
  if (customizations.primaryColor) {
    root.style.setProperty("--primary", customizations.primaryColor);
  }

  // Apply custom font if set
  if (customizations.fontFamily) {
    root.style.setProperty(
      "--font-sans",
      `${customizations.fontFamily}, ${theme.fonts.sans.join(", ")}`
    );
  }

  // Set dark mode class
  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}
