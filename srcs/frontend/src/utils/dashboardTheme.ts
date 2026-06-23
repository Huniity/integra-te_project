export function dashboardTheme(isNightMode: boolean) {
  return {
    // Table outer wrapper
    tableWrap: isNightMode
      ? 'rounded-2xl border border-white/10 bg-slate-800/70 shadow-sm'
      : 'rounded-2xl border border-gray-200 bg-white shadow-sm',

    // <thead><tr>
    theadRow: isNightMode
      ? 'border-b border-white/10 bg-slate-700/60 text-left text-xs font-bold uppercase tracking-wide text-slate-400'
      : 'border-b border-gray-100 bg-gray-50 text-left text-xs font-bold uppercase tracking-wide text-gray-500',

    // <tbody>
    tbody: isNightMode ? 'divide-y divide-white/5' : 'divide-y divide-gray-100',

    // <tr>
    row: isNightMode ? 'hover:bg-white/5 transition-colors' : 'hover:bg-gray-50 transition-colors',

    // Cell text variants
    cellPrimary: isNightMode ? 'font-semibold text-slate-100' : 'font-semibold text-gray-800',
    cellSecondary: isNightMode ? 'text-slate-400' : 'text-gray-600',
    cellMuted: isNightMode ? 'text-xs font-normal text-slate-500 mt-0.5 line-clamp-1 truncate max-w-sm overflow-hidden text-ellipsis' : 'text-xs font-normal text-gray-400 mt-0.5 line-clamp-1 truncate max-w-sm overflow-hidden text-ellipsis',
    emptyState: isNightMode ? 'text-slate-500 font-semibold' : 'text-gray-400 font-semibold',

    // Status badges
    badgePublished: isNightMode ? 'inline-block rounded-full px-2.5 py-0.5 text-xs font-bold bg-green-900/40 text-green-400' : 'inline-block rounded-full px-2.5 py-0.5 text-xs font-bold bg-green-100 text-green-700',
    badgeDraft: isNightMode ? 'inline-block rounded-full px-2.5 py-0.5 text-xs font-bold bg-white/10 text-slate-400' : 'inline-block rounded-full px-2.5 py-0.5 text-xs font-bold bg-gray-100 text-gray-400',

    // Level badge colors (keep existing, just adjust for dark)
    levelBadge: (level: number): string => {
      if (isNightMode) {
        const dark: Record<number, string> = {
          1: 'bg-emerald-900/40 text-emerald-400',
          2: 'bg-orange-900/40 text-orange-400',
          3: 'bg-purple-900/40 text-purple-400',
        }
        return `inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${dark[level] ?? 'bg-white/10 text-slate-400'}`
      }
      const light: Record<number, string> = {
        1: 'bg-emerald-100 text-emerald-700',
        2: 'bg-orange-100 text-orange-700',
        3: 'bg-purple-100 text-purple-700',
      }
      return `inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${light[level] ?? 'bg-gray-100 text-gray-600'}`
    },

    // Row action buttons
    actionBase: 'rounded p-1.5 transition-colors cursor-pointer',
    actionEdit: isNightMode ? 'text-slate-400 hover:bg-blue-900/40 hover:text-blue-400' : 'text-gray-400 hover:bg-blue-50 hover:text-blue-600',
    actionDelete: isNightMode ? 'text-slate-400 hover:bg-red-900/40 hover:text-red-400' : 'text-gray-400 hover:bg-red-50 hover:text-red-500',
    actionPreview: isNightMode ? 'text-slate-400 hover:bg-purple-900/40 hover:text-purple-400' : 'text-gray-400 hover:bg-purple-50 hover:text-purple-600',

    // Modal
    modalCard: isNightMode
      ? 'w-full max-w-lg rounded-2xl bg-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto border border-white/10'
      : 'w-full max-w-lg rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto',
    modalHeader: isNightMode
      ? 'flex items-center justify-between border-b border-white/10 px-6 py-4 sticky top-0 bg-slate-800 z-10'
      : 'flex items-center justify-between border-b border-gray-100 px-6 py-4 sticky top-0 bg-white z-10',
    modalTitle: isNightMode ? 'text-lg font-bold text-slate-100' : 'text-lg font-bold text-gray-800',
    modalCloseBtn: isNightMode ? 'rounded-full p-1 hover:bg-white/10 cursor-pointer text-slate-400' : 'rounded-full p-1 hover:bg-gray-100 cursor-pointer',

    // Form fields inside modal
    label: isNightMode
      ? 'mb-1 block text-xs font-semibold text-slate-400 uppercase tracking-wide'
      : 'mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wide',
    input: isNightMode
      ? 'w-full rounded-lg border border-white/10 bg-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400'
      : 'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400',
    select: isNightMode
      ? 'w-full rounded-lg border border-white/10 bg-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400'
      : 'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400',
    textarea: isNightMode
      ? 'w-full rounded-lg border border-white/10 bg-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none'
      : 'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none',
    fileInput: isNightMode
      ? 'w-full text-sm text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-900/40 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-blue-400 hover:file:bg-blue-900/60 cursor-pointer'
      : 'w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100 cursor-pointer',
    thumbBox: isNightMode
      ? 'w-14 h-14 rounded-xl overflow-hidden border border-white/10 bg-slate-700 shrink-0'
      : 'w-14 h-14 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shrink-0',
    inputHint: isNightMode ? 'text-xs text-slate-500' : 'text-xs text-gray-400',
    checkboxLabel: isNightMode ? 'text-sm font-semibold text-slate-300' : 'text-sm font-semibold text-gray-700',
    cancelBtn: isNightMode
      ? 'rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-white/10 cursor-pointer'
      : 'rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-50 cursor-pointer',
  }
}
