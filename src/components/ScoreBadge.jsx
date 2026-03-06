export function ScoreBadge({ score }) {
  const color =
    score >= 80
      ? 'text-success'
      : score >= 60
        ? 'text-warning'
        : 'text-danger'

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-10 h-10">
        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-border"
          />
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeDasharray={`${(score / 100) * 94.2} 94.2`}
            strokeLinecap="round"
            className={color}
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-xs font-semibold ${color}`}>
          {score}
        </span>
      </div>
    </div>
  )
}
