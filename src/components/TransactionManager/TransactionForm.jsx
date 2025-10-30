import { useState, useEffect } from 'react'
import { X, Save, DollarSign, Calendar, Tag, CreditCard, FileText } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

function TransactionForm({ transaction, categories, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    type: 'expense',
    amount: '',
    category_name: '',
    account: 'Cash',
    notes: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: format(new Date(transaction.date), 'yyyy-MM-dd'),
        type: transaction.type,
        amount: transaction.amount,
        category_name: transaction.category_name,
        account: transaction.account || 'Cash',
        notes: transaction.notes || ''
      })
    }
  }, [transaction])

  const filteredCategories = categories?.filter(c => c.type === formData.type) || []

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (!formData.category_name) {
      toast.error('Please select a category')
      return
    }

    setIsLoading(true)
    
    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString()
    }

    await onSave(transactionData)
    setIsLoading(false)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Reset category when type changes
    if (field === 'type') {
      setFormData(prev => ({ ...prev, category_name: '' }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {transaction ? 'Edit Transaction' : 'Add Transaction'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleChange('type', 'income')}
                className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                  formData.type === 'income'
                    ? 'bg-green-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                💰 Income
              </button>
              <button
                type="button"
                onClick={() => handleChange('type', 'expense')}
                className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                  formData.type === 'expense'
                    ? 'bg-red-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                💸 Expense
              </button>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              Category
            </label>
            <select
              value={formData.category_name}
              onChange={(e) => handleChange('category_name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select category</option>
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Account */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CreditCard className="w-4 h-4 inline mr-1" />
              Account
            </label>
            <select
              value={formData.account}
              onChange={(e) => handleChange('account', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Bank Account">Bank Account</option>
              <option value="Digital Wallet">Digital Wallet</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
              placeholder="Add any additional details..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TransactionForm

