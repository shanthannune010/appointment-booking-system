# Appointment Booking System

A full-stack appointment booking system built with React, Node.js, Express, and MongoDB. This application allows users to view available time slots, book appointments, and manage their bookings through an intuitive calendar interface.

## Features

- **Calendar View**: Display current week with available time slots (30-minute increments, 9:00 AM - 5:00 PM, Mon-Fri)
  - Date display with month abbreviation (e.g., "Dec 1", "Dec 2")
  - Custom date/week selector for easy navigation
  - Visual indicators for available, booked, and past time slots
  - Week navigation with Previous/Next buttons
  - "Today" button for quick navigation
- **Booking Form**: Create appointments with comprehensive validation
  - Required fields: Name, Email
  - Optional fields: Phone (10-digit validation), Reason (max 200 chars)
  - Real-time validation with error messages
  - Confirmation modal before booking
  - Success confirmation after booking
- **Appointments List**: View all bookings sorted chronologically
  - Statistics dashboard (Total, Upcoming, Past appointments)
  - Cancel functionality with confirmation dialog
  - Displays all appointment details including phone number
- **Separate Pages**: 
  - Booking Page: Calendar view with booking form
  - Appointments Page: List of all appointments with statistics
  - Navigation bar with active state indicators
- **Business Logic**: 
  - Prevents double-booking (enforced at database level)
  - Validates business hours (9 AM - 5 PM, weekdays only)
  - Blocks past dates and time slots
  - Prevents navigation to past weeks
- **API Responses**: All endpoints return standardized responses with HTTP status codes
- **Responsive Design**: Modern UI built with Tailwind CSS, gradients, and smooth animations

## Technologies Used

### Frontend
- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Express Validator** - Request validation middleware
- **CORS** - Cross-origin resource sharing

## Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd appointment-booking-system
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
# For Windows PowerShell:
Copy-Item .env.example .env

# For Linux/Mac:
cp .env.example .env

# Edit .env file with your MongoDB connection string
# Example:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/appointment-booking
# NODE_ENV=development
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# If using local MongoDB
mongod

