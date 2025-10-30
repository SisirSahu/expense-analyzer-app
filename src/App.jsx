import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import ForgotPassword from './components/Auth/ForgotPassword'
import Header from './components/Header'
import TransactionManager from './components/TransactionManager'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import CSVImport from './components/CSVImport'

function App() {
  const { user, loading } = useAuth()
  const [authView, setAuthView] = useState('login') // login, signup, forgot
  const [currentView, setCurrentView] = useState('transactions') // transactions, analytics, import

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  // Show auth views if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500">
        {authView === 'login' && <Login onToggleView={setAuthView} />}
        {authView === 'signup' && <Signup onToggleView={setAuthView} />}
        {authView === 'forgot' && <ForgotPassword onToggleView={setAuthView} />}
      </div>
    )
  }

  // Show main app if logged in
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'transactions' && <TransactionManager />}
        {currentView === 'analytics' && <AnalyticsDashboard />}
        {currentView === 'import' && <CSVImport />}
      </main>
    </div>
  )
}

export default App

