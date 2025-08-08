import { useState } from "react";
import { useAccessToken } from "../hooks/useAccessToken";
import { useAddWorkoutMutation } from "../store/api";

// interface LogWorkoutProps {
//     onAdd?: () => void;
// }

export default function LogWorkout() {
    const [type, setType] = useState("");
    const [duration, setDuration] = useState(0);
    const [message, setMessage] = useState("");
    const [accessToken] = useAccessToken();

    const [addWorkout, { isLoading }] = useAddWorkoutMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!accessToken) {
            setMessage("You must be logged in.");
            return;
        }

        try {
            // const response = await postWorkout(type, duration, accessToken);
            // console.log('[LogWorkout] postWorkout succeeded, about to call onAdd');
            // onAdd?.();
            // console.log('[LogWorkout] onAdd callback has run');
            await addWorkout({
                workout_type: type,
                duration,
                entry_date: new Date().toISOString().split("T")[0],
            }).unwrap();
            setMessage("Workout logged!");
            setType("");
            setDuration(0);
        }
        catch (err: unknown) {
            if (err instanceof Error) {
                setMessage(err.message || "Failed to log workout.");
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-white">
            <h2 className="text-xl font-bold">Log Workout</h2>

            <input
                type="text"
                placeholder="Workout Type (e.g. gym, running)"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2 bg-[#2a2a2a] rounded"
            />

            <input
                type="number"
                placeholder="Duration (minutes)"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-4 py-2 bg-[#2a2a2a] rounded"
            />

            <button type="submit" className="bg-blue-600 px-6 py-2 rounded">
                {isLoading ? "Saving…" : "Save"}
            </button>

            {message && <p className="mt-2">{message}</p>}
        </form>
    )
}