# FitLife Pro
> **"Optimize Your Habits. Transform Your Life."**

FitLife Pro is a production-oriented, full-stack lifestyle optimization and wellness platform powered by AI. It helps users track daily nutrition, calories, hydration, workouts, sleep, habits, goals, and personal progress with scientific precision and clinical guardrails.

---

## 🌟 Key Highlights & Architecture

- **True Full-Stack Persistence**: Built on React 18 (Vite) and Node.js/Express with MongoDB (Mongoose). No temporary local storage illusions.
- **Animated SVG Design System**: Zero emojis. Uses a customized Framer Motion animated SVG dumbbell logo with rotating halo, subtle glow, and crisp typography.
- **Mifflin-St Jeor Energy Calculations**: Scientifically validated BMR and TDEE adult calculations with clinical safety floors (1,200 kcal/day for females, 1,500 kcal/day for males).
- **Two-Tier AI Coach (Gemini 2.5 Flash)**: Contextual lifestyle assistant with privacy protection. When the AI API key is unconfigured or unavailable, it transparently indicates its fallback state and delivers deterministic scientific guidance.
- **Data Portability**: Full JSON archive export and CSV analytics export.
- **Production Security**: Strict backend-enforced JWT authentication, password hashing with bcrypt, ownership validation, rate limiting, and role-based access control for administrative areas.

---

## 🏗️ Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom deep-navy/violet design tokens, glassmorphism, and full Light/Dark mode
- **Routing**: React Router v6 with `ProtectedRoute`, `PublicRoute`, `OnboardedRoute`, and `AdminRoute`
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data Visualization**: Recharts (responsive line charts, bar charts, and circular progress rings)
- **HTTP Client**: Axios with interceptors for JWT token injection and unauthorized redirects
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with 30-day persistence & bcryptjs password hashing
- **Security**: Helmet, CORS origin whitelisting, Express Rate Limit, centralized error handling
- **Testing**: Node.js Native Test Runner (`node:test` & `node:assert/strict`)

---

## 📁 Project Structure

```
lifesync-ai/
├── backend/
│   ├── config/             # Database connection (MongoDB Atlas)
│   ├── controllers/        # Express route controllers (auth, user, nutrition, workout, habit, etc.)
│   ├── middleware/         # Auth, Admin role verification, error handlers
│   ├── models/             # Mongoose schemas (User, MealLog, Food, WaterLog, SleepLog, Habit, WorkoutSession, etc.)
│   ├── routes/             # RESTful API endpoints
│   ├── seeds/              # Database seed scripts (Indian staples, exercises, challenges)
│   ├── services/           # External AI service (Gemini 2.5 Flash + fallback)
│   ├── tests/              # Automated unit tests (Mifflin-St Jeor, midnight sleep, streaks, macros)
│   ├── utils/              # Energy & hydration calculation formulas
│   ├── .env.example        # Backend environment template
│   └── server.js           # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/     # Layouts, TopNavbar, Sidebar, NotificationCenter, AnimatedLogo, UI components
│   │   ├── context/        # AuthContext, ThemeContext
│   │   ├── pages/
│   │   │   ├── admin/      # Admin dashboard (users, exercises, foods, challenges)
│   │   │   ├── ai/         # AI Lifestyle Coach chat interface
│   │   │   ├── auth/       # Login, Register, Forgot Password
│   │   │   ├── dashboard/  # Personalized user dashboard
│   │   │   ├── goals/      # Goals & Challenges
│   │   │   ├── habits/     # Habit tracker with streaks and templates
│   │   │   ├── health/     # Water Tracker & Sleep/Recovery Tracker
│   │   │   ├── nutrition/  # Food database search, macro calculations, meal logger
│   │   │   ├── onboarding/ # 6-step adult onboarding wizard
│   │   │   ├── profile/    # User profile & Account Settings
│   │   │   ├── progress/   # Analytics with Recharts and CSV export
│   │   │   ├── workout/    # Workout plans, exercise library & active session timer
│   │   │   └── Landing.jsx # 11-section public landing page with interactive BMI tool
│   │   ├── services/       # Axios API client services
│   │   ├── App.jsx         # App routing
│   │   └── main.jsx        # App entry point
│   ├── tailwind.config.js  # Theme colors, gradients, and custom animations
│   └── vite.config.js      # Vite build configuration
├── .env.example            # Root environment reference
├── .gitignore              # Repository exclusions
├── package.json            # Root convenience scripts
└── README.md               # Complete documentation
```

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- **Node.js** >= 18.0.0
- **MongoDB** (Local instance or MongoDB Atlas connection string)

