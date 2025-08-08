import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "../features/api/authApi";
import { api as trackingApi } from "./api";
import authReducer from "./slices/authSlice";
import xpReducer from "./slices/xpSlice";
import badgeReducer from "./slices/badgeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    xp: xpReducer,
    badge: badgeReducer,
    [authApi.reducerPath]: authApi.reducer,
    [trackingApi.reducerPath]: trackingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(trackingApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
