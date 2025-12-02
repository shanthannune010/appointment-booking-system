# Appointment Booking System

A full-stack appointment booking system built with React, Node.js, Express, and MongoDB. This application allows users to view available time slots, book appointments, and manage their bookings through an intuitive calendar interface.

## Features

- **Multi-Page Navigation**: Separate pages for booking and viewing appointments with React Router
- **Calendar View**: Display current week with available time slots (30-minute increments, 9:00 AM - 5:00 PM, Mon-Fri)
- **Date/Week Selector**: Custom date picker to jump to any week, with "Today" quick navigation
- **Booking Form**: Create appointments with comprehensive validation (Name, Email, Phone, Reason)
- **Appointments List**: View all bookings sorted chronologically with cancel functionality and statistics
- **Confirmation Modals**: Inline confirmation dialogs for booking and canceling appointments
- **Business Logic**: Prevents double-booking, validates business hours, and blocks past appointments
- **Past Date Blocking**: Automatically blocks past dates and time slots from being selected
- **Phone Validation**: 10-digit phone number validation (optional field)
- **Status Codes**: All API responses include proper HTTP status codes and structured response format
- **Responsive Design**: Modern, polished UI built with Tailwind CSS and gradient styling

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
- **Response** (200):
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
      "error": "Date parameter is required (YYYY-MM-DD)"
    }
    ```
  - `500`: Server error

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
- **Optional Fields**: `phone` (10 digits if provided), `reason` (max 200 characters)
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
      "errors": [...]
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
      ...
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

## Business Rules & Assumptions

### Business Hours
- Appointments are only available on **weekdays (Monday-Friday)**
- Time slots are in **30-minute increments**
- Operating hours: **9:00 AM - 5:00 PM** (16 slots per day)
- Total available slots per week: **80 slots** (16 slots × 5 days)

### Validation Rules
1. **Double-booking Prevention**: Each date-time combination is unique (enforced at database level)
2. **Past Appointments**: Users cannot book appointments in the past (dates and time slots are automatically blocked)
3. **Business Hours Only**: Only time slots within 9:00 AM - 5:00 PM are available
4. **Weekdays Only**: Weekend bookings are not allowed
5. **Email Validation**: Must be a valid email format (required)
6. **Phone Validation**: If provided, must be exactly 10 digits (optional field)
7. **Reason Length**: Maximum 200 characters (optional)
8. **Name Validation**: Required field, cannot be empty

### Design Decisions

1. **Time Format**: Stored as "HH:MM" (24-hour format) in database, displayed as "H:MM AM/PM" in UI
2. **Date Handling**: Dates are stored as full Date objects in MongoDB, but passed as YYYY-MM-DD strings in API
3. **Date Display**: Calendar shows dates in "Month Day" format (e.g., "Dec 1", "Dec 2") instead of just numbers
4. **Calendar View**: Shows current week (Monday-Friday) with navigation to previous/next weeks and custom date picker
5. **Page Routing**: Separate pages for booking (`/`) and viewing appointments (`/appointments`) using React Router
6. **Confirmation Modals**: Inline confirmation dialogs (no separate modal component) for booking and canceling
7. **Real-time Updates**: Available slots are fetched when week changes or after booking/cancellation
8. **Error Handling**: User-friendly error messages displayed in the UI with proper HTTP status codes
9. **API Response Format**: All responses include `statusCode`, `success`, and structured `data`/`error` fields
10. **Past Date Blocking**: Past dates and time slots are visually disabled and cannot be selected
11. **Responsive Design**: Mobile-friendly layout using Tailwind CSS with modern gradient styling

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
│   └── .env                         # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.jsx       # Top navigation bar
│   │   │   ├── CalendarView.jsx     # Week calendar with date picker
│   │   │   ├── BookingForm.jsx      # Booking form with validation
│   │   │   └── AppointmentsList.jsx # Appointments table
│   │   ├── pages/
│   │   │   ├── BookingPage.jsx      # Booking page component
│   │   │   └── AppointmentsPage.jsx # Appointments list page
│   │   ├── services/
│   │   │   └── api.js               # API service functions
│   │   ├── utils/
│   │   │   └── dateUtils.js         # Date formatting utilities
│   │   ├── App.jsx                  # Main app with routing
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Tailwind CSS imports
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
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

