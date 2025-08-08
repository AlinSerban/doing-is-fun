import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Badge {
  id: number;
  key: string;
  name: string;
  description: string;
  icon_url?: string;
}

interface BadgeState {
  unlocked: Badge[];
}

const initialState: BadgeState = {
  unlocked: [],
};

export const badgeSlice = createSlice({
  name: "badges",
  initialState,
  reducers: {
    addBadges(state, action: PayloadAction<Badge[]>) {
      // Append newly unlocked badges, avoiding duplicates
      action.payload.forEach((badge) => {
        if (!state.unlocked.find((b) => b.key === badge.key)) {
          state.unlocked.push(badge);
        }
      });
    },
    clearUnlocked(state) {
      state.unlocked = [];
    },
  },
});

export const { addBadges, clearUnlocked } = badgeSlice.actions;
export default badgeSlice.reducer;
