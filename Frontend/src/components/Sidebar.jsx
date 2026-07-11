export default function Sidebar({ facultyView, setFacultyView }) {
  return (
    <aside className="faculty-sidebar">
      <div className="faculty-sidebar-header">
        <p className="eyebrow">Faculty</p>
        <h3>Operations</h3>
      </div>
      <button type="button" className={facultyView === 'overview' ? 'active' : ''} onClick={() => setFacultyView('overview')}>
        Overview
      </button>
      <button type="button" className={facultyView === 'attendance' ? 'active' : ''} onClick={() => setFacultyView('attendance')}>
        Mark Attendance
      </button>
      <button type="button" className={facultyView === 'students' ? 'active' : ''} onClick={() => setFacultyView('students')}>
        Student Directory
      </button>
      <button type="button" className={facultyView === 'log' ? 'active' : ''} onClick={() => setFacultyView('log')}>
        Attendance Log
      </button>
    </aside>
  )
}
