export default function ProgressBar({ current, total }) {
    const pct = total > 0 ? Math.round((current / total) * 100) : 0;

    return (
        <div className="w-full">
            <div className="flex justify-between text-xs text-stone-500 mb-1.5">
                <span>{current} / {total} cards</span>
                <span>{pct}%</span>
            </div>
            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-[#BC002D] rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}
