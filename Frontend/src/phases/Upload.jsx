import { useState, useRef } from 'react'
import { ingestGithub, ingestLocal, ingestZip, startModernize } from '../api/client'
import './Upload.css'

const GITHUB_RE = /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+(\/.*)?$/

export default function Upload({ onJobStart, onToastError }) {
  const [mode, setMode] = useState('github') // 'github' | 'zip' | 'local'
  const [repoUrl, setRepoUrl] = useState('')
  const [zipFile, setZipFile] = useState(null)
  const [localPath, setLocalPath] = useState('')
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  const urlValid = mode === 'github' ? GITHUB_RE.test(repoUrl.trim()) : true

  const canSubmit =
    (mode === 'github' && GITHUB_RE.test(repoUrl.trim())) ||
    (mode === 'zip' && !!zipFile) ||
    (mode === 'local' && localPath.trim().length > 0)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.name.endsWith('.zip')) {
      setZipFile(file)
    } else {
      onToastError?.('Only .zip files are supported')
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) setZipFile(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit || loading) return
    setLoading(true)
    try {
      // Step 1: ingest — upload/copy repo, get ingest job_id
      let ingestResult
      if (mode === 'github') {
        ingestResult = await ingestGithub(repoUrl.trim())
      } else if (mode === 'zip') {
        ingestResult = await ingestZip(zipFile)
      } else {
        ingestResult = await ingestLocal(localPath.trim())
      }

      // Step 2: trigger AI pipeline — get the modernize job_id to poll
      const modernizeResult = await startModernize(ingestResult.job_id)
      onJobStart(modernizeResult.job_id)
    } catch (err) {
      onToastError?.(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="phase-container">
      <div className="upload-wrapper content-layer">
        {/* Hero */}
        <div className="upload-hero">
          <div className="hero-glyph">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="4" y="4" width="40" height="40" rx="8" stroke="#0f62fe" strokeWidth="1.5" fill="none" />
              <path d="M16 24h16M24 16l8 8-8 8" stroke="#00e5a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="24" cy="24" r="10" stroke="#0f62fe" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.4"/>
            </svg>
          </div>
          <h1 className="hero-title">Legacy <span className="text-cyan">Whisperer</span></h1>
          <p className="hero-sub text-muted">
            Analyze &amp; modernize legacy repositories with IBM Bob / watsonx
          </p>
        </div>

        {/* Card */}
        <form className="upload-card card card-glow" onSubmit={handleSubmit}>
          {/* Mode toggle */}
          <div className="mode-toggle">
            <button
              type="button"
              className={`mode-btn ${mode === 'github' ? 'active' : ''}`}
              onClick={() => setMode('github')}
            >
              <GithubIcon /> GitHub URL
            </button>
            <button
              type="button"
              className={`mode-btn ${mode === 'zip' ? 'active' : ''}`}
              onClick={() => setMode('zip')}
            >
              <ZipIcon /> Upload .zip
            </button>
            <button
              type="button"
              className={`mode-btn ${mode === 'local' ? 'active' : ''}`}
              onClick={() => setMode('local')}
            >
              <FolderIcon /> Local Path
            </button>
          </div>

          <div className="divider" />

          {mode === 'github' && (
            <div className="input-group">
              <label className="input-label mono">Repository URL</label>
              <div className="input-row">
                <input
                  className={`url-input ${repoUrl && !urlValid ? 'invalid' : ''}`}
                  type="url"
                  placeholder="https://github.com/user/repo"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  autoFocus
                />
              </div>
              {repoUrl && !urlValid && (
                <p className="input-hint error">Enter a valid public GitHub URL</p>
              )}
            </div>
          )}

          {mode === 'zip' && (
            <div className="input-group">
              <label className="input-label mono">Repository Archive</label>
              <div
                className={`dropzone ${dragging ? 'dragging' : ''} ${zipFile ? 'has-file' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {zipFile ? (
                  <>
                    <ZipIcon size={24} />
                    <span className="dropzone-filename mono">{zipFile.name}</span>
                    <span className="dropzone-size text-muted">
                      {(zipFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </>
                ) : (
                  <>
                    <UploadIcon />
                    <span>Drop your .zip here or <span className="text-blue">click to browse</span></span>
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>Supports .zip archives</span>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          )}

          {mode === 'local' && (
            <div className="input-group">
              <label className="input-label mono">Absolute Path</label>
              <input
                className="url-input"
                type="text"
                placeholder="/Users/tu-usuario/proyectos/mi-repo"
                value={localPath}
                onChange={(e) => setLocalPath(e.target.value)}
                autoFocus
              />
              <p className="local-path-tip">
                <span className="tip-icon">💡</span>
                El backend debe estar corriendo en la misma máquina
              </p>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-large submit-btn"
            disabled={!canSubmit || loading}
          >
            {loading ? (
              <>
                <Spinner /> Submitting...
              </>
            ) : (
              <>
                <BobIcon /> Analyze with Bob
              </>
            )}
          </button>
        </form>

        {/* Footer note */}
        <p className="upload-footer text-muted mono">
          Powered by IBM watsonx · Results available in ~2 min
        </p>
      </div>
    </div>
  )
}

function FolderIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  )
}

function ZipIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  )
}

function BobIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M9 9h.01M15 9h.01"/>
      <path d="M9 15s1 1.5 3 1.5 3-1.5 3-1.5"/>
    </svg>
  )
}

function Spinner() {
  return (
    <span style={{
      display: 'inline-block',
      width: 16,
      height: 16,
      border: '2px solid rgba(255,255,255,0.3)',
      borderTopColor: '#fff',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
  )
}
