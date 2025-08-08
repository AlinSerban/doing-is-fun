import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./index";
import type {
  WorkoutSummary,
  WorkoutHistoryItem,
  NutritionHistoryItem,
  ActivityHistoryItem,
  NewWorkout,
  NewNutrition,
  NewActivity,
} from "../types/tracking";
import { addXp, levelUp } from "./slices/xpSlice";
import { addBadges } from "./slices/badgeSlice";

interface Badge {
  id: number;
  key: string;
  name: string;
  description: string;
  icon_url?: string;
}
interface TrackResponse {
  message: string;
  xpGained: number;
  totalXp: number;
  unlockedBadges: Badge[];
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Workout", "Nutrition", "Activity"],
  endpoints: (builder) => ({
    getWorkoutSummary: builder.query<WorkoutSummary, void>({
      query: () => "track/workouts/summary",
      providesTags: ["Workout"],
    }),
    getWorkoutHistory: builder.query<WorkoutHistoryItem[], void>({
      query: () => "track/workouts/history",
      providesTags: ["Workout"],
    }),

    addWorkout: builder.mutation<TrackResponse, NewWorkout>({
      query: (newWorkout) => ({
        url: "track/workouts",
        method: "POST",
        body: newWorkout,
      }),
      invalidatesTags: ["Workout"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled, getState }) {
        try {
          const prevLevel = (getState() as RootState).xp.level;
          const { data } = await queryFulfilled;
          dispatch(addXp(data.xpGained));
          const newLevel = (getState() as RootState).xp.level;
          if (newLevel > prevLevel) {
            dispatch(levelUp());
          }
          if (data.unlockedBadges.length) {
            dispatch(addBadges(data.unlockedBadges));
          }
        } catch {
          console.error("Failed to add xp - addWorkout");
        }
      },
    }),

    getNutritionHistory: builder.query<NutritionHistoryItem[], void>({
      query: () => "track/nutrition/history",
      providesTags: ["Nutrition"],
    }),
    addNutrition: builder.mutation<TrackResponse, NewNutrition>({
      query: (body) => ({
        url: "track/nutrition",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Nutrition"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled, getState }) {
        try {
          const prevLevel = (getState() as RootState).xp.level;
          const { data } = await queryFulfilled;
          dispatch(addXp(data.xpGained));
          const newLevel = (getState() as RootState).xp.level;
          if (newLevel > prevLevel) {
            dispatch(levelUp());
          }
          if (data.unlockedBadges.length) {
            dispatch(addBadges(data.unlockedBadges));
          }
        } catch {
          console.error("Failed to add xp - addActivity");
        }
      },
    }),
    getActivityHistory: builder.query<ActivityHistoryItem[], void>({
      query: () => "track/activities/history",
      providesTags: ["Activity"],
    }),
    addActivity: builder.mutation<TrackResponse, NewActivity>({
      query: (body) => ({
        url: "track/activities",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Activity"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled, getState }) {
        try {
          const prevLevel = (getState() as RootState).xp.level;
          const { data } = await queryFulfilled;
          dispatch(addXp(data.xpGained));
          const newLevel = (getState() as RootState).xp.level;
          if (newLevel > prevLevel) {
            dispatch(levelUp());
          }
          if (data.unlockedBadges.length) {
            dispatch(addBadges(data.unlockedBadges));
          }
        } catch {
          console.error("Failed to add xp - addActivity");
        }
      },
    }),
  }),
});

export const {
  useGetWorkoutSummaryQuery,
  useGetWorkoutHistoryQuery,
  useAddWorkoutMutation,
  useGetNutritionHistoryQuery,
  useAddNutritionMutation,
  useGetActivityHistoryQuery,
  useAddActivityMutation,
} = api;
