import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppointmentsList from '../components/AppointmentsList'
import { getAppointments, cancelAppointment } from '../services/api'

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([])
  const [message, setMessage] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await getAppointments()
      // Handle both old and new response formats
      setAppointments(response.data.data || response.data)
    } catch (error) {
      showMessage('error', 'Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 5000)
  }

  const handleCancel = async (id) => {
    try {
      await cancelAppointment(id)
      fetchAppointments()
      showMessage('success', 'Appointment cancelled successfully!')
    } catch (error) {
      showMessage('error', error.response?.data?.error || 'Failed to cancel appointment')
    }
  }

  const upcomingAppointments = appointments.filter(apt => {
    const aptDate = new Date(`${apt.date}T${apt.time}`)
    return aptDate >= new Date()
  })

  const pastAppointments = appointments.filter(apt => {
    const aptDate = new Date(`${apt.date}T${apt.time}`)
    return aptDate < new Date()
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 pb-12">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl shadow-xl mb-6 transform hover:scale-105 transition-transform">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 mb-3">
            My Appointments
          </h1>
          <p className="text-gray-600 text-lg font-medium">View and manage all your appointments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Appointments</p>
                <p className="text-3xl font-bold text-gray-800">{appointments.length}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Upcoming</p>
                <p className="text-3xl font-bold text-green-600">{upcomingAppointments.length}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Past</p>
                <p className="text-3xl font-bold text-gray-500">{pastAppointments.length}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-8 p-5 rounded-2xl shadow-lg border-2 flex items-center gap-4 ${
            message.type === 'success' 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-green-300' 
              : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-red-300'
          }`}>
            {message.type === 'success' ? (
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            ) : (
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <p className="font-semibold text-lg">{message.text}</p>
          </div>
        )}

        {/* Quick Action Button */}
        {appointments.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 text-center mb-8">
            <p className="text-gray-600 text-lg mb-4">No appointments yet. Book your first appointment!</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Book Appointment
            </button>
          </div>
        )}

        {/* Appointments List */}
        <AppointmentsList
          appointments={appointments}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default AppointmentsPage

