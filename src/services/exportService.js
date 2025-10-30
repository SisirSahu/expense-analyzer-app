import Papa from 'papaparse'
import { format } from 'date-fns'

export const exportService = {
  // Export transactions to JSON
  exportToJSON(transactions) {
    try {
      const jsonData = JSON.stringify(transactions, null, 2)
      const blob = new Blob([jsonData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const filename = `expense-backup-${format(new Date(), 'yyyy-MM-dd')}.json`
      
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      return { success: true, filename }
    } catch (error) {
      console.error('Export to JSON error:', error)
      return { success: false, error }
    }
  },

  // Export transactions to CSV
  exportToCSV(transactions) {
    try {
      // Transform data to match original CSV format
      const csvData = transactions.map(t => ({
        TIME: format(new Date(t.date), 'MMM dd, yyyy h:mm a'),
        TYPE: t.type === 'income' ? '(+) Income' : '(-) Expense',
        AMOUNT: t.amount,
        CATEGORY: t.category_name,
        ACCOUNT: t.account || '',
        NOTES: t.notes || ''
      }))

      const csv = Papa.unparse(csvData)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const filename = `expense-backup-${format(new Date(), 'yyyy-MM-dd')}.csv`
      
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      return { success: true, filename }
    } catch (error) {
      console.error('Export to CSV error:', error)
      return { success: false, error }
    }
  },

  // Import transactions from JSON
  importFromJSON(jsonString) {
    try {
      const transactions = JSON.parse(jsonString)
      
      // Validate structure
      if (!Array.isArray(transactions)) {
        throw new Error('Invalid JSON format: expected an array')
      }

      // Transform and validate each transaction
      const validTransactions = transactions.map(t => {
        if (!t.date || !t.type || !t.amount || !t.category_name) {
          throw new Error('Invalid transaction format')
        }
        
        return {
          date: new Date(t.date).toISOString(),
          type: t.type,
          amount: parseFloat(t.amount),
          category_name: t.category_name,
          category_id: t.category_id || null,
          account: t.account || '',
          notes: t.notes || ''
        }
      })

      return { success: true, data: validTransactions }
    } catch (error) {
      console.error('Import from JSON error:', error)
      return { success: false, error }
    }
  },

  // Detect duplicate transactions
  detectDuplicates(existingTransactions, newTransactions) {
    const duplicates = []
    const unique = []

    newTransactions.forEach(newTx => {
      const isDuplicate = existingTransactions.some(existingTx => {
        return (
          new Date(existingTx.date).getTime() === new Date(newTx.date).getTime() &&
          parseFloat(existingTx.amount) === parseFloat(newTx.amount) &&
          existingTx.category_name === newTx.category_name &&
          existingTx.type === newTx.type
        )
      })

      if (isDuplicate) {
        duplicates.push(newTx)
      } else {
        unique.push(newTx)
      }
    })

    return { duplicates, unique }
  }
}

