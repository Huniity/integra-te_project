import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PerPageConfig {
    mobile?: number;
    tablet?: number;
    desktop?: number;
}

function usePerPage(config?: PerPageConfig): number {
    const mobile  = config?.mobile  ?? 1;
    const tablet  = config?.tablet  ?? 3;
    const desktop = config?.desktop ?? 6;
    const [perPage, setPerPage] = useState(desktop);
    useEffect(() => {
        const update = () => {
            if (window.innerWidth < 640)  setPerPage(mobile);
            else if (window.innerWidth < 1024) setPerPage(tablet);
            else setPerPage(desktop);
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, [mobile, tablet, desktop]);
    return perPage;
}

export function useCarousel<T>(items: T[], config?: PerPageConfig) {
    const perPage = usePerPage(config);
    const [page, setPage] = useState(0);
    const touchStartX = useRef(0);

    const totalPages = Math.max(1, Math.ceil(items.length / perPage));
    const safePage = Math.min(page, totalPages - 1);

    useEffect(() => { setPage(0); }, [items.length, perPage]);

    const prev = () => setPage(p => Math.max(0, p - 1));
    const next = () => setPage(p => Math.min(totalPages - 1, p + 1));

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const tag = (document.activeElement as HTMLElement)?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
            if (e.key === 'ArrowLeft')  prev();
            if (e.key === 'ArrowRight') next();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalPages]);

    const pageItems = items.slice(safePage * perPage, (safePage + 1) * perPage);

    const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
    const onTouchEnd   = (e: React.TouchEvent) => {
        const dx = touchStartX.current - e.changedTouches[0].clientX;
        if (dx > 50)  next();
        if (dx < -50) prev();
    };

    return { page: safePage, totalPages, pageItems, prev, next, setPage, onTouchStart, onTouchEnd };
}

interface NavProps {
    page: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
    onDot: (i: number) => void;
}

export function CarouselNav({ page, totalPages, onPrev, onNext, onDot }: NavProps) {
    return (
        <div className="flex items-center justify-center gap-3 shrink-0 h-10">
            {totalPages > 1 && (
                <>
                    <button
                        onClick={onPrev}
                        disabled={page === 0}
                        aria-label="Página anterior"
                        className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-white/80 shadow-md text-blue-600 disabled:opacity-30 hover:bg-white transition-colors cursor-pointer"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <div className="flex items-center gap-1.5">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => onDot(i)}
                                aria-label={`Página ${i + 1}`}
                                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                                    i === page ? 'w-5 bg-blue-600' : 'w-2 bg-white/60 hover:bg-white'
                                }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={onNext}
                        disabled={page === totalPages - 1}
                        aria-label="Página seguinte"
                        className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-white/80 shadow-md text-blue-600 disabled:opacity-30 hover:bg-white transition-colors cursor-pointer"
                    >
                        <ChevronRight size={18} />
                    </button>
                </>
            )}
        </div>
    );
}
