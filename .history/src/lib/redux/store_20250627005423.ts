import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";

// API slices
import { authApi } from "./api/auth-api";
import { productsApi } from "./api/products-api";
import { ordersApi } from "./api/orders-api";
import { usersApi } from "./api/users-api";

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
  [productsApi.reducerPath]: productsApi.reducer,
  [ordersApi.reducerPath]: ordersApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,

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
      productsApi.middleware,
      ordersApi.middleware,
      usersApi.middleware
    ),
});

export const persistor = persistStore(store);

// Setup listeners for refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
