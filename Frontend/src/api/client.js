const API_BASE = "https://backend-production-0d82c.up.railway.app"

const TIMEOUT_MS = 30_000

function withTimeout(promise) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out after 30s')), TIMEOUT_MS)
  )
  return Promise.race([promise, timeout])
}

async function handleResponse(res) {
  if (!res.ok) {
    let msg = `HTTP ${res.status}`
    try {
      const body = await res.json()
      msg = body.detail || body.message || msg
    } catch {}
    throw new Error(msg)
  }
  return res.json()
}

// Step 1a — ingest from GitHub URL
// Backend expects { github_url }, not { repo_url }
export async function ingestGithub(repoUrl) {
  const res = await withTimeout(
    fetch(`${API_BASE}/ingest/github`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ github_url: repoUrl }),
    })
  )
  return handleResponse(res)
}

// Step 1b — ingest ZIP archive
// Backend endpoint is POST /ingest (not /ingest/zip)
export async function ingestZip(file) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await withTimeout(
    fetch(`${API_BASE}/ingest`, {
      method: 'POST',
      body: formData,
    })
  )
  return handleResponse(res)
}

// Step 1c — ingest from a local filesystem path (backend must run on same machine)
export async function ingestLocal(localPath) {
  const res = await withTimeout(
    fetch(`${API_BASE}/ingest/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ local_path: localPath }),
    })
  )
  return handleResponse(res)
}

// Step 2 — trigger the modernization pipeline; returns a NEW job_id to poll
export async function startModernize(ingestJobId) {
  const res = await withTimeout(
    fetch(`${API_BASE}/modernize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_id: ingestJobId }),
    })
  )
  return handleResponse(res)
}

// Step 3 — poll this with the modernize job_id
export async function getStatus(jobId) {
  const res = await withTimeout(
    fetch(`${API_BASE}/status/${jobId}`)
  )
  return handleResponse(res)
}

// Backend URL format is /download/{type}/{job_id}
export function getDownloadUrl(jobId, type) {
  return `${API_BASE}/download/${type}/${jobId}`
}
