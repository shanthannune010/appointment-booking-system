import { useState } from 'react'
import { formatDate, formatTime } from '../utils/dateUtils'

const AppointmentsList = ({ appointments, onCancel, loading }) => {
  const [cancelConfirmId, setCancelConfirmId] = useState(null)
  const [appointmentToCancel, setAppointmentToCancel] = useState(null)

  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateA - dateB
  })

  const handleCancelClick = (id, appointment) => {
    setCancelConfirmId(id)
    setAppointmentToCancel(appointment)
  }

  const confirmCancel = () => {
    if (cancelConfirmId) {
      onCancel(cancelConfirmId)
      setCancelConfirmId(null)
      setAppointmentToCancel(null)
    }
  }

  const cancelCancel = () => {
    setCancelConfirmId(null)
    setAppointmentToCancel(null)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">All Appointments</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600 font-medium">Loading appointments...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 relative">
      {/* Cancel Confirmation Dialog */}
      {cancelConfirmId && appointmentToCancel && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-red-200 p-6 max-w-md mx-4 transform transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Cancel Appointment?</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-xl p-4 mb-6 border border-red-200">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Date:</span>
                  <span className="text-gray-800">{formatDate(new Date(appointmentToCancel.date))}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Time:</span>
                  <span className="text-gray-800">{formatTime(appointmentToCancel.time)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Name:</span>
                  <span className="text-gray-800">{appointmentToCancel.name}</span>
                </div>
                {appointmentToCancel.phone && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">Phone:</span>
                    <span className="text-gray-800">{appointmentToCancel.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelCancel}
                className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all"
              >
                Keep Appointment
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-rose-700 transition-all shadow-md hover:shadow-lg"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">All Appointments</h2>
        <span className="ml-auto px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
          {sortedAppointments.length} {sortedAppointments.length === 1 ? 'appointment' : 'appointments'}
        </span>
      </div>
      
      {sortedAppointments.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg font-medium">No appointments booked yet</p>
          <p className="text-gray-400 text-sm mt-2">Book your first appointment using the calendar above</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Date</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Time</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Name</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Email</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Phone</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Reason</th>
                <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedAppointments.map((appointment) => {
                const appointmentDate = new Date(appointment.date)
                const isPast = new Date(`${appointment.date}T${appointment.time}`) < new Date()
                
                return (
                  <tr 
                    key={appointment._id} 
                    className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all ${
                      isPast ? 'opacity-60' : ''
                    }`}
                  >
                    <td className="py-4 px-4 text-sm text-gray-700 font-medium">
                      {formatDate(appointmentDate)}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700 font-medium">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-lg font-semibold">
                        {formatTime(appointment.time)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-800 font-semibold">
                      {appointment.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      {appointment.email}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      {appointment.phone || <span className="text-gray-400">-</span>}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      {appointment.reason || <span className="text-gray-400">-</span>}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleCancelClick(appointment._id, appointment)}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-semibold rounded-lg hover:from-red-600 hover:to-rose-700 transition-all shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AppointmentsList

