import { useState } from 'react'
import { Edit, Trash2, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { format } from 'date-fns'

function TransactionListView({ transactions, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' })
  const [typeFilter, setTypeFilter] = useState('all') // all, income, expense

  // Filter transactions
  const filteredTransactions = transactions?.filter(t => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = (
      t.category_name?.toLowerCase().includes(searchLower) ||
      t.notes?.toLowerCase().includes(searchLower) ||
      t.account?.toLowerCase().includes(searchLower)
    )

    // Type filter
    const matchesType = typeFilter === 'all' || t.type === typeFilter

    // Date range filter
    let matchesDateRange = true
    if (dateFilter.from || dateFilter.to) {
      const transactionDate = format(new Date(t.date), 'yyyy-MM-dd')
      if (dateFilter.from && dateFilter.to) {
        matchesDateRange = transactionDate >= dateFilter.from && transactionDate <= dateFilter.to
      } else if (dateFilter.from) {
        matchesDateRange = transactionDate >= dateFilter.from
      } else if (dateFilter.to) {
        matchesDateRange = transactionDate <= dateFilter.to
      }
    }

    return matchesSearch && matchesType && matchesDateRange
  }) || []

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let comparison = 0
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.date) - new Date(b.date)
        break
      case 'amount':
        comparison = parseFloat(a.amount) - parseFloat(b.amount)
        break
      case 'category':
        comparison = a.category_name.localeCompare(b.category_name)
        break
      default:
        comparison = 0
    }

    return sortOrder === 'asc' ? comparison : -comparison
  })

  // Pagination
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTransactions = sortedTransactions.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return null
    return sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Transactions Yet</h3>
        <p className="text-gray-600">Start by adding your first transaction!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 space-y-3">
        {/* First Row: Search and Results */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-600 whitespace-nowrap">
            Showing {paginatedTransactions.length} of {sortedTransactions.length} transactions
          </p>
        </div>

        {/* Second Row: Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Date Range Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600 font-medium">From:</label>
            <input
              type="date"
              value={dateFilter.from}
              onChange={(e) => {
                setDateFilter({ ...dateFilter, from: e.target.value })
                setCurrentPage(1)
              }}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600 font-medium">To:</label>
            <input
              type="date"
              value={dateFilter.to}
              onChange={(e) => {
                setDateFilter({ ...dateFilter, to: e.target.value })
                setCurrentPage(1)
              }}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
          </select>

          {/* Items per page */}
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
            <option value="500">500 per page</option>
          </select>

          {/* Clear Filters */}
          {(dateFilter.from || dateFilter.to || typeFilter !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                setDateFilter({ from: '', to: '' })
                setTypeFilter('all')
                setSearchTerm('')
                setCurrentPage(1)
              }}
              className="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                onClick={() => handleSort('date')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Date
                  <SortIcon field="date" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th
                onClick={() => handleSort('amount')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Amount
                  <SortIcon field="amount" />
                </div>
              </th>
              <th
                onClick={() => handleSort('category')}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-1">
                  Category
                  <SortIcon field="category" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Account
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <div className="text-gray-900">
                    {format(new Date(transaction.date), 'MMM dd, yyyy')}
                  </div>
                  <div className="text-xs text-gray-500 font-semibold">
                    {format(new Date(transaction.date), 'h:mm a')}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    transaction.type === 'income'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.type === 'income' ? '+ Income' : '- Expense'}
                  </span>
                </td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  ₹{parseFloat(transaction.amount).toFixed(2)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {transaction.category_name}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {transaction.account}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                  {transaction.notes || '-'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TransactionListView

