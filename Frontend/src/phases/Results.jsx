import RiskTable from '../components/RiskTable'
import PlanTable from '../components/PlanTable'
import DownloadButton from '../components/DownloadButton'
import { getDownloadUrl } from '../api/client'
import './Results.css'

export default function Results({ jobId, analysis, onDownloaded }) {
  const {
    architecture_summary = '',
    risk_areas = [],
    refactor_plan = [],
    files_scanned = 0,
    files_modernized = 0,
  } = analysis || {}

  const criticalCount = risk_areas.filter(r => r.severity === 'critical').length
  const highCount = risk_areas.filter(r => r.severity === 'high').length

  return (
    <div className="phase-container results-phase">
      <div className="results-wrapper content-layer">
        {/* Title */}
        <div className="results-header">
          <div className="results-title-row">
            <div className="results-icon">
              <CheckShieldIcon />
            </div>
            <div>
              <h2 className="results-title">Analysis Complete</h2>
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                Review the findings and download your modernized repository
              </p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="stats-row">
          <StatCard
            label="Files Scanned"
            value={files_scanned}
            icon={<FileIcon />}
            accent="blue"
          />
          <StatCard
            label="Modernized"
            value={files_modernized}
            icon={<SparkleIcon />}
            accent="cyan"
          />
          <StatCard
            label="Critical Risks"
            value={criticalCount}
            icon={<WarnIcon />}
            accent={criticalCount > 0 ? 'red' : 'green'}
          />
          <StatCard
            label="High Risks"
            value={highCount}
            icon={<AlertIcon />}
            accent={highCount > 0 ? 'orange' : 'green'}
          />
        </div>

        {/* Architecture summary */}
        <section className="result-section card">
          <p className="section-label">Architecture Summary</p>
          <p className="arch-summary">{architecture_summary || 'No summary available.'}</p>
        </section>

        {/* Risk areas */}
        <section className="result-section">
          <p className="section-label">Risk Areas ({risk_areas.length})</p>
          <RiskTable risks={risk_areas} />
        </section>

        {/* Refactor plan */}
        <section className="result-section">
          <p className="section-label">Refactor Plan ({refactor_plan.length} items)</p>
          <PlanTable plan={refactor_plan} />
        </section>

        {/* Downloads */}
        <section className="result-section card downloads-card">
          <p className="section-label">Download Artifacts</p>
          <div className="download-row">
            <DownloadButton
              href={getDownloadUrl(jobId, 'zip')}
              label="Download Modernized Repo (.zip)"
              icon="📦"
              onDownload={onDownloaded}
            />
            <DownloadButton
              href={getDownloadUrl(jobId, 'docx')}
              label="Download Report (.docx)"
              icon="📄"
              onDownload={onDownloaded}
            />
          </div>
        </section>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, accent }) {
  return (
    <div className={`stat-card card stat-accent-${accent}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-value mono">{value}</div>
      <div className="stat-label text-muted">{label}</div>
    </div>
  )
}

function CheckShieldIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}

function FileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  )
}

function WarnIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}
