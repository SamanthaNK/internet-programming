# internet-programming
## Smart Finance Tracker Website

### Overview:
A web-based personal finance management application that helps users track expenses, manage budgets, and receive AI-powered financial insights.

### Features

- **Dashboard** - Overview of income, expenses, and savings
- **Transaction Management** - Add, edit, and categorize transactions
- **Budget Planner** - Set monthly limits with AI suggestions
- **Financial Goals** - Track savings goals and progress
- **Reports & Analytics** - Visual charts and spending trends
- **AI Advisor** - Personalized financial insights and recommendations
- **Data Export** - Download financial data in CSV/PDF formats

### Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** PHP, MySQL
- **Libraries:** Chart.js (visualizations)
- **AI Integration:** OpenAI/Claude/Gemini API

### Project Structure
```
smart-finance-tracker/
├── api/                    # Backend API endpoints
├── assets/                 # CSS, JS, images, libraries
├── auth/                   # Authentication processes
├── config/                 # Database configuration
├── database/               # SQL schema
├── includes/               # Reusable PHP components
├── pages/                  # Main application pages
├── uploads/                # User uploaded files
└── index.php               # Landing page
```

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
