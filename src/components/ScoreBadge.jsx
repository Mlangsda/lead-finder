export function ScoreBadge({ score }) {
  const color =
    score >= 80
      ? 'text-success'
      : score >= 60
        ? 'text-warning'
        : score >= 30
          ? 'text-accent'
          : 'text-text-tertiary'

  const circumference = 94.2
  const filled = (score / 100) * circumference

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-11 h-11">
        <svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36">
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
            strokeWidth="3"
            strokeDasharray={`${filled} ${circumference}`}
            strokeLinecap="round"
            className={`${color} transition-all duration-500 ease-out`}
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${color} transition-colors duration-300`}>
          {score}
        </span>
      </div>
    </div>
  )
}
