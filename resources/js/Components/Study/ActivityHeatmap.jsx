function intensity(count) {
    if (count === 0) return 'rgba(28, 20, 15, 0.05)';
    if (count < 5) return '#B9C7D3';   // pale indigo — light activity
    if (count < 15) return '#5A8CA8';  // mid indigo-blue
    if (count < 30) return '#D6193F';  // warming to red
    return '#96001F';                  // deep red — heavy activity
}

export default function ActivityHeatmap({ data }) {
    const days = [];
    const byDate = Object.fromEntries((data || []).map((d) => [d.date, d.count]));

    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const iso = date.toISOString().slice(0, 10);
        days.push({ date: iso, count: byDate[iso] || 0 });
    }

    return (
        <div className="washi-bg border border-stone-200/70 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-stone-700 tracking-wide">30-Day Activity</h3>
                <div className="flex items-center gap-1 text-[10px] text-stone-400">
                    <span>Quiet</span>
                    {[0, 3, 10, 25, 40].map((c) => (
                        <span key={c} className="w-3 h-3 rounded-sm inline-block" style={{ background: intensity(c) }} />
                    ))}
                    <span>Focused</span>
                </div>
            </div>
            <div className="grid grid-cols-10 gap-1.5">
                {days.map((d) => (
                    <div
                        key={d.date}
                        title={`${d.date}: ${d.count} card${d.count !== 1 ? 's' : ''} reviewed`}
                        className="aspect-square rounded-sm"
                        style={{ background: intensity(d.count) }}
                    />
                ))}
            </div>
        </div>
    );
}
