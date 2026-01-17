"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "@/lib/features/auth-slice";
import { fetchCurrentUser } from "@/services/auth.service";

export default function AuthSync() {
  const dispatch = useDispatch();

  useEffect(() => {
    const syncAuth = async () => {
      try {
        const user = await fetchCurrentUser();
        dispatch(loginSuccess(user));
      } catch (err) {
        dispatch(logout());
      }
    };

    syncAuth();
  }, [dispatch]);

  return null;
}
