import { useState, useMemo } from 'react'
import { ArrowLeft, TrendingUp, TrendingDown, Wallet, Filter } from 'lucide-react'
import { format } from 'date-fns'
import SummaryCards from './SummaryCards'
import FilterBar from './FilterBar'
import CategoryChart from './CategoryChart'
import TrendChart from './TrendChart'
import CategoryTable from './CategoryTable'
import TransactionList from './TransactionList'
import { filterByYear, filterByMonth, filterByCategory, filterByDateRange } from '../utils/dataParser'

function Dashboard({ data, onReset }) {
  const [selectedYear, setSelectedYear] = useState('all')
  const [selectedMonth, setSelectedMonth] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [view, setView] = useState('overview') // overview, categories, transactions

  const filteredData = useMemo(() => {
    let result = data
    
    // Date range filter takes priority
    if (dateRange.from || dateRange.to) {
      result = filterByDateRange(result, dateRange.from, dateRange.to)
    } else {
      // Only apply year/month filters if no date range is set
      if (selectedYear !== 'all') {
        result = filterByYear(result, selectedYear)
      }
      if (selectedMonth !== 'all') {
        result = filterByMonth(result, selectedMonth)
      }
    }
    
    if (selectedCategory !== 'all') {
      result = filterByCategory(result, selectedCategory)
    }
    return result
  }, [data, selectedYear, selectedMonth, selectedCategory, dateRange])

  const handleResetFilters = () => {
    setSelectedYear('all')
    setSelectedMonth('all')
    setSelectedCategory('all')
    setDateRange({ from: '', to: '' })
  }

  return (
    <div className="space-y-6">
      {/* Header with Reset Button */}
      <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between hover-lift relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="flex items-center gap-4 relative z-10">
          <button
            onClick={onReset}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-105 hover:-translate-x-1"
          >
            <ArrowLeft className="w-5 h-5" />
            Upload New File
          </button>
          <div className="h-6 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
          <div>
            <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600">
              Financial Dashboard
            </h2>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              {filteredData.transactions.length} transactions
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        years={data.years}
        months={data.months}
        categories={data.categories}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        selectedCategory={selectedCategory}
        dateRange={dateRange}
        onYearChange={setSelectedYear}
        onMonthChange={setSelectedMonth}
        onCategoryChange={setSelectedCategory}
        onDateRangeChange={setDateRange}
        onReset={handleResetFilters}
      />

      {/* View Tabs */}
      <div className="bg-white rounded-xl shadow-lg p-2 flex gap-2 hover-lift">
        <button
          onClick={() => setView('overview')}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform ${
            view === 'overview'
              ? 'bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white shadow-lg scale-105'
              : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:scale-102'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setView('categories')}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform ${
            view === 'categories'
              ? 'bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white shadow-lg scale-105'
              : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:scale-102'
          }`}
        >
          Categories
        </button>
        <button
          onClick={() => setView('transactions')}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform ${
            view === 'transactions'
              ? 'bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white shadow-lg scale-105'
              : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:scale-102'
          }`}
        >
          Transactions
        </button>
      </div>

      {/* Summary Cards */}
      <SummaryCards summary={filteredData.summary} />

      {/* Main Content Based on View */}
      {view === 'overview' && (
        <div className="grid gap-6">
          <TrendChart data={filteredData} />
          <div className="grid md:grid-cols-2 gap-6">
            <CategoryChart
              data={filteredData}
              type="income"
              title="Income by Category"
            />
            <CategoryChart
              data={filteredData}
              type="expense"
              title="Expense by Category"
            />
          </div>
        </div>
      )}

      {view === 'categories' && (
        <CategoryTable data={filteredData} />
      )}

      {view === 'transactions' && (
        <TransactionList transactions={filteredData.transactions} />
      )}
    </div>
  )
}

export default Dashboard

