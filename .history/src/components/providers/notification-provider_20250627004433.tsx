"use client";

import type React from "react";

import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { removeNotification } from "@/lib/redux/slices/notification-slice";
import { toast } from "@/hooks/use-toast";

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const notifications = useAppSelector(
    (state) => state.notifications.notifications
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    notifications.forEach((notification) => {
      toast({
        title: notification.title,
        description: notification.message,
        variant: notification.type === "error" ? "destructive" : "default",
      });

      // Auto remove notification
      if (notification.duration && notification.duration > 0) {
        setTimeout(() => {
          dispatch(removeNotification(notification.id));
        }, notification.duration);
      }
    });
  }, [notifications, dispatch]);

  return <>{children}</>;
}
