import LogWorkout from "./LogWorkout";
import ExpandableCard from "./ui/ExpandableCard";
import WorkoutChart from "./WorkoutChart";
import { useAccessToken } from "../hooks/useAccessToken";
import { useGetWorkoutSummaryQuery } from "../store/api";

// type SummaryData = {
//     totalMinutes: number,
//     mostFrequentType: string
// }

export default function WorkoutCard() {
    const [accessToken] = useAccessToken();

    const {
        data: summaryData,
        error,
        isLoading,
    } = useGetWorkoutSummaryQuery(undefined, {
        // only run once we have a token
        skip: !accessToken,
    });
    // const [error, setError] = useState("");
    // const [refreshKey, setRefreshKey] = useState(0);

    // useEffect(() => {
    //     console.log('[WorkoutCard] useEffect firing — refreshKey:', refreshKey);
    //     if (!accessToken) return;
    //     fetchWorkoutSummary(accessToken)
    //         .then(setSummaryData)
    //         .catch((err) => setError(err.message));
    // }, [accessToken, refreshKey])

    // const summary = summaryData ? (
    //     <>
    //         <p>Total this week: <strong>{summaryData.totalMinutes}</strong></p>
    //         <p>Most frequent: <strong>{summaryData.mostFrequentType}</strong></p>
    //     </>
    // ) : (
    //     <p>Loading summary...</p>
    // );

    const summary = isLoading
        ? <p>Loading summary…</p>
        : error
            ? <p className="text-red-400">Failed to load summary</p>
            : (
                <>
                    <p>Total this week: <strong>{summaryData!.totalMinutes}</strong></p>
                    <p>Most frequent: <strong>{summaryData!.mostFrequentType}</strong></p>
                </>
            );

    return (
        <ExpandableCard title="🏋️ Workouts" summary={summary}>
            <LogWorkout />
            <WorkoutChart />
        </ExpandableCard>
    )
}