### 2. Environment Configuration
Create `backend/.env` (using `.env.example` as a template):

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB Atlas or Local MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/fitlife_pro?retryWrites=true&w=majority

# JWT Authentication Secret
JWT_SECRET=super_secure_fitlife_pro_jwt_secret_2026

# Optional: Google Gemini API Key for AI Lifestyle Assistant
# If omitted, FitLife Pro automatically activates its deterministic rules engine
GEMINI_API_KEY=
```

### 3. Install Dependencies
```bash
# In project root
npm run install:all

# Or separately:
cd backend && npm install
cd ../frontend && npm install
```

### 4. Seed the Database
Populates the database with verified foods (including Indian staples: roti, moong dal, paneer, brown rice, etc.), exercise library items, and challenges:
```bash
npm run seed
# Or:
cd backend && node seeds/seedAll.js
```

### 5. Run the Application
In separate terminals:

```bash
# Start Backend (port 5000)
cd backend
npm run dev

# Start Frontend (port 5173)
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🧪 Automated Testing

FitLife Pro includes automated unit tests covering nutrition equations, serving multiplier logic, midnight crossover sleep calculations, and habit streak integrity:

```bash
# In backend directory
npm test
```

### Test Coverage Summary:
- ✔ Mifflin-St Jeor BMR calculation for Adult Male
- ✔ Mifflin-St Jeor BMR calculation for Adult Female
- ✔ TDEE calculation with activity multipliers
- ✔ Calorie target deficit with clinical safety floors (1,200/1,500 kcal)
- ✔ Macronutrient breakdown adherence (protein, carbs, fat)
- ✔ Body-weight and activity-scaled daily water targets
- ✔ Serving-size nutrition scaling
- ✔ Sleep duration calculation crossing midnight
- ✔ Habit streak consecutive calendar counting

---

## 🛡️ Medical Disclaimer & Clinical Guardrails

FitLife Pro is designed strictly for educational and lifestyle optimization purposes:
1. **Calorie Floors**: The system prohibits automated calorie recommendations from dropping below clinically established floors (1,200 kcal/day for adult females, 1,500 kcal/day for adult males).
2. **Non-Medical AI Assistant**: The AI Coach operates under strict system prompts forbidding disease diagnosis, prescription recommendations, or presentation of unverified estimates as medical facts.
3. **Fluid Restriction Awareness**: The hydration module advises users with medically prescribed fluid restrictions to consult their physician.
4. **Transparent Estimates**: All BMR, TDEE, and calorie numbers are explicitly disclosed as estimates rather than definitive medical targets.

---

## 🔒 Security & Data Protection

- **Password Hashing**: Salted bcrypt hashing with 10 rounds. Passwords are never returned in responses.
- **Authorization**: All user queries explicitly filter by `req.user.id` to prevent cross-tenant data leakage.
- **Admin Access**: Frontend route guards are backed by server-side `adminOnly` middleware verifying role tokens against the database.
- **Data Portability**: Users can export their complete personal history as a single-click JSON archive or CSV table from Account Settings.
- **Account Deletion**: Complete erasure of user account and associated logs with confirmation dialog.

---

## 📄 License

FitLife Pro is released under the [MIT License](LICENSE).
