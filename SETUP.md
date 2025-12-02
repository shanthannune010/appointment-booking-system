# Quick Setup Guide

## Step-by-Step Setup

### 1. Backend Environment File

Create a `.env` file in the `backend` directory with the following content:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/appointment-booking
NODE_ENV=development
```

**For MongoDB Atlas (Cloud):**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/appointment-booking
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Start MongoDB

**Windows:**
- If MongoDB is installed as a service, it should start automatically
- Or run: `mongod` in a terminal

**Mac/Linux:**
```bash
mongod
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Open Browser

Navigate to: `http://localhost:3000`

## Troubleshooting

- **MongoDB not running**: Start MongoDB service or run `mongod`
- **Port 5000 in use**: Change PORT in backend/.env
- **Port 3000 in use**: Change port in frontend/vite.config.js
- **CORS errors**: Ensure backend is running on port 5000


