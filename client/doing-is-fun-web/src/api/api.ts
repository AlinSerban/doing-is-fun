const ENDPOINT = "http://localhost:3000";

export async function postWorkout(
  type: string,
  duration: number,
  token: string
) {
  const res = await fetch(`${ENDPOINT}/api/track/workouts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      workout_type: type,
      duration,
      entry_date: new Date().toISOString().split("T")[0],
    }),
  });
  console.log("postWorkout token: " + token);
  if (!res.ok) throw new Error("Not authorized");
  return res.json();
}

export async function postNutrition(
  consumed: number,
  burned: number,
  token: string
) {
  const res = await fetch(`${ENDPOINT}/api/track/nutrition`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      calories_consumed: consumed,
      calories_burned: burned,
      entry_date: new Date().toISOString().split("T")[0],
    }),
  });

  if (!res.ok) throw new Error("Not authorized");
  return res.json();
}

export async function postActivity(
  type: string,
  duration: number,
  token: string
) {
  const res = await fetch(`${ENDPOINT}/api/track/activities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      activity_type: type,
      duration,
      entry_date: new Date().toISOString().split("T")[0],
    }),
  });

  if (!res.ok) throw new Error("Failed to log activity");
  return res.json();
}

export async function fetchWorkoutSummary(token: string) {
  const res = await fetch(`${ENDPOINT}/api/track/workouts/summary`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("postWorkout token: " + token);
  if (!res.ok) throw new Error("Failed to fetch workout summary");
  return res.json();
}

export async function fetchWorkoutHistory(token: string) {
  const res = await fetch(`${ENDPOINT}/api/track/workouts/history`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch workout history");
  return res.json();
}

export async function fetchNutritionHistory(token: string) {
  const res = await fetch(`${ENDPOINT}/api/track/nutrition/history`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch nutrition history");
  return res.json();
}

export async function fetchActivityHistory(token: string) {
  const res = await fetch(`${ENDPOINT}/api/track/activities/history`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch activity history");
  return res.json();
}
