import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import About from './features/about/About'
import PeoplePage from './features/people/PeoplePage'
import Dashboard from './features/dashboard/Dashboard'
import Login from './features/auth/Login'

export default function App() {
  const [auth, setAuth] = useState(localStorage.getItem('caretrack-auth') === 'yes')
  const login = () => {
    localStorage.setItem('caretrack-auth', 'yes')
    setAuth(true)
  }

  return auth ? (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/about" element={<About />} />
      <Route path="/clinicians" element={<PeoplePage type="clinician" />} />
      <Route path="/patients" element={<PeoplePage type="patient" />} />
      <Route path="*" element={<Dashboard />} />
    </Routes>
  ) : (
    <Login onLogin={login} />
  )
}
