import { useSelector, useDispatch } from 'react-redux';
import { clearLevelUp } from '../../store/slices/xpSlice';
import type { RootState } from '../../store';

export function LevelUpModal() {
    const dispatch = useDispatch();
    const level = useSelector((s: RootState) => s.xp.level);
    const justLeveled = useSelector((s: RootState) => s.xp.justLeveled);

    if (!justLeveled) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-lg text-center">
                <h2 className="text-2xl font-bold">🎉 Level {level} Unlocked!</h2>
                <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={() => dispatch(clearLevelUp())}
                >
                    Awesome!
                </button>
            </div>
        </div>
    );
}
