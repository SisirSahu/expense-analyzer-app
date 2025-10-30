import { useState } from 'react'
import { Wallet, ListTodo, BarChart3, Upload, LogOut, User, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Header({ currentView, onViewChange }) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    setShowUserMenu(false)
  }

  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User'

  const navItems = [
    { id: 'transactions', label: 'Transactions', icon: ListTodo },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'import', label: 'Import CSV', icon: Upload }
  ]

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Expense Tracker
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map(item => {
              const Icon = item.icon
              const isActive = currentView === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              )
            })}
          </nav>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {username}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{username}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <nav className="flex items-center justify-around py-2">
            {navItems.map(item => {
              const Icon = item.icon
              const isActive = currentView === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-blue-600'
                      : 'text-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header

