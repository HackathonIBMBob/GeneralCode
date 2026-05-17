import './PlanTable.css'

export default function PlanTable({ plan = [] }) {
  if (!plan.length) {
    return <p className="table-empty text-muted mono">No refactor plan items.</p>
  }

  return (
    <div className="plan-table-wrapper">
      <table className="plan-table">
        <thead>
          <tr>
            <th>#</th>
            <th>File</th>
            <th>Change</th>
            <th>Effort</th>
          </tr>
        </thead>
        <tbody>
          {plan.map((row, i) => (
            <tr key={i}>
              <td className="mono row-num">{String(i + 1).padStart(2, '0')}</td>
              <td className="mono file-cell">{row.file}</td>
              <td className="change-cell">{row.change}</td>
              <td>
                <span className={`effort-badge effort-${(row.effort || '').toLowerCase()}`}>
                  {row.effort}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
