import { useGetNutritionHistoryQuery } from "../store/api";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { useAccessToken } from "../hooks/useAccessToken";

// type NutritionChart = {
//     entry_date: string;
//     total_consumed: number;
//     total_burned: number
// }

export default function NutritionChart() {
    // const [data, setData] = useState<NutritionChart[]>([]);
    const [accessToken] = useAccessToken();

    const { data = [], isLoading, error } = useGetNutritionHistoryQuery(
        undefined,
        { skip: !accessToken }
    );

    // useEffect(() => {
    //     async function loadData() {
    //         if (!accessToken) return;
    //         try {
    //             const res = await fetchNutritionHistory(accessToken);
    //             setData(res);
    //         }

    //         catch (err) {
    //             console.error(err);
    //         }
    //     }
    //     loadData();
    // }, [accessToken])

    if (isLoading) return <p>Loading chart…</p>;
    if (error) return <p className="text-red-400">Failed to load chart</p>;

    return (
        <div className="bg-[#1e1e1e] p-4 rounded text-white shadow-md">
            <h3 className="text-lg font-bold mb-4">Nutrition History (Last 30 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 50 }}>
                    <CartesianGrid stroke="#444" strokeDasharray="3 3" />
                    <XAxis
                        dataKey="entry_date"
                        interval="preserveStartEnd"
                        tick={{ fontSize: 11, fill: "#ccc" }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        tickFormatter={(value) => {
                            const date = new Date(value);
                            return date.toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                // hour: "numeric",
                                // minute: "2-digit",
                                // hour12: true,
                            });
                        }}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: "#ccc" }}
                        label={{
                            value: "Calories",
                            angle: -90,
                            position: "insideLeft",
                            fill: "#ccc",
                            fontSize: 12,
                        }}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: "#333", borderColor: "#666" }}
                        labelStyle={{ color: "#fff" }}
                        itemStyle={{ color: "#fff" }}
                        labelFormatter={(value) => {
                            const date = new Date(value);
                            return date.toLocaleString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                // hour: "numeric",
                                // minute: "2-digit",
                                // hour12: true,
                            });
                        }}
                        formatter={(value, name) => {
                            if (name === "total_consumed") return [`${value} kcal`, "Calories Consumed"];
                            if (name === "total_burned") return [`${value} kcal`, "Calories Burned"];
                            return [value, name];
                        }}
                    />
                    <Line type="monotone" dataKey="total_consumed" stroke="#00e676" strokeWidth={2} />
                    <Line type="monotone" dataKey="total_burned" stroke="#ff7043" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}