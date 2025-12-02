const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');

// Helper function to get business hours slots
function getBusinessHoursSlots() {
  const slots = [];
  for (let hour = 9; hour < 17; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return slots;
}

// Helper function to check if date is a weekday (Mon-Fri)
function isWeekday(date) {
  const day = date.getDay();
  return day >= 1 && day <= 5; // Monday = 1, Friday = 5
}

// Helper function to check if date is in the past
function isPastDate(date, time) {
  const now = new Date();
  const [hours, minutes] = time.split(':').map(Number);
  const appointmentDateTime = new Date(date);
  appointmentDateTime.setHours(hours, minutes, 0, 0);
  return appointmentDateTime < now;
}

// GET /api/appointments - Get all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .sort({ date: 1, time: 1 })
      .select('-__v');
    res.status(200).json({
      statusCode: 200,
      success: true,
      data: appointments,
      count: appointments.length
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      success: false,
      error: 'Failed to fetch appointments',
      message: error.message
    });
  }
});

// GET /api/appointments/available - Get available time slots
router.get('/available', async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        error: 'Date parameter is required (YYYY-MM-DD)'
      });
    }

    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        error: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    // Check if it's a weekday
    if (!isWeekday(selectedDate)) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        error: 'Appointments are only available on weekdays (Mon-Fri)'
      });
    }

    // Check if the date is in the past
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    
    if (selectedDateOnly < today) {
      return res.status(200).json({
        statusCode: 200,
        success: true,
        date: date,
        availableSlots: [],
        bookedSlots: [],
        message: 'This date is in the past'
      });
    }

    // Get all business hours slots
    const allSlots = getBusinessHoursSlots();
    
    // Get booked appointments for the date
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    const bookedTimes = new Set(bookedAppointments.map(apt => apt.time));
    
    // Filter out past times if date is today
    const isToday = selectedDateOnly.getTime() === today.getTime();
    
    const availableSlots = allSlots.filter(slot => {
      // Remove booked slots
      if (bookedTimes.has(slot)) {
        return false;
      }
      
      // Remove past slots if it's today
      if (isToday && isPastDate(selectedDate, slot)) {
        return false;
      }
      
      return true;
    });

    res.status(200).json({
      statusCode: 200,
      success: true,
      date: date,
      availableSlots: availableSlots,
      bookedSlots: Array.from(bookedTimes),
      totalAvailable: availableSlots.length,
      totalBooked: bookedTimes.size
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      success: false,
      error: 'Failed to fetch available slots',
      message: error.message
    });
  }
});

// POST /api/appointments - Create appointment
router.post('/', [
  body('date').notEmpty().withMessage('Date is required'),
  body('time').notEmpty().withMessage('Time is required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional().trim(),
  body('reason').optional().trim().isLength({ max: 200 }).withMessage('Reason must be 200 characters or less')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        error: 'Validation failed',
        errors: errors.array()
      });
    }

    const { date, time, name, email, phone, reason } = req.body;

    // Validate date
    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        error: 'Invalid date format'
      });
    }

    // Check if it's a weekday
    if (!isWeekday(appointmentDate)) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        error: 'Appointments are only available on weekdays (Mon-Fri)'
      });
    }

    // Check if date is in the past
    if (isPastDate(appointmentDate, time)) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        error: 'Cannot book appointments in the past'
      });
    }

    // Validate time slot
    const validSlots = getBusinessHoursSlots();
    if (!validSlots.includes(time)) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        error: 'Invalid time slot. Business hours are 9:00 AM - 5:00 PM in 30-minute increments'
      });
    }

    // Check for double-booking
    const startOfDay = new Date(appointmentDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(appointmentDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointment = await Appointment.findOne({
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      time: time
    });

    if (existingAppointment) {
      return res.status(409).json({
        statusCode: 409,
        success: false,
        error: 'This time slot is already booked'
      });
    }

    // Create appointment
    const appointment = new Appointment({
      date: appointmentDate,
      time,
      name,
      email,
      phone: phone || undefined,
      reason: reason || undefined
    });

    const savedAppointment = await appointment.save();
    res.status(201).json({
      statusCode: 201,
      success: true,
      message: 'Appointment created successfully',
      data: savedAppointment
    });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error (double-booking)
      return res.status(409).json({
        statusCode: 409,
        success: false,
        error: 'This time slot is already booked'
      });
    }
    res.status(500).json({
      statusCode: 500,
      success: false,
      error: 'Failed to create appointment',
      message: error.message
    });
  }
});

// DELETE /api/appointments/:id - Cancel appointment
router.delete('/:id', async (req, res) => {
  try {
    // Validate ID format
    if (!req.params.id || req.params.id.length !== 24) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        error: 'Invalid appointment ID format'
      });
    }

    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        error: 'Appointment not found'
      });
    }

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      success: false,
      error: 'Failed to cancel appointment',
      message: error.message
    });
  }
});

module.exports = router;

