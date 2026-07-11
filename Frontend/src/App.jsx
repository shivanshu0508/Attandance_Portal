import { useEffect, useMemo, useState } from 'react'
import './App.css'
import Header from './components/Header'
import AuthCard from './components/AuthCard'
import Sidebar from './components/Sidebar'
import FacultyContent from './components/FacultyContent'
import StudentDashboard from './components/StudentDashboard'

const initialForm = {
  name: '',
  email: '',
  password: '',
  role: 'student',
  rollNo: '',
  branch: '',
  semester: '',
}

function App() {
  const [authMode, setAuthMode] = useState('login')
  const [authForm, setAuthForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('attendance-user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('attendance-token') || '')
  const [students, setStudents] = useState([])
  const [attendanceList, setAttendanceList] = useState([])
  const [studentAttendance, setStudentAttendance] = useState([])
  const [facultyView, setFacultyView] = useState('overview')
  const [attendanceForm, setAttendanceForm] = useState({
    student: '',
    date: new Date().toISOString().slice(0, 10),
    status: 'Present',
  })

  const isFaculty = currentUser?.role === 'faculty'

  useEffect(() => {
    if (!token || !currentUser) return

    let ignore = false

    const loadFacultyData = async () => {
      try {
        const [studentsRes, attendanceRes] = await Promise.all([
          fetch('/api/students', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('/api/attendance', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        const studentsData = await studentsRes.json()
        const attendanceData = await attendanceRes.json()

        if (!studentsRes.ok) throw new Error(studentsData.message || 'Unable to load students')
        if (!attendanceRes.ok) throw new Error(attendanceData.message || 'Unable to load attendance')

        if (!ignore) {
          setStudents(studentsData)
          setAttendanceList(attendanceData)
        }
      } catch (error) {
        if (!ignore) setMessage(error.message)
      }
    }

    const loadStudentAttendance = async (studentId) => {
      try {
        const res = await fetch(`/api/attendance/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()

        if (!res.ok) throw new Error(data.message || 'Unable to fetch your attendance')
        if (!ignore) setStudentAttendance(data)
      } catch (error) {
        if (!ignore) setMessage(error.message)
      }
    }

    if (isFaculty) {
      loadFacultyData()
    } else if (currentUser.studentId) {
      loadStudentAttendance(currentUser.studentId)
    }

    return () => {
      ignore = true
    }
  }, [currentUser, isFaculty, token])

  const summary = useMemo(() => {
    const present = studentAttendance.filter((item) => item.status === 'Present').length
    const absent = studentAttendance.filter((item) => item.status === 'Absent').length
    const total = studentAttendance.length
    const percent = total ? Math.round((present / total) * 100) : 0

    return { present, absent, total, percent }
  }, [studentAttendance])

  const handleAuthChange = (event) => {
    const { name, value } = event.target
    setAuthForm((prev) => ({ ...prev, [name]: value }))
  }
  const handleAuthSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const form = event.currentTarget
      const formData = new FormData(form)
      const email = formData.get('email')?.toString() || ''
      const password = formData.get('password')?.toString() || ''
      const role = authForm.role
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const payload = authMode === 'login'
        ? { email, password }
        : {
            name: formData.get('name')?.toString() || '',
            email,
            password,
            role,
            rollNo: formData.get('rollNo')?.toString() || '',
            branch: formData.get('branch')?.toString() || '',
            semester: formData.get('semester')?.toString() || '',
          }

      if (authMode === 'register' && role === 'faculty') {
        payload.rollNo = ''
        payload.branch = ''
        payload.semester = ''
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed')
      }

      if (authMode === 'login') {
        const userData = {
          ...data.user,
          studentId: data.studentId,
          studentProfile: data.studentProfile,
        }

        localStorage.setItem('attendance-token', data.token)
        localStorage.setItem('attendance-user', JSON.stringify(userData))
        setToken(data.token)
        setCurrentUser(userData)
        setMessage(data.message || 'Logged in successfully')
      } else {
        setMessage(data.message || 'Registered successfully')
        setAuthMode('login')
        setAuthForm(initialForm)
      }
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAttendanceSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    const selectedDate = new Date(attendanceForm.date)
    const today = new Date()
    const normalizedSelected = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    )
    const normalizedToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    )

    if (normalizedSelected > normalizedToday) {
      setMessage('Attendance cannot be marked for future dates')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...attendanceForm,
          date: new Date(attendanceForm.date).toISOString(),
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Unable to mark attendance')
      }

      setAttendanceForm({ student: '', date: new Date().toISOString().slice(0, 10), status: 'Present' })
      const loadFacultyData = async () => {
        try {
          const [studentsRes, attendanceRes] = await Promise.all([
            fetch('/api/students', {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch('/api/attendance', {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ])

          const studentsData = await studentsRes.json()
          const attendanceData = await attendanceRes.json()

          if (!studentsRes.ok) throw new Error(studentsData.message || 'Unable to load students')
          if (!attendanceRes.ok) throw new Error(attendanceData.message || 'Unable to load attendance')

          setStudents(studentsData)
          setAttendanceList(attendanceData)
        } catch (error) {
          setMessage(error.message)
        }
      }

      await loadFacultyData()
      setMessage('Attendance marked successfully')
      try {
        alert('Attendance marked successfully')
      } catch {
        // ignore if alert is not available in the environment
      }
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('attendance-token')
    localStorage.removeItem('attendance-user')
    setToken('')
    setCurrentUser(null)
    setStudents([])
    setAttendanceList([])
    setStudentAttendance([])
    setMessage('You have been logged out')
  }

  return (
    <div className="app-shell">
      <Header currentUser={currentUser} isFaculty={isFaculty} logout={logout} />

      {message ? <div className="message-banner">{message}</div> : null}

      {!currentUser ? (
        <AuthCard
          authMode={authMode}
          setAuthMode={setAuthMode}
          authForm={authForm}
          handleAuthChange={handleAuthChange}
          handleAuthSubmit={handleAuthSubmit}
          loading={loading}
        />
      ) : (
        <main className="dashboard">
          <section className="welcome-card">
            <div>
              <p className="eyebrow">Signed in as</p>
              <h2>{currentUser.name}</h2>
              <p>{isFaculty ? 'Faculty dashboard' : 'Student dashboard'}</p>
            </div>
            <div className="welcome-controls">
              <div className="role-badge">{isFaculty ? 'Teacher' : 'Student'}</div>
            </div>
          </section>

          {isFaculty ? (
            <section className="faculty-shell">
              <Sidebar facultyView={facultyView} setFacultyView={setFacultyView} />
              <FacultyContent
                facultyView={facultyView}
                students={students}
                attendanceList={attendanceList}
                attendanceForm={attendanceForm}
                setAttendanceForm={setAttendanceForm}
                handleAttendanceSubmit={handleAttendanceSubmit}
                loading={loading}
              />
            </section>
          ) : (
            <StudentDashboard summary={summary} studentAttendance={studentAttendance} />
          )}
        </main>
      )}
    </div>
  )
}

export default App
