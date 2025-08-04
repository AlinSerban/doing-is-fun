export interface AuthUser {
  id: number;
  full_name: string;
  email: string;
  username: string;
}
interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
}
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
const initialState: AuthState = { user: null, accessToken: null };
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; accessToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
