export default function ScenarioBadge({ scenario, jlptLevel }) {
    return (
        <div className="inline-flex items-center gap-2">
            {scenario && (
                <span className="text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-[#FCE8EC] text-[#BC002D]">
                    {scenario}
                </span>
            )}
            {jlptLevel && (
                <span className="text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-stone-100 text-stone-500">
                    {jlptLevel}
                </span>
            )}
        </div>
    );
}
