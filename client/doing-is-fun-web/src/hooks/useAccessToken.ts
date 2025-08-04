import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function useAccessToken() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAccessToken must be used inside AuthProvider");
  return [context.accessToken, context.setAccessToken] as const;
}
