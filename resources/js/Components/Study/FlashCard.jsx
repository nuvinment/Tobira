import { useState } from 'react';
import AudioPlayer from './AudioPlayer';

export default function FlashCard({ card, flipped, onFlip }) {
    const [showFurigana, setShowFurigana] = useState(true);

    return (
        <div
            onClick={onFlip}
            style={{ perspective: '1600px' }}
            className="w-full max-w-lg mx-auto cursor-pointer select-none"
        >
            <div
                style={{
                    transformStyle: 'preserve-3d',
                    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    transition: 'transform 0.5s cubic-bezier(0.4, 0.2, 0.2, 1)',
                    minHeight: '340px',
                }}
                className="relative w-full"
            >
                {/* FRONT: Japanese term */}
                <div
                    style={{ backfaceVisibility: 'hidden' }}
                    className="absolute inset-0 rounded-3xl border border-stone-200/70 bg-white shadow-sm flex flex-col items-center justify-center px-8 py-10 text-center"
                >
                    {card.furigana && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowFurigana((v) => !v); }}
                            className="absolute top-4 right-4 text-[11px] font-semibold px-3 py-1.5 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 transition-colors"
                        >
                            {showFurigana ? 'Hide furigana' : 'Show furigana'}
                        </button>
                    )}

                    {card.furigana && showFurigana && (
                        <div className="font-japanese text-sm text-stone-400 mb-2">{card.furigana}</div>
                    )}
                    <div className="font-japanese text-4xl md:text-5xl font-medium text-stone-900">
                        {card.front_text}
                    </div>

                    <div className="absolute bottom-5 text-xs text-stone-400">Tap to flip</div>
                </div>

                {/* BACK: meaning, context, keigo */}
                <div
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    className="absolute inset-0 rounded-3xl border border-stone-200/70 bg-[#1A1512] shadow-sm flex flex-col items-center justify-center px-8 py-10 text-center gap-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="text-2xl font-semibold text-white">{card.back_text}</div>
                        <div onClick={(e) => e.stopPropagation()}>
                            <AudioPlayer src={card.audio_path} />
                        </div>
                    </div>

                    {card.keigo_form && (
                        <span className="text-[11px] font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-amber-400/10 text-amber-300">
                            {card.keigo_form}
                        </span>
                    )}

                    {card.context_sentence && (
                        <p className="font-japanese text-sm text-stone-300 max-w-sm leading-relaxed">
                            {card.context_sentence}
                        </p>
                    )}

                    <div className="absolute bottom-5 text-xs text-stone-500">Tap to flip back</div>
                </div>
            </div>
        </div>
    );
}