# Or if MongoDB is installed as a service, it should start automatically
```

### 5. Run the Application

#### Terminal 1 - Backend Server

```bash
cd backend
npm run dev
# Server will run on http://localhost:5000
```

#### Terminal 2 - Frontend Development Server

```bash
cd frontend
npm run dev
# Frontend will run on http://localhost:3000
```

### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Get All Appointments
- **Method**: `GET`
- **Endpoint**: `/api/appointments`
- **Description**: Retrieves all appointments sorted chronologically
- **Response** (200): 
  ```json
  {
    "statusCode": 200,
    "success": true,
    "data": [
      {
        "_id": "appointment_id",
        "date": "2024-01-15T00:00:00.000Z",
        "time": "10:00",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "123-456-7890",
        "reason": "Consultation",
        "createdAt": "2024-01-10T10:00:00.000Z"
      }
    ],
    "count": 1
  }
  ```
- **Error Response** (500):
  ```json
  {
    "statusCode": 500,
    "success": false,
    "error": "Failed to fetch appointments",
    "message": "Error details"
  }
  ```

#### 2. Get Available Time Slots
- **Method**: `GET`
- **Endpoint**: `/api/appointments/available`
- **Query Parameters**: 
  - `date` (required): Date in YYYY-MM-DD format
- **Description**: Returns available and booked time slots for a specific date
- **Example**: `GET /api/appointments/available?date=2024-01-15`
- **Success Response** (200):
  ```json
  {
    "statusCode": 200,
    "success": true,
    "date": "2024-01-15",
    "availableSlots": ["09:00", "09:30", "10:30", "11:00"],
    "bookedSlots": ["10:00", "11:30"],
    "totalAvailable": 4,
    "totalBooked": 2
  }
  ```
- **Error Responses**:
  - `400`: Invalid date format, non-weekday, or missing date parameter
    ```json
    {
      "statusCode": 400,
      "success": false,
      "error": "Error message"
    }
    ```
  - `500`: Server error
    ```json
    {
      "statusCode": 500,
      "success": false,
      "error": "Failed to fetch available slots",
      "message": "Error details"
    }
    ```

#### 3. Create Appointment
- **Method**: `POST`
- **Endpoint**: `/api/appointments`
- **Description**: Creates a new appointment
- **Request Body**:
  ```json
  {
    "date": "2024-01-15",
    "time": "10:00",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "reason": "Consultation"
  }
  ```
- **Required Fields**: `date`, `time`, `name`, `email`
- **Optional Fields**: `phone` (must be exactly 10 digits if provided), `reason` (max 200 characters)
- **Success Response** (201):
  ```json
  {
    "statusCode": 201,
    "success": true,
    "message": "Appointment created successfully",
    "data": {
      "_id": "appointment_id",
      "date": "2024-01-15T00:00:00.000Z",
      "time": "10:00",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "reason": "Consultation",
      "createdAt": "2024-01-10T10:00:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - `400`: Validation error or invalid date/time
    ```json
    {
      "statusCode": 400,
      "success": false,
      "error": "Validation failed",
      "errors": [{"msg": "Error message", "param": "field"}]
    }
    ```
  - `409`: Time slot already booked (double-booking)
    ```json
    {
      "statusCode": 409,
      "success": false,
      "error": "This time slot is already booked"
    }
    ```
  - `500`: Server error
    ```json
    {
      "statusCode": 500,
      "success": false,
      "error": "Failed to create appointment",
      "message": "Error details"
    }
    ```

#### 4. Cancel Appointment
- **Method**: `DELETE`
- **Endpoint**: `/api/appointments/:id`
- **Description**: Cancels/deletes an appointment by ID
- **Example**: `DELETE /api/appointments/507f1f77bcf86cd799439011`
- **Success Response** (200):
  ```json
  {
    "statusCode": 200,
    "success": true,
    "message": "Appointment cancelled successfully",
    "data": {
      "_id": "appointment_id",
      "date": "2024-01-15T00:00:00.000Z",
      "time": "10:00",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```
- **Error Responses**:
  - `400`: Invalid appointment ID format
    ```json
    {
      "statusCode": 400,
      "success": false,
      "error": "Invalid appointment ID format"
    }
    ```
  - `404`: Appointment not found
    ```json
    {
      "statusCode": 404,
      "success": false,
      "error": "Appointment not found"
    }
    ```
  - `500`: Server error
    ```json
    {
      "statusCode": 500,
      "success": false,
      "error": "Failed to cancel appointment",
      "message": "Error details"
    }
    ```

#### 5. Health Check
- **Method**: `GET`
- **Endpoint**: `/api/health`
- **Description**: Server health check endpoint
- **Response** (200):
  ```json
  {
    "statusCode": 200,
    "success": true,
    "status": "OK",
    "message": "Server is running",
    "timestamp": "2024-01-15T10:00:00.000Z"
  }
  ```

## Key Features & Highlights

### User Interface
- **Separate Pages**: Clean separation between booking and appointments management
- **Date/Week Selector**: Jump to any date or week with the date picker
- **Visual Calendar**: Color-coded time slots with month abbreviations (Dec 1, Dec 2)
- **Confirmation Dialogs**: Inline confirmation modals for booking and canceling
- **Statistics Dashboard**: View total, upcoming, and past appointments at a glance
- **Modern Design**: Gradient backgrounds, smooth animations, and responsive layout

### Validation & Security
- **Comprehensive Validation**: 
  - Email format validation
  - Phone number validation (exactly 10 digits)
  - Required field validation
  - Character limit validation (reason: 200 chars)
- **Past Date Blocking**: Prevents booking past dates and time slots
- **Double-booking Prevention**: Database-level uniqueness constraint
- **Error Handling**: Clear, user-friendly error messages

### API Features
- **Standardized Responses**: All endpoints return consistent response format
- **HTTP Status Codes**: Proper status codes (200, 201, 400, 404, 409, 500)
- **Response Structure**: Includes `statusCode`, `success`, `data`, and `error` fields
- **Health Check Endpoint**: Monitor server status

## Business Rules & Assumptions

### Business Hours
- Appointments are only available on **weekdays (Monday-Friday)**
- Time slots are in **30-minute increments**
- Operating hours: **9:00 AM - 5:00 PM** (16 slots per day)
- Total available slots per week: **80 slots** (16 slots × 5 days)

### Validation Rules
1. **Double-booking Prevention**: Each date-time combination is unique (enforced at database level)
2. **Past Appointments**: Users cannot book appointments in the past
   - Past dates are completely blocked
   - Past time slots for today are blocked
   - Navigation to past weeks is disabled
3. **Business Hours Only**: Only time slots within 9:00 AM - 5:00 PM are available
4. **Weekdays Only**: Weekend bookings are not allowed
5. **Email Validation**: Must be a valid email format (required)
6. **Phone Validation**: If provided, must be exactly 10 digits (optional field)
   - Accepts common formatting (spaces, dashes, parentheses, plus signs)
   - Validates the cleaned number (digits only)
7. **Reason Length**: Maximum 200 characters (optional)
8. **Name Validation**: Required field, must not be empty

### Design Decisions

1. **Time Format**: Stored as "HH:MM" (24-hour format) in database, displayed as "H:MM AM/PM" in UI
2. **Date Handling**: Dates are stored as full Date objects in MongoDB, but passed as YYYY-MM-DD strings in API
3. **Date Display**: Calendar shows dates with month abbreviation (e.g., "Dec 1", "Dec 2") for better clarity
4. **Calendar Navigation**: 
   - Shows current week (Monday-Friday) with navigation buttons
   - Custom date picker to jump to any date/week
   - "Today" button for quick navigation
   - Prevents navigation to past weeks
5. **Page Structure**: 
   - Separate pages for booking and appointments list
   - Navigation bar with active state indicators
   - React Router for client-side routing
6. **Confirmation Dialogs**: 
   - Booking confirmation before submitting
   - Cancel confirmation before deleting
   - Success confirmation after booking
   - All modals are inline (no separate component)
7. **API Response Format**: 
   - Standardized response structure with `statusCode`, `success`, `data`, and `error` fields
   - All endpoints return consistent response format
8. **Real-time Updates**: Available slots are fetched when week changes or after booking/cancellation
9. **Error Handling**: User-friendly error messages displayed in the UI with visual indicators
10. **Responsive Design**: Mobile-friendly layout using Tailwind CSS with gradients and animations
11. **Visual Feedback**: 
    - Color-coded time slots (green: available, red: booked, gray: past/not available)
    - Loading states and animations
    - Hover effects and transitions

## Project Structure

```
appointment-booking-system/
├── backend/
│   ├── models/
│   │   └── Appointment.js          # MongoDB schema
│   ├── routes/
│   │   └── appointments.js          # API routes with status codes
│   ├── server.js                    # Express server setup
│   ├── package.json
│   ├── .env                         # Environment variables
│   └── .env.example                 # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CalendarView.jsx     # Week calendar with date selector
│   │   │   ├── BookingForm.jsx      # Booking form with validation
│   │   │   ├── AppointmentsList.jsx # Appointments table with stats
│   │   │   └── Navigation.jsx      # Navigation bar component
│   │   ├── pages/
│   │   │   ├── BookingPage.jsx      # Booking page (calendar + form)
│   │   │   └── AppointmentsPage.jsx # Appointments list page
│   │   ├── services/
│   │   │   └── api.js               # API service with interceptors
│   │   ├── utils/
│   │   │   └── dateUtils.js         # Date formatting utilities
│   │   ├── App.jsx                  # Main app with routing
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Tailwind CSS with custom styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
└── README.md
```

## Future Improvements

### Features
- [ ] User authentication and authorization
- [ ] Email notifications for booking confirmations
- [ ] Appointment reminders (email/SMS)
- [ ] Recurring appointments
- [ ] Admin dashboard for managing appointments
- [ ] Search and filter functionality for appointments
- [ ] Export appointments to CSV/PDF
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Multi-timezone support
- [ ] Appointment rescheduling functionality

### Technical
- [ ] Unit and integration tests
- [ ] API rate limiting
- [ ] Input sanitization and XSS protection
- [ ] Database indexing optimization
- [ ] Caching for frequently accessed data
- [ ] WebSocket for real-time updates
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] API documentation with Swagger/OpenAPI
- [ ] Error logging and monitoring (e.g., Sentry)

### UI/UX
- [x] Confirmation modals for booking and canceling
- [x] Custom date/week selector
- [x] Visual indicators for slot status
- [x] Statistics dashboard
- [x] Improved styling with gradients and animations
- [ ] Dark mode support
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)
- [ ] Loading skeletons
- [ ] Toast notifications
- [ ] Drag-and-drop calendar interface
- [ ] Mobile app (React Native)

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or check service status
- Verify connection string in `.env` file
- Check if MongoDB is listening on default port 27017

### Port Already in Use
- Backend: Change `PORT` in `.env` file
- Frontend: Modify `server.port` in `vite.config.js`

### CORS Errors
- Ensure backend CORS is configured correctly
- Check that frontend proxy settings in `vite.config.js` match backend port

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility (v16+)

## License

This project is created for demonstration purposes as part of a full-stack developer interview exercise.

## Author

Built as a full-stack development demonstration project.

