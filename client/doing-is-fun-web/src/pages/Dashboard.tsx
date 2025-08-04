import ActivityCard from "../components/ActivityCard";
import NutritionCard from "../components/NutritionCard";
import WorkoutCard from "../components/WorkoutCard";

export default function Dashboard() {
    return (
        <div className="max-w-5xl mx-auto px-4 py-8 text-white">
            <h1 className="text-3xl font-bold mb-8">Welcome back!</h1>
            <div className="space-y-6">
                <WorkoutCard />
                <NutritionCard />
                <ActivityCard />
            </div>
        </div>
    );
}
