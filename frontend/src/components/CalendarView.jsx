import { useState } from 'react'
import { formatDate, formatTime, getDayName, formatDateWithMonth } from '../utils/dateUtils'

const CalendarView = ({ 
  weekDates, 
  availableSlots, 
  appointments, 
  onSlotSelect, 
  selectedDate, 
  selectedTime,
  onWeekChange,
  onDateSelect,
  onGoToToday
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [dateInputValue, setDateInputValue] = useState('')
  const businessHours = []
  for (let hour = 9; hour < 17; hour++) {
    businessHours.push(`${hour.toString().padStart(2, '0')}:00`)
    businessHours.push(`${hour.toString().padStart(2, '0')}:30`)
  }

  const isSlotBooked = (date, time) => {
    const dateStr = formatDate(date)
    return appointments.some(apt => {
      const aptDate = new Date(apt.date).toISOString().split('T')[0]
      return aptDate === dateStr && apt.time === time
    })
  }

  const isSlotAvailable = (date, time) => {
    const dateStr = formatDate(date)
    const slots = availableSlots[dateStr]
    return slots && slots.availableSlots && slots.availableSlots.includes(time)
  }

  const isSlotSelected = (date, time) => {
    const dateStr = formatDate(date)
    return selectedDate === dateStr && selectedTime === time
  }

  // Check if a date is in the past
  const isPastDate = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    return checkDate < today
  }

  // Check if a time slot is in the past
  const isPastTimeSlot = (date, time) => {
    const now = new Date()
    const [hours, minutes] = time.split(':').map(Number)
    const slotDateTime = new Date(date)
    slotDateTime.setHours(hours, minutes, 0, 0)
    return slotDateTime < now
  }

  const getCurrentWeekRange = () => {
    if (weekDates.length === 0) return ''
    const start = weekDates[0]
    const end = weekDates[weekDates.length - 1]
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  }

  const handleDateInputChange = (e) => {
    setDateInputValue(e.target.value)
  }

  const handleDateSubmit = (e) => {
    e.preventDefault()
    if (dateInputValue && onDateSelect) {
      onDateSelect(dateInputValue)
      setDateInputValue('')
      setShowDatePicker(false)
    }
  }

  const handleTodayClick = () => {
    if (onGoToToday) {
      onGoToToday()
      setShowDatePicker(false)
    }
  }

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  // Get minimum date (today)
  const getMinDate = () => {
    return getTodayDate()
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8 backdrop-blur-sm">
      {/* Date Selector and Navigation */}
      <div className="mb-8 space-y-4">
        {/* Date Picker Section */}
        <div className="p-5 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl border-2 border-blue-200 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Date Input */}
            <div className="flex items-center gap-3 flex-1 min-w-[250px]">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <form onSubmit={handleDateSubmit} className="flex items-center gap-2 flex-1">
                <input
                  type="date"
                  value={dateInputValue}
                  onChange={handleDateInputChange}
                  min={getMinDate()}
                  className="flex-1 px-4 py-2.5 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-700 bg-white shadow-sm"
                  placeholder="Select a date"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Go
                </button>
              </form>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleTodayClick}
                className="px-4 py-2.5 bg-white border-2 border-blue-300 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Today
              </button>
            </div>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => onWeekChange('prev')}
            className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl transition-all font-semibold text-gray-700 hover:text-gray-900 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={(() => {
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              const firstDayOfWeek = new Date(weekDates[0])
              firstDayOfWeek.setHours(0, 0, 0, 0)
              return firstDayOfWeek <= today
            })()}
            title={(() => {
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              const firstDayOfWeek = new Date(weekDates[0])
              firstDayOfWeek.setHours(0, 0, 0, 0)
              return firstDayOfWeek <= today ? 'Cannot navigate to past weeks' : 'Previous Week'
            })()}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous Week
          </button>
          <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3 rounded-xl border-2 border-blue-200">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {getCurrentWeekRange()}
            </h2>
            <p className="text-sm text-gray-600 mt-1 font-medium">Business Hours: 9:00 AM - 5:00 PM</p>
          </div>
          <button
            onClick={() => onWeekChange('next')}
            className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl transition-all font-semibold text-gray-700 hover:text-gray-900 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
          >
            Next Week
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-5 gap-4 min-w-max">
          {weekDates.map((date, dayIndex) => {
            const dateStr = formatDate(date)
            const isToday = dateStr === new Date().toISOString().split('T')[0]
            
            return (
              <div key={dayIndex} className="min-w-[200px]">
                {(() => {
                  const dayIsPast = isPastDate(date)
                  return (
                    <div className={`text-center mb-5 p-4 rounded-2xl shadow-lg transition-all ${
                      isToday 
                        ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white font-bold shadow-xl scale-105 border-4 border-blue-300' 
                        : dayIsPast
                          ? 'bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-gray-400 opacity-60'
                          : 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 hover:shadow-md'
                    }`}>
                      <div className={`text-xs font-bold uppercase tracking-wider opacity-90 mb-1 ${
                        dayIsPast ? 'text-gray-500' : ''
                      }`}>
                        {getDayName(date)}
                        {dayIsPast && ' (Past)'}
                      </div>
                      <div className={`text-2xl font-extrabold ${
                        isToday 
                          ? 'text-white drop-shadow-lg' 
                          : dayIsPast 
                            ? 'text-gray-500' 
                            : 'text-gray-800'
                      }`}>
                        {formatDateWithMonth(date)}
                      </div>
                    </div>
                  )
                })()}
                
                <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">
                  {businessHours.map((time) => {
                    const booked = isSlotBooked(date, time)
                    const available = isSlotAvailable(date, time)
                    const selected = isSlotSelected(date, time)
                    const isPast = isPastDate(date) || isPastTimeSlot(date, time)
                    
                    let slotClass = 'p-3.5 text-sm font-semibold rounded-xl border-2 transition-all transform duration-200 '
                    
                    if (isPast) {
                      slotClass += 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed opacity-50'
                    } else if (selected) {
                      slotClass += 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white border-blue-400 shadow-2xl scale-105 ring-4 ring-blue-200 cursor-pointer'
                    } else if (booked) {
                      slotClass += 'bg-gradient-to-br from-red-50 to-red-100 text-red-700 border-red-300 cursor-not-allowed opacity-60 line-through'
                    } else if (available) {
                      slotClass += 'bg-gradient-to-br from-green-50 to-emerald-50 text-green-700 border-green-300 hover:from-green-100 hover:to-emerald-100 hover:border-green-400 hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer'
                    } else {
                      slotClass += 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                    }

                    return (
                      <div
                        key={time}
                        className={slotClass}
                        onClick={() => !isPast && !booked && available && onSlotSelect(dateStr, time)}
                        title={
                          isPast 
                            ? 'Past time slot - Cannot book' 
                            : booked 
                              ? 'Booked' 
                              : available 
                                ? 'Available - Click to select' 
                                : 'Not available'
                        }
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold">{formatTime(time)}</span>
                          {selected && !isPast && (
                            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                              <svg className="w-3.5 h-3.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                          {isPast && (
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                        {booked && !isPast && (
                          <span className="block text-xs mt-1.5 font-normal opacity-75">Unavailable</span>
                        )}
                        {isPast && (
                          <span className="block text-xs mt-1.5 font-normal opacity-75">Past</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t-2 border-gray-200 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-300 shadow-sm">
          <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg border-2 border-green-600 shadow-sm"></div>
          <span className="font-bold text-green-800">Available</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border-2 border-red-300 shadow-sm">
          <div className="w-5 h-5 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg border-2 border-red-600 shadow-sm"></div>
          <span className="font-bold text-red-800">Booked</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border-2 border-gray-300 shadow-sm">
          <div className="w-5 h-5 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg border-2 border-gray-500 shadow-sm"></div>
          <span className="font-bold text-gray-600">Not Available</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl border-2 border-gray-400 shadow-sm opacity-75">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-bold text-gray-600">Past (Blocked)</span>
        </div>
      </div>
    </div>
  )
}

export default CalendarView

