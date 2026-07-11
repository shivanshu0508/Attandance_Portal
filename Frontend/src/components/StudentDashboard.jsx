export default function StudentDashboard({ summary, studentAttendance }) {
  return (
    <>
      <section className="stats-grid">
        <article className="stat-card">
          <h3>{summary.present}</h3>
          <p>Present days</p>
        </article>
        <article className="stat-card">
          <h3>{summary.absent}</h3>
          <p>Absent days</p>
        </article>
        <article className="stat-card">
          <h3>{summary.percent}%</h3>
          <p>Attendance rate</p>
        </article>
      </section>

      <section className="panel">
        <h3>Your attendance history</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {studentAttendance.length ? studentAttendance.map((record) => (
                <tr key={record._id}>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{record.status}</td>
                </tr>
              )) : <tr><td colSpan="2">No attendance records yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
