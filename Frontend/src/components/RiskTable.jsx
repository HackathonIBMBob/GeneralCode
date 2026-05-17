import './RiskTable.css'

const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 }

export default function RiskTable({ risks = [] }) {
  const sorted = [...risks].sort(
    (a, b) => (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9)
  )

  if (!sorted.length) {
    return <p className="table-empty text-muted mono">No risk areas identified.</p>
  }

  return (
    <div className="risk-table-wrapper">
      <table className="risk-table">
        <thead>
          <tr>
            <th>Severity</th>
            <th>File</th>
            <th>Issue</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={i}>
              <td>
                <span className={`severity-badge severity-${row.severity}`}>
                  {row.severity}
                </span>
              </td>
              <td className="mono file-cell">{row.file}</td>
              <td className="issue-cell">{row.issue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
