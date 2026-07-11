export default function AuthCard({
  authMode,
  setAuthMode,
  authForm,
  handleAuthChange,
  handleAuthSubmit,
  loading,
}) {
  return (
    <section className="auth-center">
      <div className="auth-card">
        <div className="auth-intro">
          <p className="eyebrow">Welcome</p>
          <h2>{authMode === 'register' ? 'Create your account' : 'Sign in to continue'}</h2>
          <p>Teachers can manage students and mark attendance, while students can view their personal attendance history.</p>
        </div>

        <div className="mode-switch">
          <button type="button" className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>
            Login
          </button>
          <button type="button" className={authMode === 'register' ? 'active' : ''} onClick={() => setAuthMode('register')}>
            Register
          </button>
        </div>

        <form onSubmit={handleAuthSubmit} className="auth-form">
          {authMode === 'register' ? (
            <input name="name" value={authForm.name} onChange={handleAuthChange} placeholder="Full name" required />
          ) : null}

          <input name="email" type="email" value={authForm.email} onChange={handleAuthChange} placeholder="Email address" required />

          <input name="password" type="password" value={authForm.password} onChange={handleAuthChange} placeholder="Password" required />

          {authMode === 'register' && authForm.role === 'student' ? (
            <>
              <input name="rollNo" value={authForm.rollNo} onChange={handleAuthChange} placeholder="Roll number" required />
              <input name="branch" value={authForm.branch} onChange={handleAuthChange} placeholder="Branch" required />
              <input name="semester" type="number" value={authForm.semester} onChange={handleAuthChange} placeholder="Semester" required />
            </>
          ) : null}

          {authMode === 'register' ? (
            <select name="role" value={authForm.role} onChange={handleAuthChange} required>
              <option value="student">Student</option>
              <option value="faculty">Teacher</option>
            </select>
          ) : null}

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>
      </div>
    </section>
  )
}
