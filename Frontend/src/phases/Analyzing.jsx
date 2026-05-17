import { useEffect, useState } from 'react'
import { useJobPolling } from '../hooks/useJobPolling'
import ProgressBar from '../components/ProgressBar'
import './Analyzing.css'

const ALL_STEPS = [
  'Scanning files',
  'Analyzing architecture',
  'Identifying risks',
  'Generating refactor plan',
  'Modernizing code',
  'Generating documentation',
  'Packaging results',
]

export default function Analyzing({ jobId, onDone, onError, onToastError }) {
  const { statusData } = useJobPolling(jobId, onToastError)
  const [dots, setDots] = useState('')

  useEffect(() => {
    const id = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!statusData) return
    // Backend uses "completed" and "failed"
    if (statusData.status === 'completed') onDone(statusData)
    if (statusData.status === 'failed') onError(statusData.result?.error || 'Analysis failed')
  }, [statusData])

  const progress = statusData?.progress ?? 0
  // Backend returns "stage" (not "current_step")
  const currentStage = statusData?.stage ?? 'Initializing'

  // Simulate completed steps from progress thresholds (backend has no steps_completed field)
  const STEP_THRESHOLDS = {
    'Scanning files': 10,
    'Analyzing architecture': 30,
    'Identifying risks': 30,
    'Generating refactor plan': 60,
    'Modernizing code': 85,
    'Generating documentation': 80,
    'Packaging results': 95,
  }

  const getStepState = (step) => {
    const threshold = STEP_THRESHOLDS[step] ?? 100
    if (progress > threshold) return 'done'
    if (progress === threshold || (progress > 0 && Math.abs(progress - threshold) < 15)) return 'active'
    return 'pending'
  }

  return (
    <div className="phase-container">
      <div className="analyzing-wrapper content-layer">
        {/* Header */}
        <div className="analyzing-header">
          <div className="analyzing-orb">
            <div className="orb-ring" />
            <div className="orb-core">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0f62fe" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4l3 3" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div>
            <h2 className="analyzing-title">
              Analyzing repository<span className="dots">{dots}</span>
            </h2>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>
              IBM Bob is processing your codebase via watsonx
            </p>
          </div>
        </div>

        {/* Progress section */}
        <div className="card analyzing-card">
          <div className="progress-section">
            <div className="progress-meta">
              <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {currentStage}
              </span>
              <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--cyan)' }}>
                {progress}%
              </span>
            </div>
            <ProgressBar value={progress} />
          </div>

          <div className="divider" />

          {/* Steps list */}
          <div className="steps-list">
            {ALL_STEPS.map((step) => {
              const state = getStepState(step)
              return (
                <div key={step} className={`step-item step-${state}`}>
                  <span className="step-icon">
                    {state === 'done' && <CheckIcon />}
                    {state === 'active' && <PulseIcon />}
                    {state === 'pending' && <DotIcon />}
                  </span>
                  <span className="step-label">{step}</span>
                  {state === 'active' && (
                    <span className="step-active-badge mono">running</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <p className="analyzing-footer text-muted mono">
          job_id: {jobId}
        </p>
      </div>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="8" fill="rgba(0, 229, 160, 0.15)" />
      <path d="M5 8l2 2 4-4" stroke="var(--cyan)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PulseIcon() {
  return (
    <span className="pulse-icon">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="4" fill="var(--ibm-blue)" />
      </svg>
    </span>
  )
}

function DotIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="3" stroke="var(--text-muted)" strokeWidth="1.5" />
    </svg>
  )
}
