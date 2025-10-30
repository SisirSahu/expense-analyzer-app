# 💰 Expense Tracker

A full-featured multi-user expense tracking application with cloud storage, manual transaction management, and powerful analytics.

## ✨ Features

### 🔐 Multi-User Authentication
- Secure user registration and login
- Password reset via email
- Session persistence (stay logged in)
- Support for up to 10 users
- Data isolation between users

### 📝 Transaction Management
- **Manual Entry**: Add, edit, and delete transactions
- **Bulk Import**: Import from CSV or JSON files
- **Export**: Download your data as CSV or JSON backup
- **Smart Search**: Find transactions by category, notes, or account
- **Advanced Filters**: Filter by date range, type, or category
- **Sortable Lists**: Sort by date, amount, or category

### 🏷️ Category Management
- **Default Categories**: Pre-loaded income and expense categories
- **Custom Categories**: Create your own categories
- **Hybrid System**: Use defaults or add your own
- **Edit/Delete**: Manage custom categories easily

### 📊 Analytics Dashboard
- **Summary Cards**: Total income, expenses, and net balance
- **Monthly Trends**: Line and bar charts showing trends over time
- **Category Breakdown**: Pie charts for income and expense categories
- **Filterable Views**: Analyze specific time periods or categories
- **Real-time Updates**: Charts update as you add transactions

### 📱 Modern UI/UX
- Beautiful gradient design
- Fully responsive (mobile, tablet, desktop)
- Toast notifications for actions
- Loading states and animations
- Intuitive navigation

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- A Supabase account (free tier works perfectly)

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/SisirSahu/expense-analyzer-app.git
cd expense-analyzer-app

# Install dependencies
npm install
```

### 2. Set Up Supabase

Follow the detailed guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to:
1. Create a Supabase project
2. Set up database tables
3. Configure authentication
4. Get your API credentials

### 3. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your Supabase credentials
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run the Application

```bash
# Development mode
npm run dev

# Open in browser
# Visit http://localhost:3000
```

### 5. Build for Production

```bash
# Build the app
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 📖 Usage Guide

### First Time Setup

1. **Create Account**: Click "Sign up" and register with your email
2. **Verify Email**: Check your inbox for verification (if enabled)
3. **Login**: Sign in with your credentials

### Adding Transactions

1. Go to **Transactions** tab (default view)
2. Click **"Add New"** button
3. Fill in the form:
   - Select transaction type (Income/Expense)
   - Choose date
   - Enter amount
   - Select category
   - Choose account type
   - Add notes (optional)
4. Click **"Save"**

### Managing Categories

1. In Transactions view, click **"Categories"** button
2. **Add Custom Category**:
   - Enter category name
   - Select type (Income/Expense)
   - Click "Add"
3. **Edit/Delete**: Use the action buttons next to custom categories
4. **Default Categories**: Read-only, available for all users

### Importing Data

1. Go to **Import CSV** tab
2. Click to upload or drag-and-drop a CSV/JSON file
3. Review the preview (first 5 transactions shown)
4. Choose whether to skip duplicates
5. Click **"Import"**

**Supported CSV Format:**
```csv
TIME, TYPE, AMOUNT, CATEGORY, ACCOUNT, NOTES
"May 05, 2024 4:28 PM", "(-) Expense", 45.50, "Food", "Cash", "Lunch"
"May 06, 2024 9:00 AM", "(+) Income", 1500, "Salary", "Bank", "Monthly"
```

### Exporting Data

1. In Transactions view, click **"Export"** button
2. Choose format:
   - **JSON**: For backup and re-import
   - **CSV**: For Excel or other apps
3. File downloads automatically with timestamp

### Viewing Analytics

1. Go to **Analytics** tab
2. Use filters to focus on specific:
   - Date ranges
   - Years/Months
   - Categories
3. Switch between views:
   - **Overview**: Trends and category charts
   - **Categories**: Detailed category breakdown
   - **Transactions**: Full transaction list

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Data Visualization
- **Recharts** - Charts and graphs
- **date-fns** - Date formatting

### Backend & Database
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Row Level Security (RLS)
  - Real-time subscriptions

### Data Processing
- **PapaParse** - CSV parsing
- **react-hot-toast** - Notifications

## 🔒 Security & Privacy

✅ **Your data is secure:**
- Row Level Security (RLS) ensures users only see their own data
- Passwords are hashed and never stored in plain text
- Authentication tokens are automatically managed
- Session persistence uses secure local storage

✅ **Privacy:**
- Data stored in your own Supabase account
- Can be self-hosted if needed
- Export your data anytime
- Delete your account and all data

## 🌐 Live Demo

Access the app at: **[https://sisirsahu.github.io/expense-analyzer-app/](https://sisirsahu.github.io/expense-analyzer-app/)**

*(Note: You'll need to set up your own Supabase project for it to work)*

## 📦 Project Structure

```
expense-analyzer-app/
├── src/
│   ├── components/
│   │   ├── Auth/              # Login, Signup, ForgotPassword
│   │   ├── TransactionManager/ # Transaction CRUD
│   │   ├── CSVImport/          # Import functionality
│   │   ├── Header.jsx          # Navigation
│   │   └── ...                 # Other components
│   ├── services/              # API services
│   │   ├── authService.js
│   │   ├── transactionService.js
│   │   ├── categoryService.js
│   │   └── exportService.js
│   ├── context/
│   │   └── AuthContext.jsx    # Auth state management
│   ├── utils/
│   │   ├── supabase.js        # Supabase client
│   │   └── ...
│   ├── App.jsx                # Main app component
│   └── main.jsx               # Entry point
├── .env.example               # Environment template
├── SUPABASE_SETUP.md         # Setup guide
└── README.md                  # This file
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

If you encounter any issues:
1. Check [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for setup help
2. Look at browser console for errors
3. Check Supabase logs in your dashboard
4. Open an issue on GitHub

## 🎯 Roadmap

Future enhancements:
- [ ] Recurring transactions
- [ ] Budget tracking and alerts
- [ ] Multiple currency support
- [ ] Receipt photo upload
- [ ] Shared categories between users
- [ ] Monthly email reports
- [ ] Mobile app (React Native)
- [ ] Dark mode

## 👤 Author

**Sisir Sahu**
- GitHub: [@SisirSahu](https://github.com/SisirSahu)

---

Made with ❤️ using React and Supabase
