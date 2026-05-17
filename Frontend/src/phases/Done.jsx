import './Done.css'

export default function Done({ onReset }) {
  return (
    <div className="phase-container">
      <div className="done-wrapper content-layer">
        <div className="done-card card">
          {/* Animated checkmark */}
          <div className="done-check">
            <svg className="done-svg" viewBox="0 0 80 80" fill="none">
              <circle className="done-circle" cx="40" cy="40" r="36" stroke="var(--cyan)" strokeWidth="2" fill="none" />
              <path className="done-tick" d="M24 40l12 12 20-22" stroke="var(--cyan)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="done-glow" />
          </div>

          <h2 className="done-title">Download started!</h2>
          <p className="done-sub text-muted">
            Your modernized repository and report are being downloaded.<br />
            Check your browser's downloads folder.
          </p>

          <div className="done-pills">
            <span className="done-pill">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="var(--cyan)"><circle cx="6" cy="6" r="6"/></svg>
              Repo modernized
            </span>
            <span className="done-pill">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="var(--cyan)"><circle cx="6" cy="6" r="6"/></svg>
              Report generated
            </span>
            <span className="done-pill">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="var(--cyan)"><circle cx="6" cy="6" r="6"/></svg>
              Powered by watsonx
            </span>
          </div>

          <button className="btn btn-primary" onClick={onReset}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
            </svg>
            Analyze another repo
          </button>
        </div>
      </div>
    </div>
  )
}
