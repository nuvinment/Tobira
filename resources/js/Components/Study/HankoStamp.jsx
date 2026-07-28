export default function HankoStamp({ stamped, kanji = '修', size = 88 }) {
    return (
        <div
            className={stamped ? 'hanko-stamped' : 'hanko-ghost'}
            style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <span
                className="font-japanese"
                style={{
                    fontSize: size * 0.4,
                    color: stamped ? '#fff' : 'rgba(28, 20, 15, 0.3)',
                    lineHeight: 1,
                }}
            >
                {kanji}
            </span>
        </div>
    );
}
