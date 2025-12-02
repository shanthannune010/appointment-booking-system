import { useState, useEffect } from 'react'
import { createAppointment } from '../services/api'
import { formatDate, formatTime } from '../utils/dateUtils'

const BookingForm = ({ selectedDate, selectedTime, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    reason: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedDate || !selectedTime) {
      setFormData({ name: '', email: '', phone: '', reason: '' })
      setErrors({})
    }
  }, [selectedDate, selectedTime])

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePhone = (phone) => {
    if (!phone || !phone.trim()) {
      return true // Phone is optional, so empty is valid
    }
    // Remove common phone number characters for validation
    const cleaned = phone.replace(/[\s\-\(\)\+]/g, '')
    // Check if it contains exactly 10 digits
    const phoneRegex = /^\d{10}$/
    return phoneRegex.test(cleaned)
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (formData.phone && formData.phone.trim() && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }

    if (formData.reason.length > 200) {
      newErrors.reason = 'Reason must be 200 characters or less'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const [showConfirmBooking, setShowConfirmBooking] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedDate || !selectedTime) {
      onError('Please select a date and time slot')
      return
    }

    if (!validate()) {
      return
    }

    // Show confirmation dialog
    setShowConfirmBooking(true)
  }

  const confirmBooking = async () => {
    setShowConfirmBooking(false)
    setLoading(true)
    try {
      // Ensure date is in YYYY-MM-DD format
      const dateToSend = typeof selectedDate === 'string' 
        ? selectedDate 
        : formatDate(selectedDate)
      
      const response = await createAppointment({
        date: dateToSend,
        time: selectedTime,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        reason: formData.reason.trim() || undefined
      })
      
      setFormData({ name: '', email: '', phone: '', reason: '' })
      // Handle both old and new response formats
      onSuccess(response.data.data || response.data)
    } catch (error) {
      console.error('Booking error:', error)
      let errorMessage = 'Failed to book appointment'
      
      if (error.response?.data) {
        if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          errorMessage = error.response.data.errors[0].msg || error.response.data.errors[0].message
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error
        }
      } else if (error.message) {
        errorMessage = error.message
      }
      
      onError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const cancelBooking = () => {
    setShowConfirmBooking(false)
  }

  if (!selectedDate || !selectedTime) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Booking Form</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg font-medium mb-2">Select a Time Slot</p>
          <p className="text-gray-500 text-sm">
            Click on an available time slot from the calendar to start booking
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 h-full relative">
      {/* Booking Confirmation Dialog */}
      {showConfirmBooking && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-200 p-6 max-w-md mx-4 transform transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Confirm Booking</h3>
                <p className="text-sm text-gray-600">Please review your appointment details</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-200">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Date:</span>
                  <span className="text-gray-800">{formatDate(typeof selectedDate === 'string' ? selectedDate : new Date(selectedDate))}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Time:</span>
                  <span className="text-gray-800">{formatTime(selectedTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Name:</span>
                  <span className="text-gray-800">{formData.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Email:</span>
                  <span className="text-gray-800">{formData.email}</span>
                </div>
                {formData.phone && formData.phone.trim() && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">Phone:</span>
                    <span className="text-gray-800">{formData.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelBooking}
                className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Booking Form</h2>
      </div>
      
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <div className="flex items-center gap-2 mb-1">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-semibold text-blue-900">Selected Appointment</p>
        </div>
        <p className="text-base text-blue-800 font-medium">
          {formatDate(typeof selectedDate === 'string' ? selectedDate : new Date(selectedDate))} at {formatTime(selectedTime)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
              errors.name 
                ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 hover:border-gray-400'
            }`}
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
              errors.email 
                ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 hover:border-gray-400'
            }`}
            placeholder="john.doe@example.com"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number <span className="text-gray-400 text-xs font-normal">(optional)</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
              errors.phone 
                ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 hover:border-gray-400'
            }`}
            placeholder="+1 (555) 123-4567"
          />
          {errors.phone && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="reason" className="block text-sm font-semibold text-gray-700 mb-2">
            Reason / Notes <span className="text-gray-400 text-xs font-normal">(optional, max 200 chars)</span>
          </label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows="4"
            maxLength={200}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${
              errors.reason 
                ? 'border-red-400 focus:border-red-500 focus:ring-red-200 bg-red-50' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 hover:border-gray-400'
            }`}
            placeholder="Please describe the reason for your appointment..."
          />
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {errors.reason ? (
                <span className="text-red-600 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.reason}
                </span>
              ) : null}
            </p>
            <p className={`text-xs font-medium ${
              formData.reason.length > 180 ? 'text-orange-600' : 'text-gray-500'
            }`}>
              {formData.reason.length}/200
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:shadow-none"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Booking Appointment...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Confirm Booking
            </span>
          )}
        </button>
      </form>
    </div>
  )
}

export default BookingForm

