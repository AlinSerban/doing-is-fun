import { useEffect, useState } from "react";
import LogWorkout from "./LogWorkout";
import ExpandableCard from "./ui/ExpandableCard";
import { fetchWorkoutSummary } from "../api/api";
import WorkoutChart from "./WorkoutChart";
import { useAccessToken } from "../hooks/useAccessToken";

type SummaryData = {
    totalMinutes: number,
    mostFrequentType: string
}

export default function WorkoutCard() {
    const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
    const [error, setError] = useState("");
    const [accessToken] = useAccessToken();

    useEffect(() => {
        if (!accessToken) return;
        fetchWorkoutSummary(accessToken)
            .then(setSummaryData)
            .catch((err) => setError(err.message));
    }, [accessToken])

    const summary = summaryData ? (
        <>
            <p>Total this week: <strong>{summaryData.totalMinutes}</strong></p>
            <p>Most frequent: <strong>{summaryData.mostFrequentType}</strong></p>
        </>
    ) : (
        <p>Loading summary...</p>
    );

    return (
        <ExpandableCard title="🏋️ Workouts" summary={summary}>
            {error && <p className="text-red-400">{error}</p>}
            <LogWorkout />
            <WorkoutChart />
        </ExpandableCard>
    )
}