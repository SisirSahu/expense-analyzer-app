import { X, Trash2, CheckCircle, AlertCircle } from 'lucide-react'

function DeleteProgressModal({ 
  isOpen, 
  total, 
  deleted, 
  failed, 
  isComplete, 
  onClose 
}) {
  if (!isOpen) return null

  const remaining = total - deleted - failed
  const progress = total > 0 ? ((deleted + failed) / total) * 100 : 0
  const successRate = deleted > 0 ? (deleted / (deleted + failed)) * 100 : 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trash2 className="w-6 h-6 text-white" />
            <h3 className="text-xl font-bold text-white">
              {isComplete ? 'Deletion Complete' : 'Deleting Transactions'}
            </h3>
          </div>
          {isComplete && (
            <button
              onClick={onClose}
              className="text-white hover:bg-red-700 rounded-lg p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm font-bold text-gray-900">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                {/* Animated shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-3">
            {/* Deleted Count */}
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center transform hover:scale-105 transition-transform">
              <div className="flex justify-center mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-700">{deleted}</div>
              <div className="text-xs text-green-600 font-medium mt-1">Deleted</div>
            </div>

            {/* Failed Count */}
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center transform hover:scale-105 transition-transform">
              <div className="flex justify-center mb-2">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-700">{failed}</div>
              <div className="text-xs text-red-600 font-medium mt-1">Failed</div>
            </div>

            {/* Remaining Count */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center transform hover:scale-105 transition-transform">
              <div className="flex justify-center mb-2">
                <Trash2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-700">{remaining}</div>
              <div className="text-xs text-blue-600 font-medium mt-1">Remaining</div>
            </div>
          </div>

          {/* Total */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Total Transactions</span>
              <span className="text-2xl font-bold text-gray-900">{total}</span>
            </div>
            {deleted > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Success Rate</span>
                  <span className="text-sm font-bold text-green-600">{successRate.toFixed(1)}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Status Message */}
          {!isComplete && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-700">Deleting transactions...</span>
              </div>
              <p className="mt-2 text-xs text-gray-500">Please wait, this may take a moment</p>
            </div>
          )}

          {/* Complete Message */}
          {isComplete && (
            <div className="text-center space-y-3">
              {failed === 0 ? (
                <>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    All transactions deleted successfully!
                  </p>
                  <p className="text-sm text-gray-600">
                    {deleted} transaction(s) have been permanently removed
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="w-10 h-10 text-yellow-600" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    Deletion completed with errors
                  </p>
                  <p className="text-sm text-gray-600">
                    {deleted} succeeded, {failed} failed
                  </p>
                </>
              )}
              
              <button
                onClick={onClose}
                className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CSS for shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}

export default DeleteProgressModal

