import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import Dashboard from './Dashboard'
import { transactionService } from '../services/transactionService'
import { transformSupabaseData } from '../utils/supabaseDataTransformer'

function AnalyticsDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    
    const { data: transactions, error } = await transactionService.getTransactions()
    
    if (error) {
      toast.error('Failed to load transactions')
      console.error(error)
      setLoading(false)
      return
    }

    // Transform Supabase data to match Dashboard format
    const transformedData = transformSupabaseData(transactions)
    setData(transformedData)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!data || data.transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Yet</h3>
        <p className="text-gray-600 mb-6">
          Add some transactions to see your analytics!
        </p>
        <button
          onClick={loadData}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all inline-flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Refresh
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Transaction Count and Refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-700 font-medium">
            {data.transactions.length} transaction{data.transactions.length !== 1 ? 's' : ''}
          </span>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-all text-gray-700 font-medium inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Data
        </button>
      </div>

      {/* Dashboard Component */}
      <Dashboard data={data} onReset={loadData} />
    </div>
  )
}

export default AnalyticsDashboard

