import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import BookingPage from './pages/BookingPage'
import AppointmentsPage from './pages/AppointmentsPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<BookingPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

