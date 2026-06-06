import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Theme = "light" | "dark";

// Side effect helper — syncs the DOM class + persists to localStorage.
function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem("theme", theme);
  } catch {
    /* ignore private-mode storage errors */
  }
}

const themeSlice = createSlice({
  name: "theme",
  // Initializes to 'light'; a useEffect in Providers reads localStorage and
  // dispatches setTheme on mount. The blocking script already set the .dark
  // class before paint, so there is no visual jump.
  initialState: { theme: "light" as Theme },
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      applyTheme(action.payload);
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      applyTheme(state.theme);
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
