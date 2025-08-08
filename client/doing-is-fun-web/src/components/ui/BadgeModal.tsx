import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { clearUnlocked, type Badge } from '../../store/slices/badgeSlice';


export function BadgeModal() {
    const dispatch = useDispatch();
    const unlocked = useSelector((state: RootState) => state.badge.unlocked);

    if (unlocked.length === 0) {
        return null;
    }

    // Show the first newly unlocked badge
    const badge: Badge = unlocked[0];

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-lg text-center max-w-sm">
                {badge.icon_url && (
                    <img src={badge.icon_url} alt={badge.name} className="mx-auto mb-4 h-16 w-16" />
                )}
                <h2 className="text-2xl font-bold mb-2">🏅 {badge.name}</h2>
                <p className="mb-4">{badge.description}</p>
                <button
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={() => dispatch(clearUnlocked())}
                >
                    Awesome!
                </button>
            </div>
        </div>
    );
}
