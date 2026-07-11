export default function FacultyContent({
  facultyView,
  students,
  attendanceList,
  attendanceForm,
  setAttendanceForm,
  handleAttendanceSubmit,
  loading,
}) {
  return (
    <div className="faculty-content">
      {facultyView === 'overview' ? (
        <section className="stats-grid">
          <article className="stat-card">
            <h3>{students.length}</h3>
            <p>Students registered</p>
          </article>
          <article className="stat-card">
            <h3>{attendanceList.length}</h3>
            <p>Attendance records</p>
          </article>
        </section>
      ) : null}

      {facultyView === 'attendance' ? (
        <section className="panel">
          <h3>Mark attendance</h3>
          <form onSubmit={handleAttendanceSubmit} className="stacked-form">
            <select value={attendanceForm.student} onChange={(e) => setAttendanceForm((prev) => ({ ...prev, student: e.target.value }))} required>
              <option value="">Select a student</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.user?.name} · {student.rollNo}
                </option>
              ))}
            </select>
            <input type="date" value={attendanceForm.date} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setAttendanceForm((prev) => ({ ...prev, date: e.target.value }))} required />
            <select value={attendanceForm.status} onChange={(e) => setAttendanceForm((prev) => ({ ...prev, status: e.target.value }))}>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
            <button className="primary-btn" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save attendance'}</button>
          </form>
        </section>
      ) : null}

      {facultyView === 'students' ? (
        <section className="panel">
          <h3>Student directory</h3>
          <div className="list-stack">
            {students.length ? students.map((student) => (
              <div key={student._id} className="list-item">
                <div>
                  <strong>{student.user?.name}</strong>
                  <p>{student.rollNo} · {student.branch} · Sem {student.semester}</p>
                </div>
              </div>
            )) : <p>No students registered yet.</p>}
          </div>
        </section>
      ) : null}

      {facultyView === 'log' ? (
        <section className="panel">
          <h3>Attendance log</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceList.map((record) => (
                  <tr key={record._id}>
                    <td>{record.student?.user?.name}</td>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  )
}
