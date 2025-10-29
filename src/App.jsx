import { useState } from 'react'
import FileUpload from './components/FileUpload'
import Dashboard from './components/Dashboard'
import { Upload } from 'lucide-react'

function App() {
  const [data, setData] = useState(null)

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3 drop-shadow-lg">
            <Upload className="w-10 h-10 animate-bounce" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white animate-shimmer">
              Expense Analyzer
            </span>
          </h1>
          <p className="text-white/90 text-lg drop-shadow-md">
            Upload your CSV and get complete financial insights
          </p>
        </header>

        {/* Main Content */}
        <div className="animate-slide-up">
          {!data ? (
            <FileUpload onDataLoaded={setData} />
          ) : (
            <Dashboard data={data} onReset={() => setData(null)} />
          )}
        </div>
      </div>
    </div>
  )
}

export default App

