import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<Omit<Notification, "id">>
    ) => {
      const notification: Notification = {
        id: Date.now().toString(),
        duration: 5000,
        ...action.payload,
      };
      state.notifications.push(notification);
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },

    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { addNotification, removeNotification, clearNotifications } =
  notificationSlice.actions;

export default notificationSlice.reducer;
