import { useState } from 'react'
import { format } from 'date-fns'
import { Search, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'

function TransactionList({ transactions }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 50

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount)
  }

  // Filter transactions based on search
  const filteredTransactions = transactions.filter(t => {
    const searchLower = searchTerm.toLowerCase()
    return (
      t.category.toLowerCase().includes(searchLower) ||
      t.notes.toLowerCase().includes(searchLower) ||
      t.amount.toString().includes(searchLower) ||
      format(t.date, 'dd MMM yyyy').toLowerCase().includes(searchLower)
    )
  })

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex)

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">All Transactions</h3>
            <p className="text-sm text-gray-600 mt-1">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by category, notes, amount, or date..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1) // Reset to first page on search
            }}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Account</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentTransactions.map((transaction, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {format(transaction.date, 'dd MMM yyyy')}
                  </span>
                  <br />
                  <span className="text-xs text-gray-500">
                    {format(transaction.date, 'h:mm a')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transaction.type === 'income' ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <ArrowUpCircle className="w-5 h-5" />
                      <span className="font-medium">Income</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600">
                      <ArrowDownCircle className="w-5 h-5" />
                      <span className="font-medium">Expense</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {transaction.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">{transaction.account}</span>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <span className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </span>
                </td>
                <td className="px-6 py-4 max-w-xs">
                  <span className="text-sm text-gray-600 truncate block">
                    {transaction.notes || '-'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Previous
          </button>
          
          <div className="flex gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default TransactionList

