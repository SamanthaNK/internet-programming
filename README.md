# [Smart Finance Tracker](https://finance-tracker-frontend-2wke.onrender.com)

### Overview:
A web-based personal finance management application that helps users track expenses, manage budgets, set financial goals and receive AI-powered financial insights to improve your financial health.

### Features
- **User Authentication** - Secure JWT-based registration, login, and password reset
- **Dashboard** - Real-time overview of income, expenses, balance, savings, and recent transactions
- **Transaction Management** - Full CRUD operations with filtering, sorting, and search
- **Budget Planner** - Set monthly limits per category with visual progress indicators
- **Financial Goals** - Track savings goals and progress visualization
- **Reports & Analytics** - Interactive charts showing spending trends and patterns
- **AI Advisor** - Personalized financial recommendations and spending analysis
- **Data Export** - Download financial data in CSV/PDF formats
- **Settings** - Manage profile, change password, update preferences

### Tech Stack

#### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React-Toastify** - Toast notifications
- **Chart.js / Recharts** - Data visualizations

#### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Bcrypt.js** - Password hashing

#### External Services
- **AI API** - Gemini
- **MongoDB Atlas** - Cloud database hosting
- **Render** - Application hosting and deployment

### Installation
#### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm package manager
- Git

#### 1. Clone Repository
```bash
   git clone https://github.com/SamanthaNK/internet-programming.git
   cd smart-finance-tracker-mern
```
#### 2. Backend Setup
```bash
   # Navigate to server directory
   cd server

   # Install dependencies
   npm install

   # Create .env file
   touch .env

   # Add environment variables (contact team)
   # Start MongoDB
   mongosh

   # Seed default categories
   node scripts/createDefaultCategories.js

   # Start server
   npm run dev
```
Server will run on http://localhost:5000

#### 3. Frontend Setup
```bash
   # Open new terminal
   # Navigate to client directory
   cd client

   # Install dependencies
   npm install

   # Create .env file
   touch .env

   # Add environment variables (contact team)

   # Start development server
   npm start
```
Client will run on http://localhost:3000

### Production URLs
- **Frontend**: https://finance-tracker-frontend-2wke.onrender.com
- **Backend API**: https://finance-tracker-backend-5ctd.onrender.com/api

### Deployment Configuration

**Frontend (Render)**:
- Build Command: `npm install && npm run build`
- Publish Directory: `build`
- Environment Variables: `REACT_APP_API_URL`

**Backend (Render)**:
- Build Command: `npm install`
- Start Command: `node server.js`
- Environment Variables: All variables from server/.env


### Project Structure

```
smart-finance-tracker/
├── server/                          # Backend (Node.js + Express)
│   ├── controllers/                 # Route controllers
│   ├── middleware/                  # Custom middleware
│   ├── models/                      # Mongoose schemas
│   ├── routes/                      # API routes
│   ├── scripts/                     # Utility scripts
│   ├── utils/                       # Helper utilities
│   ├── server.js                    # Express app entry
│   └── package.json                 # Backend dependencies
│
├── client/                          # Frontend (React)
│   ├── public/                      # Static files
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   ├── context/                 # React Context
│   │   ├── pages/                   # Page components
│   │   ├── services/                # API services
│   │   ├── utils/                   # Utilities
│   │   ├── App.js                   # Main app component
│   │   ├── index.js                 # React entry point
│   │   └── index.css                # Global styles (Tailwind)
│   ├── package.json                 # Frontend dependencies
│   └── tailwind.config.js           # Tailwind configuration
│
└── .gitignore                       # Git ignore file
```

### Planned Features
1. Receipt scanning with OCR
2. Recurring transaction automation
3. Financial health score calculation
4. Push notifications
5. Offline mode
6. Mobile native apps (React Native)
7. Social features (split bills, shared accounts)
8. Gamification (achievements, challenges)

### Team
- Samantha Ngong   @SamanthaNK
- Davida Assene   @Davibyte
- Pearly Kusona   @Pearly-Kusona25

### Status:
This project is part of an academic assignment for Internet Programming course. Project currently under development.
