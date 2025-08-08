export interface WorkoutSummary {
  totalMinutes: number;
  mostFrequentType: string;
}

export interface WorkoutHistoryItem {
  entry_date: string;
  total_duration: number;
}

export interface NutritionHistoryItem {
  entry_date: string;
  total_consumed: number;
  total_burned: number;
}

export interface ActivityHistoryItem {
  entry_date: string;
  total_duration: number;
}

export interface NewWorkout {
  workout_type: string;
  duration: number;
  entry_date: string;
}

export interface NewNutrition {
  calories_consumed: number;
  calories_burned: number;
  entry_date: string;
}

export interface NewActivity {
  activity_type: string;
  duration: number;
  entry_date: string;
}
