import ExpandableCard from "./ui/ExpandableCard";
import NutritionChart from "./NutritionChart";
import LogNutrition from "./LogNutrition";

export default function NutritionCard() {
    const summary = (
        <>
            <p>Track your energy intake and expenditure</p>
            <p className="text-sm text-gray-400">More features coming soon...</p>
        </>
    );

    return (
        <ExpandableCard title="🍎 Nutrition" summary={summary}>
            <LogNutrition />
            <NutritionChart />
        </ExpandableCard>
    );
}
