import { useState, useEffect } from 'react'
import CalendarView from '../components/CalendarView'
import BookingForm from '../components/BookingForm'
import { getAppointments, getAvailableSlots } from '../services/api'
import { formatTime } from '../utils/dateUtils'

const BookingPage = () => {
  const [appointments, setAppointments] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [availableSlots, setAvailableSlots] = useState({})
  const [message, setMessage] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)
  const [showBookingSuccess, setShowBookingSuccess] = useState(false)
  const [bookingDetails, setBookingDetails] = useState(null)

  // Get current week dates (Monday to Friday)
  const getCurrentWeek = () => {
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1) // Adjust to Monday
    const monday = new Date(today.setDate(diff))
    
    const week = []
    for (let i = 0; i < 5; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      week.push(date)
    }
    return week
  }

  const [weekDates, setWeekDates] = useState(getCurrentWeek())

  // Fetch appointments on mount
  useEffect(() => {
    fetchAppointments()
  }, [])

  // Fetch available slots for the week
  useEffect(() => {
    const fetchSlots = async () => {
      const slots = {}
      for (const date of weekDates) {
        const dateStr = formatDate(date)
        try {
          const response = await getAvailableSlots(dateStr)
          // Handle both old and new response formats
          slots[dateStr] = response.data.data || response.data
        } catch (error) {
          console.error(`Error fetching slots for ${dateStr}:`, error)
        }
      }
      setAvailableSlots(slots)
    }
    fetchSlots()
  }, [weekDates, appointments])

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

  const formatDate = (date) => {
    return date.toISOString().split('T')[0]
  }

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 5000)
  }

  const handleSlotSelect = (date, time) => {
    setSelectedDate(date)
    setSelectedTime(time)
  }

  const handleBookingSuccess = (details) => {
    fetchAppointments()
    setBookingDetails(details)
    setShowBookingSuccess(true)
    setSelectedDate(null)
    setSelectedTime(null)
  }

  const closeBookingSuccess = () => {
    setShowBookingSuccess(false)
    setBookingDetails(null)
  }

  // Get week containing a specific date (Monday to Friday)
  const getWeekForDate = (date) => {
    const targetDate = new Date(date)
    const day = targetDate.getDay()
    const diff = targetDate.getDate() - day + (day === 0 ? -6 : 1) // Adjust to Monday
    const monday = new Date(targetDate.setDate(diff))
    
    const week = []
    for (let i = 0; i < 5; i++) {
      const weekDate = new Date(monday)
      weekDate.setDate(monday.getDate() + i)
      week.push(weekDate)
    }
    return week
  }

  const handleWeekChange = (direction) => {
    const newWeek = weekDates.map(date => {
      const newDate = new Date(date)
      newDate.setDate(date.getDate() + (direction === 'next' ? 7 : -7))
      return newDate
    })
    
    // Prevent navigating to past weeks
    if (direction === 'prev') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const firstDayOfWeek = newWeek[0]
      firstDayOfWeek.setHours(0, 0, 0, 0)
      
      // If the new week is completely in the past, don't allow navigation
      if (firstDayOfWeek < today) {
        // Find the current week instead
        const currentWeek = getCurrentWeek()
        setWeekDates(currentWeek)
        return
      }
    }
    
    setWeekDates(newWeek)
  }

  const handleDateSelect = (selectedDate) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selected = new Date(selectedDate)
    selected.setHours(0, 0, 0, 0)
    
    // Prevent selecting past dates
    if (selected < today) {
      showMessage('error', 'Cannot select past dates. Please select today or a future date.')
      return
    }
    
    const week = getWeekForDate(selectedDate)
    setWeekDates(week)
  }

  const goToToday = () => {
    const currentWeek = getCurrentWeek()
    setWeekDates(currentWeek)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 pb-12">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-xl mb-6 transform hover:scale-105 transition-transform">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-3">
            Book Your Appointment
          </h1>
          <p className="text-gray-600 text-lg font-medium">Select a time slot and fill in your details</p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-8 p-5 rounded-2xl shadow-lg border-2 flex items-center gap-4 animate-in slide-in-from-top ${
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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <CalendarView
              weekDates={weekDates}
              availableSlots={availableSlots}
              appointments={appointments}
              onSlotSelect={handleSlotSelect}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onWeekChange={handleWeekChange}
              onDateSelect={handleDateSelect}
              onGoToToday={goToToday}
            />
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <BookingForm
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSuccess={handleBookingSuccess}
              onError={(error) => showMessage('error', error)}
            />
          </div>
        </div>
      </div>

      {/* Booking Success Confirmation */}
      {showBookingSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-green-200 p-8 max-w-md w-full transform transition-all animate-in slide-in-from-top">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Appointment Booked!</h3>
              <p className="text-gray-600 mb-6">
                {bookingDetails 
                  ? `Your appointment has been confirmed for ${new Date(bookingDetails.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${formatTime(bookingDetails.time)}. We look forward to seeing you!`
                  : 'Your appointment has been booked successfully!'
                }
              </p>
              <button
                onClick={closeBookingSuccess}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
              >
                Great!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingPage

