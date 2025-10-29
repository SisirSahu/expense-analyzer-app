import { Filter, X, Calendar } from 'lucide-react'
import { format, parse } from 'date-fns'

function FilterBar({
  years,
  months,
  categories,
  selectedYear,
  selectedMonth,
  selectedCategory,
  dateRange,
  onYearChange,
  onMonthChange,
  onCategoryChange,
  onDateRangeChange,
  onReset
}) {
  const hasFilters = selectedYear !== 'all' || selectedMonth !== 'all' || selectedCategory !== 'all' || dateRange.from || dateRange.to

  const formatMonth = (monthStr) => {
    if (monthStr === 'all') return 'All Months'
    try {
      const date = parse(monthStr, 'yyyy-MM', new Date())
      return format(date, 'MMMM yyyy')
    } catch {
      return monthStr
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover-lift">
      <div className="flex items-center gap-3 mb-4">
        <Filter className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-800 text-lg">Filters</h3>
        {hasFilters && (
          <button
            onClick={onReset}
            className="ml-auto flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium transition-all duration-300 hover:scale-110 hover:gap-3"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-5 gap-4">
        {/* Date Range Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Calendar className="w-4 h-4 text-blue-600" />
            From Date
          </label>
          <input
            type="date"
            value={dateRange.from || ''}
            onChange={(e) => onDateRangeChange({ ...dateRange, from: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Calendar className="w-4 h-4 text-blue-600" />
            To Date
          </label>
          <input
            type="date"
            value={dateRange.to || ''}
            onChange={(e) => onDateRangeChange({ ...dateRange, to: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        {/* Year Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year
          </label>
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option value="all">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Month Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Month
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option value="all">All Months</option>
            {months.map(month => (
              <option key={month} value={month}>{formatMonth(month)}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default FilterBar
