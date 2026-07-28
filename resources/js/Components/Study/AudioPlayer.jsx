import { useRef, useState } from 'react';

export default function AudioPlayer({ src }) {
    const audioRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [error, setError] = useState(false);

    if (!src) {
        return (
            <button
                type="button"
                disabled
                title="No audio available for this card"
                className="w-9 h-9 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center cursor-not-allowed"
            >
                <SpeakerIcon muted />
            </button>
        );
    }

    function toggle(e) {
        e.stopPropagation();
        if (!audioRef.current) return;

        if (playing) {
            audioRef.current.pause();
            setPlaying(false);
            return;
        }

        audioRef.current
            .play()
            .then(() => setPlaying(true))
            .catch(() => setError(true));
    }

    return (
        <>
            <button
                type="button"
                onClick={toggle}
                title={error ? 'Could not play audio' : 'Play pronunciation'}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                    error ? 'bg-red-50 text-red-400' : 'bg-[#FCE8EC] text-[#BC002D] hover:bg-[#F8D0D8]'
                }`}
            >
                <SpeakerIcon muted={error} />
            </button>
            <audio
                ref={audioRef}
                src={src}
                onEnded={() => setPlaying(false)}
                onError={() => setError(true)}
                className="hidden"
            />
        </>
    );
}

function SpeakerIcon({ muted }) {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            {!muted && <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />}
            {muted && <line x1="23" y1="9" x2="17" y2="15" />}
            {muted && <line x1="17" y1="9" x2="23" y2="15" />}
        </svg>
    );
}
