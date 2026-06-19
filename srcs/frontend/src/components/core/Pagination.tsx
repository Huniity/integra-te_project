interface PaginationProps {
    page: number
    totalPages: number
    totalItems: number
    pageSize: number
    onPage: (page: number) => void
}

export default function Pagination({ page, totalPages, totalItems, pageSize, onPage }: PaginationProps) {
    if (totalPages <= 1) return null

    const from = (page - 1) * pageSize + 1
    const to = Math.min(page * pageSize, totalItems)

    return (
        <div className="shrink-0 flex flex-col items-center gap-1.5 py-3 border-t border-white/20">
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPage(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 bg-white/80 text-gray-600 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                    ← Anterior
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                        key={p}
                        onClick={() => onPage(p)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            p === page
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'border border-gray-200 bg-white/80 text-gray-500 hover:bg-white'
                        }`}
                    >
                        {p}
                    </button>
                ))}
                <button
                    onClick={() => onPage(page + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 bg-white/80 text-gray-600 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                    Seguinte →
                </button>
            </div>
            <p className="text-xs text-white/70 font-medium">
                {from}–{to} de {totalItems}
            </p>
        </div>
    )
}
