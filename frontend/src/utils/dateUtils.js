export const formatDate = (date) => {
  if (typeof date === 'string') {
    return date
  }
  return date.toISOString().split('T')[0]
}

export const formatTime = (time) => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

export const formatDateTime = (date, time) => {
  const dateStr = formatDate(date)
  const timeStr = formatTime(time)
  return `${dateStr} at ${timeStr}`
}

export const getDayName = (date) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[date.getDay()]
}

export const getMonthName = (date) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December']
  return months[date.getMonth()]
}

export const getMonthAbbreviation = (date) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months[date.getMonth()]
}

export const formatDateWithMonth = (date) => {
  const month = getMonthAbbreviation(date)
  const day = date.getDate()
  return `${month} ${day}`
}

