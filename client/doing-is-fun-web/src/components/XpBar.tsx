import { useAppSelector } from "../store/hooks";
import { xpForLevel } from '../utils/leveling';

export default function XpBar() {
    const xp = useAppSelector(s => s.xp.current);
    const level = Math.floor(Math.sqrt(xp / 100));
    const nextXp = xpForLevel(level + 1);
    const prevXp = xpForLevel(level);

    const pct = Math.min(100, ((xp - prevXp) / (nextXp - prevXp)) * 100);

    return (
        <div className="w-full p-4 bg-transparent">
            <div className="w-full bg-gray-300 rounded h-4 overflow-hidden">
                <div
                    className="h-4 bg-green-500"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <div className="text-sm mt-1 text-white">
                {`Level ${level} — ${xp} / ${nextXp} XP`}
            </div>
        </div>
    )
}