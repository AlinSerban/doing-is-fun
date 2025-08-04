import { useState } from "react";
import { postNutrition } from "../api/api";
import { useAccessToken } from "../hooks/useAccessToken";

export default function LogNutrition() {
    const [consumed, setConsumed] = useState(0);
    const [burned, setBurned] = useState(0);
    const [message, setMessage] = useState("");
    const [accessToken] = useAccessToken();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!accessToken) {
            setMessage("You must be logged in.");
            return;
        }

        try {
            const response = await postNutrition(consumed, burned, accessToken);
            setMessage(response.message || "Nutrition logged!");
            setConsumed(0);
            setBurned(0);
        }
        catch (err: unknown) {
            if (err instanceof Error) {
                setMessage(err.message || "Failed to log nutrition.");
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-white">
            <h2 className="text-xl font-bold">Log nutrition</h2>
            <input
                type="number"
                placeholder="Calories consumed"
                value={consumed}
                onChange={(e) => setConsumed(Number(e.target.value))}
                className="w-full px-4 py-2 bg-[#2a2a2a] rounded"
            />
            <input
                type="number"
                placeholder="Calories burned"
                value={burned}
                onChange={(e) => setBurned(Number(e.target.value))}
                className="w-full px-4 py-2 bg-[#2a2a2a] rounded"
            />

            <button type="submit" className="bg-blue-600 px-6 py-2 rounded">
                Save
            </button>

            {message && <p className="mt-2">{message}</p>}
        </form>
    )
}