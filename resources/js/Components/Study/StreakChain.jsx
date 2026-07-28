export default function StreakChain({ activityByDate = {} }) {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const iso = date.toISOString().slice(0, 10);
        const label = date.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 1);
        days.push({ iso, label, studied: (activityByDate[iso] || 0) > 0 });
    }

    return (
        <div className="flex items-center">
            {days.map((d, i) => (
                <div key={d.iso} className="flex items-center">
                    <div className="flex flex-col items-center gap-1">
                        <div
                            className="w-6 h-6 rounded-full border-2"
                            style={{
                                background: d.studied ? '#BC002D' : 'transparent',
                                borderColor: d.studied ? '#BC002D' : 'rgba(28,20,15,0.18)',
                                borderStyle: d.studied ? 'solid' : 'dashed',
                            }}
                        />
                        <span className="text-[9px] text-stone-400 uppercase">{d.label}</span>
                    </div>
                    {i < days.length - 1 && (
                        <div
                            className="w-3 h-[2px] mb-4"
                            style={{ background: d.studied && days[i + 1]?.studied ? '#BC002D' : 'rgba(28,20,15,0.12)' }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
