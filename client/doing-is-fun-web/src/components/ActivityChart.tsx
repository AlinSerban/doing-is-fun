import { useEffect, useState } from "react";
import { fetchActivityHistory } from "../api/api";
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

type ActivityChartData = {
    entry_date: string;
    total_duration: number;
};

export default function ActivityChart() {
    const [data, setData] = useState<ActivityChartData[]>([]);
    const [accessToken] = useAccessToken();

    useEffect(() => {
        async function loadData() {
            if (!accessToken) return;
            try {
                const res = await fetchActivityHistory(accessToken);
                setData(res);
            }
            catch (err) {
                console.error(err);
            }
        }
        loadData();
    }, [accessToken])

    return (
        <div className="bg-[#1e1e1e] p-4 rounded text-white shadow-md">
            <h3 className="text-lg font-bold mb-4">Activity History (Last 30 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={data}
                    margin={{ top: 10, right: 20, left: 20, bottom: 50 }}
                >
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
                                // hour12: true
                            });
                        }}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: "#ccc" }}
                        label={{
                            value: "Minutes",
                            angle: -90,
                            position: "insideLeft",
                            fill: "#ccc",
                            fontSize: 12
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
                                // hour12: true
                            });
                        }}
                        formatter={(value, name) => {
                            if (name === "total_duration") {
                                return [`${value} min`, "Total Duration"];
                            }
                            return [value, name];
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="total_duration"
                        stroke="#00ff88"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}