# Smart Finance Tracker

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
- **AI API** - OpenAI/Claude/Gemini

### Installation
#### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm package manager
- Git

####  Clone Repository
### DB Setup Instructions

1. Make sure MySQL is installed and running
2. Create database and import schema:
```bash
   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS financetrackerdb;" && mysql -u root -p financetrackerdb < FinanceTrackerDB.sql
```
3. Update `config/db_connect.php` with your MySQL password
4. Start server: `php -S localhost:8000`
5. Open: http://localhost:8000

### Status:
Project currently under development.
