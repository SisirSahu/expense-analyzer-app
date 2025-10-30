import { useState, useEffect } from 'react'
import { Plus, Download, Settings, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import QuickStats from './QuickStats'
import TransactionForm from './TransactionForm'
import TransactionListView from './TransactionListView'
import CategoryManager from './CategoryManager'
import { transactionService } from '../../services/transactionService'
import { categoryService } from '../../services/categoryService'
import { exportService } from '../../services/exportService'

function TransactionManager() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [showExportMenu, setShowExportMenu] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    
    // Load transactions
    const { data: txData, error: txError } = await transactionService.getTransactions()
    if (txError) {
      toast.error('Failed to load transactions')
      console.error(txError)
    } else {
      setTransactions(txData || [])
    }

    // Load categories
    const { data: catData, error: catError } = await categoryService.getCategories()
    if (catError) {
      toast.error('Failed to load categories')
      console.error(catError)
    } else {
      setCategories(catData || [])
    }

    // Load stats
    const { data: statsData, error: statsError } = await transactionService.getStats()
    if (statsError) {
      console.error(statsError)
    } else {
      setStats(statsData)
    }

    setLoading(false)
  }

  const handleSaveTransaction = async (transactionData) => {
    if (editingTransaction) {
      // Update existing transaction
      const { error } = await transactionService.updateTransaction(
        editingTransaction.id,
        transactionData
      )

      if (error) {
        toast.error('Failed to update transaction')
        return
      }

      toast.success('Transaction updated successfully!')
    } else {
      // Create new transaction
      const { error } = await transactionService.createTransaction(transactionData)

      if (error) {
        toast.error('Failed to create transaction')
        return
      }

      toast.success('Transaction added successfully!')
    }

    setShowForm(false)
    setEditingTransaction(null)
    loadData()
  }

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction)
    setShowForm(true)
  }

  const handleDeleteTransaction = async (id) => {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return
    }

    const { error } = await transactionService.deleteTransaction(id)

    if (error) {
      toast.error('Failed to delete transaction')
      return
    }

    toast.success('Transaction deleted successfully!')
    loadData()
  }

  const handleAddNew = () => {
    setEditingTransaction(null)
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingTransaction(null)
  }

  const handleExportJSON = () => {
    const result = exportService.exportToJSON(transactions)
    if (result.success) {
      toast.success(`Exported to ${result.filename}`)
    } else {
      toast.error('Failed to export')
    }
    setShowExportMenu(false)
  }

  const handleExportCSV = () => {
    const result = exportService.exportToCSV(transactions)
    if (result.success) {
      toast.success(`Exported to ${result.filename}`)
    } else {
      toast.error('Failed to export')
    }
    setShowExportMenu(false)
  }

  const handleCategoriesUpdated = () => {
    loadData()
  }

  const handleBulkDelete = async () => {
    if (!transactions || transactions.length === 0) {
      toast.error('No transactions to delete')
      return
    }

    const confirmMessage = `Are you sure you want to delete ALL ${transactions.length} transaction(s)? This action cannot be undone!`
    
    if (!confirm(confirmMessage)) {
      return
    }

    // Double confirmation for safety
    const doubleConfirm = confirm('This will permanently delete all your transactions. Are you absolutely sure?')
    if (!doubleConfirm) {
      return
    }

    setLoading(true)
    let deletedCount = 0
    let failedCount = 0

    // Delete all transactions
    for (const transaction of transactions) {
      const { error } = await transactionService.deleteTransaction(transaction.id)
      if (error) {
        failedCount++
      } else {
        deletedCount++
      }
    }

    if (deletedCount > 0) {
      toast.success(`Deleted ${deletedCount} transaction(s)`)
    }
    if (failedCount > 0) {
      toast.error(`Failed to delete ${failedCount} transaction(s)`)
    }

    loadData()
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Quick Stats */}
      <QuickStats stats={stats} />

      {/* Action Bar */}
      <div className="bg-white rounded-xl shadow-lg p-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-900">My Transactions</h2>
        
        <div className="flex items-center gap-2">
          {/* Bulk Delete Button */}
          {transactions && transactions.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
              title="Delete all transactions"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete All</span>
            </button>
          )}

          {/* Categories Button */}
          <button
            onClick={() => setShowCategoryManager(true)}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Categories</span>
          </button>

          {/* Export Button */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {showExportMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                  <button
                    onClick={handleExportJSON}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                  >
                    Export as JSON
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                  >
                    Export as CSV
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Add New</span>
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <TransactionListView
        transactions={transactions}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
      />

      {/* Transaction Form Modal */}
      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          categories={categories}
          onSave={handleSaveTransaction}
          onCancel={handleCancelForm}
        />
      )}

      {/* Category Manager Modal */}
      {showCategoryManager && (
        <CategoryManager
          categories={categories}
          onClose={() => setShowCategoryManager(false)}
          onUpdate={handleCategoriesUpdated}
        />
      )}
    </div>
  )
}

export default TransactionManager

