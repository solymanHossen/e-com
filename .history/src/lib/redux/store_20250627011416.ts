import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

// API slices
import { authApi } from "./api/auth-api";

import { ordersApi } from "./api/orders-api";

// Regular slices
import cartSlice from "./slices/cart-slice";
import notificationSlice from "./slices/notification-slice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart"], // Only persist cart data
};

const rootReducer = combineReducers({
  // API reducers
  [authApi.reducerPath]: authApi.reducer,

  [ordersApi.reducerPath]: ordersApi.reducer,

  // Regular reducers
  cart: cartSlice,
  notifications: notificationSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(
      authApi.middleware,

      ordersApi.middleware
    ),
});

export const persistor = persistStore(store);

// Setup listeners for refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
