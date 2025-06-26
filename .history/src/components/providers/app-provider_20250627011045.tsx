"use client";

import { Toaster } from "@/components/ui/sonner";
import { persistor, store } from "@/lib/redux/store";
import { ThemeProvider } from "@/lib/themes/theme-provider";
import { SessionProvider } from "next-auth/react";
import type React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
// import { NotificationProvider } from "./notification-provider";

interface AppProviderProps {
  children: React.ReactNode;
  session?: any;
}

export function AppProvider({ children, session }: AppProviderProps) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </SessionProvider>
  );
}
