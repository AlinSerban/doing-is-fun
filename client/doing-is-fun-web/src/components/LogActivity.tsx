import { useState } from "react";
import { useAccessToken } from "../hooks/useAccessToken";
import { useAddActivityMutation } from "../store/api";

export default function LogActivity() {
    const [type, setType] = useState("");
    const [duration, setDuration] = useState(0);
    const [message, setMessage] = useState("");
    const [accessToken] = useAccessToken();

    const [addActivity, { isLoading }] = useAddActivityMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!accessToken) {
            setMessage("You must be logged in.");
            return;
        }

        // type: type, duration, accessToken
        try {
            const response = await addActivity({
                activity_type: type,
                duration,
                entry_date: new Date().toISOString().split("T")[0]
            }).unwrap();
            setMessage(response.message || "Activity logged!");
            setType("");
            setDuration(0);
        }
        catch (err: unknown) {
            if (err instanceof Error) {
                setMessage(err.message || "Failed to log activity.");
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-white">
            <h2 className="text-xl font-bold">Log Activity</h2>

            <input
                type="text"
                placeholder="Activity Type (e.g. coding, studying)"
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