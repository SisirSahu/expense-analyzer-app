import { useState } from 'react'
import Papa from 'papaparse'
import { Upload, FileText, AlertCircle } from 'lucide-react'
import { parseCSVData } from '../utils/dataParser'

function FileUpload({ onDataLoaded }) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFile = (file) => {
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file')
      return
    }

    setLoading(true)
    setError(null)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsedData = parseCSVData(results.data)
          onDataLoaded(parsedData)
        } catch (err) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      },
      error: (error) => {
        setError('Failed to parse CSV file: ' + error.message)
        setLoading(false)
      }
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    handleFile(file)
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 hover-lift">
      <div
        className={`border-4 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
          isDragging
            ? 'border-blue-500 bg-blue-50 scale-105 shadow-lg'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
              <div className="animate-ping absolute inset-0 rounded-full h-16 w-16 border-4 border-blue-300 opacity-75"></div>
            </div>
            <p className="text-gray-600 text-lg animate-pulse">Processing your file...</p>
          </div>
        ) : (
          <>
            <FileText className="w-20 h-20 mx-auto mb-6 text-gray-400 transition-all duration-300 hover:text-blue-500 hover:scale-110" />
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Upload Your Expense CSV
            </h2>
            <p className="text-gray-600 mb-6">
              Drag and drop your CSV file here, or click to browse
            </p>
            <label className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white px-8 py-3 rounded-lg cursor-pointer hover:shadow-2xl transition-all transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden group">
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
              <Upload className="w-5 h-5 animate-bounce" />
              <span className="relative z-10">Choose File</span>
              <input
                type="file"
                className="hidden"
                accept=".csv"
                onChange={handleFileInput}
              />
            </label>
          </>
        )}
      </div>

      {error && (
        <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-3">Expected CSV Format:</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• <strong>TIME:</strong> Date and time of transaction (e.g., "May 05, 2024 4:28 PM")</li>
          <li>• <strong>TYPE:</strong> "(+) Income" or "(-) Expense"</li>
          <li>• <strong>AMOUNT:</strong> Transaction amount</li>
          <li>• <strong>CATEGORY:</strong> Category name</li>
          <li>• <strong>ACCOUNT:</strong> Cash, Card, etc.</li>
          <li>• <strong>NOTES:</strong> Additional notes (optional)</li>
        </ul>
      </div>
    </div>
  )
}

export default FileUpload

