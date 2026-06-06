"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { Provider, useDispatch } from "react-redux";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store, type AppDispatch } from "@/store";
import { setAccessToken, clearAccessToken } from "@/store/tokenSlice";
import { setTheme } from "@/store/themeSlice";
import { useAppSelector } from "@/hooks/redux";
import type { Session } from "next-auth";

// Syncs next-auth accessToken into Redux once on session load — no network call per request
function TokenSync() {
  const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (session?.accessToken) dispatch(setAccessToken(session.accessToken));
    else dispatch(clearAccessToken());
  }, [session?.accessToken, dispatch]);
  return null;
}

// Reads persisted theme on mount and syncs it into Redux. The blocking script
// in the root layout already set the .dark class, so there is no visual jump.
function ThemeInit() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      dispatch(setTheme(saved === "dark" || (!saved && prefersDark) ? "dark" : "light"));
    } catch {
      /* ignore */
    }
  }, [dispatch]);
  return null;
}

// ToastContainer needs the current theme; read it inside the Redux Provider tree.
function ThemedToastContainer() {
  const theme = useAppSelector((s) => s.theme.theme);
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      theme={theme === "dark" ? "dark" : "light"}
    />
  );
}

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <TokenSync />
        <ThemeInit />
        {children}
        <ThemedToastContainer />
      </Provider>
    </SessionProvider>
  );
}
