import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const tokenSlice = createSlice({
  name: "token",
  initialState: { accessToken: null as string | null },
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    clearAccessToken: (state) => {
      state.accessToken = null;
    },
  },
});

export const { setAccessToken, clearAccessToken } = tokenSlice.actions;
export default tokenSlice.reducer;
