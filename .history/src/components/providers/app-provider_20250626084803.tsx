// Single provider for everything
"use client";
import { Provider } from "react-redux";
import type React from "react";

import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from "@/lib/store";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
