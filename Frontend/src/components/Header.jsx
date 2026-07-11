export default function Header({ currentUser, isFaculty, logout }) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">Attendance Portal</p>
        <h1>Manage attendance across student and teacher roles</h1>
      </div>
      {currentUser ? (
        <div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
          <div className="role-badge">{isFaculty ? 'Teacher' : 'Student'}</div>
          <button className="secondary-btn" onClick={logout}>
            Logout
          </button>
        </div>
      ) : null}
    </header>
  )
}
