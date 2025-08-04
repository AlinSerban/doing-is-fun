import ExpandableCard from "./ui/ExpandableCard";
import LogActivity from "./LogActivity";
import ActivityChart from "./ActivityChart";

export default function ActivityCard() {
    const summary = (
        <>
            <p>Log your focused sessions like coding, writing, or deep work.</p>
            <p className="text-sm text-gray-400">Charts and insights coming soon...</p>
        </>
    );

    return (
        <ExpandableCard title="🧠 Activity" summary={summary}>
            <LogActivity />
            <ActivityChart />
        </ExpandableCard>
    );
}
