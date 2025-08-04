import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type ExpandableCardProps = {
    title: string,
    summary?: ReactNode,
    children: ReactNode
}

export default function ExpandableCard({ title, summary, children }: ExpandableCardProps) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="bg-[#1e1e1e] rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">{title}</h2>
                <button onClick={() => setExpanded(!expanded)} className="text-white">
                    {expanded ? <ChevronUp /> : <ChevronDown />}
                </button>
            </div>

            {summary && <div className="mb-4 text-sm text-gray-300">{summary}</div>}

            {expanded && (
                <div className="mt-4 space-y-4 transition-all duration-300">
                    {children}
                </div>
            )}
        </div>
    )
}