const OPTIONS = [
    { rating: 0, label: 'Again', sub: '<10m', color: '#DC2626', bg: '#FEF2F2' },
    { rating: 1, label: 'Hard', sub: '1d', color: '#D97706', bg: '#FFFBEB' },
    { rating: 2, label: 'Good', sub: '3d', color: '#059669', bg: '#ECFDF5' },
    { rating: 3, label: 'Easy', sub: '7d+', color: '#2563EB', bg: '#EFF6FF' },
];

export default function RatingButtons({ onRate, disabled = false }) {
    return (
        <div className="grid grid-cols-4 gap-2 w-full">
            {OPTIONS.map((opt) => (
                <button
                    key={opt.rating}
                    type="button"
                    disabled={disabled}
                    onClick={() => onRate(opt.rating)}
                    style={{ background: opt.bg, color: opt.color }}
                    className="flex flex-col items-center py-3 rounded-xl font-semibold text-sm transition-transform hover:scale-[1.03] disabled:opacity-50 disabled:hover:scale-100"
                >
                    <span>{opt.label}</span>
                    <span className="text-[10px] opacity-70 font-normal mt-0.5">{opt.sub}</span>
                </button>
            ))}
        </div>
    );
}
