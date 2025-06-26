// Provider for an app using BOTH Redux and our Zustand Theme System
"use client";

import { ThemeProvider } from "@/lib/themes/theme-provider";
import type React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    // Provider for Redux state
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        {/* Provider for our Zustand-based theme system */}
        <ThemeProvider>{children}</ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
