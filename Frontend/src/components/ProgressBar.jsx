import './ProgressBar.css'

export default function ProgressBar({ value = 0 }) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div className="progress-track" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
      <div
        className="progress-fill"
        style={{ width: `${clamped}%` }}
      />
      <span className="progress-label mono">{clamped}%</span>
    </div>
  )
}
