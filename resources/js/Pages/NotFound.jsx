import { Link } from 'react-router-dom';
import HankoStamp from '../Components/Study/HankoStamp';

export default function NotFound() {
    return (
        <div className="min-h-screen washi-bg flex flex-col items-center justify-center gap-4 text-center px-6">
            <HankoStamp stamped={false} kanji="無" size={88} />
            <h1 className="text-xl font-semibold text-stone-800">Page not found</h1>
            <p className="text-sm text-stone-500 max-w-sm">
                The page you're looking for doesn't exist, or you don't have access to it.
            </p>
            <Link
                to="/"
                className="px-6 py-3 rounded-xl text-sm font-semibold bg-[#BC002D] text-white hover:bg-[#A30026] transition-all"
            >
                Back to Home
            </Link>
        </div>
    );
}
