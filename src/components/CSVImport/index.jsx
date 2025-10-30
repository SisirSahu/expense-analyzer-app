import { useState } from 'react'
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react'
import Papa from 'papaparse'
import { parse as parseDate, isValid } from 'date-fns'
import toast from 'react-hot-toast'
import { transactionService } from '../../services/transactionService'
import { categoryService } from '../../services/categoryService'
import { exportService } from '../../services/exportService'

function CSVImport() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const [skipDuplicates, setSkipDuplicates] = useState(true)

  const parseCSVDate = (dateStr) => {
    // Try parsing common date formats
    const formats = [
      'MMM dd, yyyy h:mm a',
      'MMM dd, yyyy',
      'yyyy-MM-dd',
      'MM/dd/yyyy',
      'dd/MM/yyyy'
    ]

    for (const format of formats) {
      const parsed = parseDate(dateStr, format, new Date())
      if (isValid(parsed)) {
        return parsed
      }
    }

    // Fallback to Date constructor
    const date = new Date(dateStr)
    return isValid(date) ? date : new Date()
  }

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    if (!selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.json')) {
      toast.error('Please select a CSV or JSON file')
      return
    }

    setFile(selectedFile)
    setImportResult(null)

    // Parse file for preview
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target.result

      if (selectedFile.name.endsWith('.json')) {
        // Parse JSON
        const result = exportService.importFromJSON(content)
        if (result.success) {
          setPreview({
            transactions: result.data.slice(0, 5),
            total: result.data.length,
            type: 'json'
          })
        } else {
          toast.error('Invalid JSON format')
          setFile(null)
        }
      } else {
        // Parse CSV
        Papa.parse(content, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.data.length === 0) {
              toast.error('CSV file is empty')
              setFile(null)
              return
            }

            // Transform CSV data
            const transactions = results.data.map(row => {
              const type = row.TYPE?.includes('+') || row.TYPE?.toLowerCase().includes('income') ? 'income' : 'expense'
              
              return {
                date: parseCSVDate(row.TIME || row.Date || row.date),
                type,
                amount: parseFloat(row.AMOUNT || row.Amount || row.amount || 0),
                category_name: row.CATEGORY || row.Category || row.category || 'Other',
                account: row.ACCOUNT || row.Account || row.account || 'Cash',
                notes: row.NOTES || row.Notes || row.notes || ''
              }
            })

            setPreview({
              transactions: transactions.slice(0, 5),
              total: transactions.length,
              type: 'csv'
            })
          },
          error: (error) => {
            toast.error('Failed to parse CSV')
            console.error(error)
            setFile(null)
          }
        })
      }
    }

    reader.readAsText(selectedFile)
  }

  const handleImport = async () => {
    if (!file || !preview) return

    setImporting(true)

    const reader = new FileReader()
    reader.onload = async (event) => {
      const content = event.target.result
      let transactionsToImport = []

      if (file.name.endsWith('.json')) {
        const result = exportService.importFromJSON(content)
        if (result.success) {
          transactionsToImport = result.data
        } else {
          toast.error('Failed to parse JSON')
          setImporting(false)
          return
        }
      } else {
        // Parse CSV
        Papa.parse(content, {
          header: true,
          skipEmptyLines: true,
          complete: async (results) => {
            transactionsToImport = results.data.map(row => {
              const type = row.TYPE?.includes('+') || row.TYPE?.toLowerCase().includes('income') ? 'income' : 'expense'
              
              return {
                date: parseCSVDate(row.TIME || row.Date || row.date).toISOString(),
                type,
                amount: parseFloat(row.AMOUNT || row.Amount || row.amount || 0),
                category_name: row.CATEGORY || row.Category || row.category || 'Other',
                account: row.ACCOUNT || row.Account || row.account || 'Cash',
                notes: row.NOTES || row.Notes || row.notes || ''
              }
            })
          }
        })
      }

      // Check for duplicates if needed
      if (skipDuplicates) {
        const { data: existing } = await transactionService.getTransactions()
        if (existing) {
          const { unique, duplicates } = exportService.detectDuplicates(existing, transactionsToImport)
          transactionsToImport = unique
          
          if (duplicates.length > 0) {
            toast.success(`Skipped ${duplicates.length} duplicate(s)`)
          }
        }
      }

      // Auto-create missing categories from transactions
      await autoCreateCategories(transactionsToImport)

      // Import transactions
      const { error, count } = await transactionService.bulkCreateTransactions(transactionsToImport)

      if (error) {
        toast.error('Failed to import transactions')
        console.error(error)
        setImportResult({ success: false, error: error.message })
      } else {
        toast.success(`Successfully imported ${count} transaction(s)!`)
        setImportResult({ success: true, count })
        setFile(null)
        setPreview(null)
      }

      setImporting(false)
    }

    reader.readAsText(file)
  }

  const handleCancel = () => {
    setFile(null)
    setPreview(null)
    setImportResult(null)
  }

  // Auto-create categories that don't exist
  const autoCreateCategories = async (transactions) => {
    try {
      // Get existing categories
      const { data: existingCategories } = await categoryService.getCategories()
      const existingCategoryNames = new Set(
        existingCategories?.map(c => c.name.toLowerCase()) || []
      )

      // Find unique categories from transactions
      const newCategories = new Map()
      transactions.forEach(t => {
        const categoryName = t.category_name.trim()
        const categoryKey = categoryName.toLowerCase()
        
        if (!existingCategoryNames.has(categoryKey) && !newCategories.has(categoryKey)) {
          newCategories.set(categoryKey, {
            name: categoryName,
            type: t.type
          })
        }
      })

      // Create new categories
      if (newCategories.size > 0) {
        let createdCount = 0
        for (const category of newCategories.values()) {
          const { error } = await categoryService.createCategory(category)
          if (!error) {
            createdCount++
          }
        }
        
        if (createdCount > 0) {
          toast.success(`Created ${createdCount} new categor${createdCount === 1 ? 'y' : 'ies'}`)
        }
      }
    } catch (error) {
      console.error('Error auto-creating categories:', error)
      // Don't fail the import if category creation fails
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Transactions</h2>
        <p className="text-gray-600">
          Upload a CSV or JSON file to import your transactions in bulk
        </p>
      </div>

      {/* Upload Area */}
      {!file && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 hover:bg-blue-50 transition-all">
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-semibold text-gray-700 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-500">
                CSV or JSON files accepted
              </p>
              <input
                type="file"
                accept=".csv,.json"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </label>

          {/* File Format Help */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Expected CSV Format
            </h3>
            <pre className="text-xs text-blue-800 bg-white p-3 rounded overflow-x-auto">
{`TIME, TYPE, AMOUNT, CATEGORY, ACCOUNT, NOTES
"May 05, 2024 4:28 PM", "(-) Expense", 45.50, "Food", "Cash", "Lunch"
"May 06, 2024 9:00 AM", "(+) Income", 1500, "Salary", "Bank", "Monthly salary"`}
            </pre>
          </div>
        </div>
      )}

      {/* Preview */}
      {preview && !importResult && (
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Preview</h3>
              <p className="text-sm text-gray-600">
                Found {preview.total} transaction(s) - Showing first 5
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Preview Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Account</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {preview.transactions.map((tx, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2">
                      {tx.date instanceof Date ? tx.date.toLocaleDateString() : new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        tx.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-semibold">${tx.amount}</td>
                    <td className="px-4 py-2">{tx.category_name}</td>
                    <td className="px-4 py-2">{tx.account}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Options */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="skipDuplicates"
              checked={skipDuplicates}
              onChange={(e) => setSkipDuplicates(e.target.checked)}
              className="w-4 h-4 text-blue-600"
            />
            <label htmlFor="skipDuplicates" className="text-sm text-gray-700">
              Skip duplicate transactions (based on date, amount, category, and type)
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={importing}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {importing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Import {preview.total} Transaction(s)
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Result */}
      {importResult && (
        <div className={`bg-white rounded-xl shadow-lg p-6 ${
          importResult.success ? 'border-2 border-green-500' : 'border-2 border-red-500'
        }`}>
          <div className="flex items-start gap-4">
            {importResult.success ? (
              <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
            )}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {importResult.success ? 'Import Successful!' : 'Import Failed'}
              </h3>
              <p className="text-gray-600">
                {importResult.success
                  ? `Successfully imported ${importResult.count} transaction(s).`
                  : `Error: ${importResult.error}`}
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Import Another File
          </button>
        </div>
      )}
    </div>
  )
}

export default CSVImport

