import { useState } from 'react'
import './DownloadButton.css'

export default function DownloadButton({ href, label, icon, onDownload }) {
  const [downloading, setDownloading] = useState(false)

  const handleClick = () => {
    setDownloading(true)
    window.open(href, '_blank')
    setTimeout(() => {
      setDownloading(false)
      onDownload?.()
    }, 1200)
  }

  return (
    <button
      className={`download-btn ${downloading ? 'downloading' : ''}`}
      onClick={handleClick}
      disabled={downloading}
    >
      <span className="download-btn-icon">{icon}</span>
      <span className="download-btn-text">
        {downloading ? 'Opening...' : label}
      </span>
      {downloading && <span className="download-spinner" />}
    </button>
  )
}
