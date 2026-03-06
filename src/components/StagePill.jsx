import { STAGES } from '../lib/demo-data'

export function StagePill({ stage, onChange }) {
  const stageData = STAGES.find((s) => s.id === stage) || STAGES[0]

  return (
    <select
      value={stage}
      onChange={(e) => onChange(e.target.value)}
      className={`px-3 py-1 rounded-full text-xs font-medium bg-surface-card text-text-primary
        border border-border cursor-pointer hover:border-accent focus:outline-none focus:border-accent`}
    >
      {STAGES.map((s) => (
        <option key={s.id} value={s.id}>
          {s.label}
        </option>
      ))}
    </select>
  )
}
