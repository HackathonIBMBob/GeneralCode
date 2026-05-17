import { useState, useCallback, useRef } from 'react'
import Upload from './phases/Upload'
import Analyzing from './phases/Analyzing'
import Results from './phases/Results'
import Done from './phases/Done'
import './App.css'

// ── Toast system ─────────────────────────────────────────────────────────────
function useToasts() {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const addToast = useCallback((message, type = 'error') => {
    const id = ++idRef.current
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return { toasts, addToast, removeToast }
}

// ── Phase stepper (header breadcrumb) ────────────────────────────────────────
const PHASES = ['Upload', 'Analyzing', 'Results', 'Done']
const PHASE_INDEX = { upload: 0, analyzing: 1, results: 2, done: 3 }

function PhaseStepper({ currentPhase }) {
  const idx = PHASE_INDEX[currentPhase] ?? 0
  return (
    <div className="phase-stepper">
      {PHASES.map((label, i) => (
        <div key={label} className={`stepper-step ${i === idx ? 'active' : ''} ${i < idx ? 'completed' : ''}`}>
          <span className="stepper-dot">
            {i < idx ? (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              String(i + 1)
            )}
          </span>
          <span className="stepper-label">{label}</span>
          {i < PHASES.length - 1 && <span className="stepper-line" />}
        </div>
      ))}
    </div>
  )
}

// ── App root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState('upload')   // upload | analyzing | results | done
  const [jobId, setJobId] = useState(null)
  const [analysisData, setAnalysisData] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  const { toasts, addToast, removeToast } = useToasts()

  // After ingest we get an ingest job_id; we must then call POST /modernize
  // which starts the AI pipeline and returns a NEW job_id to poll.
  const handleJobStart = useCallback((modernizeJobId) => {
    setJobId(modernizeJobId)
    setPhase('analyzing')
    setErrorMsg(null)
  }, [])

  // Backend returns status "completed" (not "done").
  // result shape: { analysis, refactor_plan, files_processed, zip_url, docx_url }
  // Normalize into the flat shape Results.jsx expects.
  const handleAnalysisDone = useCallback((statusData) => {
    const raw = statusData.result ?? {}
    const analysis = raw.analysis ?? {}
    const refactorRaw = raw.refactor_plan ?? {}

    // Merge architecture_issues + potential_bugs + security_risks into a unified risk list
    const riskAreas = [
      ...(analysis.architecture_issues ?? []).map(r => ({
        file: r.file ?? '—',
        issue: r.issue ?? '',
        severity: r.severity ?? 'medium',
      })),
      ...(analysis.potential_bugs ?? []).map(r => ({
        file: r.file ?? '—',
        issue: r.bug ?? '',
        severity: r.severity ?? 'medium',
      })),
      ...(analysis.security_risks ?? []).map(r => ({
        file: r.file ?? '—',
        issue: `${r.risk ?? ''}${r.recommendation ? ` — ${r.recommendation}` : ''}`,
        severity: r.severity ?? 'high',
      })),
    ]

    // suggested_improvements → table rows; fallback to refactor_plan string array
    let planRows = []
    if (Array.isArray(refactorRaw.suggested_improvements) && refactorRaw.suggested_improvements.length) {
      planRows = refactorRaw.suggested_improvements.map(i => ({
        file: i.area ?? '—',
        change: i.improvement ?? '',
        effort: i.priority ?? 'medium',
      }))
    } else if (Array.isArray(refactorRaw.refactor_plan)) {
      planRows = refactorRaw.refactor_plan.map((step, idx) => ({
        file: `Step ${idx + 1}`,
        change: step,
        effort: 'medium',
      }))
    }

    setAnalysisData({
      architecture_summary: analysis.summary ?? '',
      quality_score: analysis.quality_score ?? null,
      risk_areas: riskAreas,
      refactor_plan: planRows,
      files_scanned: raw.files_processed ?? 0,
      files_modernized: raw.files_processed ?? 0,
    })
    setPhase('results')
  }, [])

  const handleAnalysisError = useCallback((msg) => {
    setErrorMsg(msg)
  }, [])

  const handleDownloaded = useCallback(() => {
    setPhase('done')
  }, [])

  const handleReset = useCallback(() => {
    setPhase('upload')
    setJobId(null)
    setAnalysisData(null)
    setErrorMsg(null)
  }, [])

  // Key phases out so animation triggers on change
  const phaseKey = phase + (jobId || '')

  return (
    <div className="app-shell">
      {/* Decorative grid */}
      <div className="grid-overlay" />

      {/* Header */}
      <header className="app-header">
        <div className="app-header-logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="2" y="2" width="24" height="24" rx="6" stroke="#0f62fe" strokeWidth="1.5" fill="rgba(15,98,254,0.08)"/>
            <path d="M8 14h12M14 8l6 6-6 6" stroke="#00e5a0" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="app-header-title">legacy-whisperer</span>
        </div>

        <PhaseStepper currentPhase={phase} />

        <span className="app-header-badge">IBM watsonx</span>
      </header>

      {/* Error banner (analysis-level errors) */}
      {errorMsg && (
        <div className="error-banner content-layer">
          <div className="error-banner-inner">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{errorMsg}</span>
            <button className="btn btn-ghost" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }} onClick={handleReset}>
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Phase content */}
      <main key={phaseKey} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {phase === 'upload' && (
          <Upload onJobStart={handleJobStart} onToastError={addToast} />
        )}
        {phase === 'analyzing' && !errorMsg && (
          <Analyzing
            jobId={jobId}
            onDone={handleAnalysisDone}
            onError={handleAnalysisError}
            onToastError={addToast}
          />
        )}
        {phase === 'results' && (
          <Results
            jobId={jobId}
            analysis={analysisData}
            onDownloaded={handleDownloaded}
          />
        )}
        {phase === 'done' && (
          <Done onReset={handleReset} />
        )}
      </main>

      {/* Toast container */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`} onClick={() => removeToast(t.id)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {t.type === 'error'
                ? <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>
                : <><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>
              }
            </svg>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  )
}
