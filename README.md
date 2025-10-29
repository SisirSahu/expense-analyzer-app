# 💰 Expense Analyzer

A React web application to analyze expense CSV data with interactive charts and filters.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the app
npm run dev
```

Open `http://localhost:3000` and upload your CSV file.

## 📁 CSV Format

Your CSV should have these columns:

```
TIME, TYPE, AMOUNT, CATEGORY, ACCOUNT, NOTES
```

- **TIME**: "May 05, 2024 4:28 PM"
- **TYPE**: "(+) Income" or "(-) Expense"
- **AMOUNT**: Transaction amount
- **CATEGORY**: Category name
- **ACCOUNT**: Cash, Card, etc.
- **NOTES**: Optional notes

## ✨ Features

- 📊 Summary cards (Income, Expense, Net Balance)
- 📈 Monthly trend charts (Line/Bar)
- 🥧 Category pie charts
- 🔍 **Date Range Filter** - Select custom date range (From/To dates)
- 📅 Year & Month filters (alternative to date range)
- 🏷️ Category filter
- 📋 Sortable category table
- 📝 Searchable transaction list
- 📱 Responsive design

### Filter Options

**Date Range Filter (Priority):**
- Select "From Date" and/or "To Date" to filter transactions
- Overrides Year/Month filters when set
- Perfect for custom time periods

**Year/Month Filters (Alternative):**
- Use when you don't need a custom range
- Quick selection for standard periods

## 🛠️ Tech Stack

React • Vite • Tailwind CSS • Recharts • PapaParse • date-fns

## 🔒 Privacy

100% client-side processing. Your data never leaves your browser.
