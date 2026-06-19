# 🚗 SplashX Studio — MERN Stack Car Wash Website

A full-stack car wash studio website built with MongoDB, Express, React, and Node.js.

---

## 📁 Project Structure

```
splashx/
├── backend/                  # Node.js + Express API
│   ├── models/               # MongoDB Mongoose models
│   │   ├── User.js           # Customer & admin accounts
│   │   ├── Service.js        # Car wash services
│   │   ├── Plan.js           # Pricing plans
│   │   ├── Booking.js        # Booking records
│   │   ├── Review.js         # Customer reviews
│   │   └── TimeSlot.js       # Daily slot availability
│   ├── routes/               # Express route handlers
│   │   ├── auth.js           # Register, login, profile
│   │   ├── services.js       # CRUD for services
│   │   ├── plans.js          # CRUD for plans
│   │   ├── bookings.js       # Create, cancel, view bookings
│   │   ├── reviews.js        # Submit & moderate reviews
│   │   ├── slots.js          # Check & manage time slots
│   │   └── admin.js          # Dashboard stats & management
│   ├── middleware/
│   │   └── auth.js           # JWT protect & adminOnly middleware
│   ├── config/
│   │   ├── email.js          # Nodemailer email templates
│   │   └── seed.js           # Database seed script
│   ├── server.js             # Express app entry point
│   ├── .env.example          # Environment variables template
│   └── package.json
│
└── frontend/                 # React SPA
    ├── public/
    │   └── index.html
    └── src/
        ├── context/
        │   └── AuthContext.jsx       # Global auth state
        ├── utils/
        │   └── api.js                # Axios instance with interceptors
        ├── components/
        │   ├── Navbar.jsx / .css     # Sticky navigation bar
        │   └── Footer.jsx / .css     # Site footer
        ├── pages/
        │   ├── Home.jsx              # Landing page (hero, services, plans, reviews)
        │   ├── Services.jsx          # Services list with category filter
        │   ├── Plans.jsx             # Pricing plans + comparison table
        │   ├── Booking.jsx           # 4-step booking wizard
        │   ├── MyBookings.jsx        # Customer booking history
        │   ├── Login.jsx             # Login page
        │   ├── Register.jsx          # Register page
        │   └── admin/
        │       └── Dashboard.jsx     # Admin panel (stats, bookings, reviews)
        ├── App.jsx                   # Router + providers
        ├── index.js                  # React entry point
        └── index.css                 # Global design system
```

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### 2. Clone & Install

```bash
# Install concurrently at root
npm install

# Install all dependencies
npm run install:all
```

### 3. Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your values:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/splashx
JWT_SECRET=your_secret_key_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:3000
```

### 4. Seed the Database

```bash
npm run seed
```

This creates:
- ✅ Admin account: `admin@splashx.in` / `admin@123`
- ✅ Demo customer: `ravi@example.com` / `password123`
- ✅ 6 services, 3 plans, 4 sample reviews

### 5. Run the App

```bash
# Run both frontend and backend together
npm run dev
```

- Frontend → http://localhost:3000
- Backend API → http://localhost:5000/api
- Health check → http://localhost:5000/api/health

---

## 🔌 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login and get JWT |
| GET | `/api/auth/me` | 🔒 | Get current user |
| GET | `/api/services` | — | List all services |
| GET | `/api/plans` | — | List all plans |
| POST | `/api/bookings` | 🔒 | Create booking |
| GET | `/api/bookings/my` | 🔒 | Get my bookings |
| PUT | `/api/bookings/:id/cancel` | 🔒 | Cancel booking |
| GET | `/api/slots/:date` | — | Check available slots |
| GET | `/api/reviews` | — | Get approved reviews |
| POST | `/api/reviews` | 🔒 | Submit a review |
| GET | `/api/admin/dashboard` | 👑 | Admin stats |
| GET | `/api/admin/bookings` | 👑 | All bookings |
| PUT | `/api/admin/bookings/:id` | 👑 | Update booking |
| GET | `/api/admin/customers` | 👑 | All customers |
| GET | `/api/admin/reviews` | 👑 | All reviews |

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Framer Motion |
| State/Data | TanStack React Query, Context API |
| Styling | CSS Modules, custom design system |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Email | Nodemailer |
| Validation | express-validator |

---

## 🚀 Deployment

**Backend (Railway / Render):**
1. Set all `.env` variables in the dashboard
2. Set `MONGO_URI` to your MongoDB Atlas connection string
3. Deploy the `backend/` folder

**Frontend (Vercel / Netlify):**
1. Set `REACT_APP_API_URL` to your deployed backend URL
2. Deploy the `frontend/` folder
3. Set the build command to `npm run build`
