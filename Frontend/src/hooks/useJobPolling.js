import { useState, useEffect, useRef, useCallback } from 'react'
import { getStatus } from '../api/client'

const POLL_INTERVAL_MS = 2000
// Backend uses "completed" and "failed", not "done"/"error"
const TERMINAL_STATUSES = ['completed', 'failed']

export function useJobPolling(jobId, onToastError) {
  const [statusData, setStatusData] = useState(null)
  const [isPolling, setIsPolling] = useState(false)
  const intervalRef = useRef(null)

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsPolling(false)
  }, [])

  const poll = useCallback(async () => {
    if (!jobId) return
    try {
      const data = await getStatus(jobId)
      setStatusData(data)
      if (TERMINAL_STATUSES.includes(data.status)) {
        stop()
      }
    } catch (err) {
      onToastError?.(err.message)
    }
  }, [jobId, stop, onToastError])

  useEffect(() => {
    if (!jobId) return
    setIsPolling(true)
    poll()
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS)
    return stop
  }, [jobId])

  return { statusData, isPolling, stop }
}
