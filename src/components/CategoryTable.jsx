import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

function CategoryTable({ data }) {
  const [sortBy, setSortBy] = useState('total') // total, income, expense, count
  const [sortOrder, setSortOrder] = useState('desc')

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  const tableData = Object.entries(data.byCategory)
    .map(([category, values]) => ({
      category,
      income: values.income,
      expense: values.expense,
      total: values.income + values.expense,
      net: values.income - values.expense,
      count: values.count
    }))
    .sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1
      return (a[sortBy] - b[sortBy]) * multiplier
    })

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return <ChevronDown className="w-4 h-4 opacity-30" />
    return sortOrder === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-800">Category-wise Analysis</h3>
        <p className="text-sm text-gray-600 mt-1">
          Detailed breakdown of all categories
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Category
              </th>
              <th 
                className="px-6 py-4 text-right text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('income')}
              >
                <div className="flex items-center justify-end gap-1">
                  Income
                  <SortIcon column="income" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-right text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('expense')}
              >
                <div className="flex items-center justify-end gap-1">
                  Expense
                  <SortIcon column="expense" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-right text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('net')}
              >
                <div className="flex items-center justify-end gap-1">
                  Net
                  <SortIcon column="net" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-right text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('count')}
              >
                <div className="flex items-center justify-end gap-1">
                  Transactions
                  <SortIcon column="count" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tableData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900">{row.category}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-green-600 font-semibold">
                    {row.income > 0 ? formatCurrency(row.income) : '-'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-red-600 font-semibold">
                    {row.expense > 0 ? formatCurrency(row.expense) : '-'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className={`font-semibold ${row.net >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                    {formatCurrency(row.net)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-gray-600">{row.count}</span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 border-t-2 border-gray-300">
            <tr>
              <td className="px-6 py-4 font-bold text-gray-900">Total</td>
              <td className="px-6 py-4 text-right font-bold text-green-600">
                {formatCurrency(data.summary.totalIncome)}
              </td>
              <td className="px-6 py-4 text-right font-bold text-red-600">
                {formatCurrency(data.summary.totalExpense)}
              </td>
              <td className="px-6 py-4 text-right font-bold text-blue-600">
                {formatCurrency(data.summary.netBalance)}
              </td>
              <td className="px-6 py-4 text-right font-bold text-gray-900">
                {data.summary.totalCount}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default CategoryTable

