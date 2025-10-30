import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Check for existing session on mount
    checkUser()

    // Subscribe to auth changes
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const checkUser = async () => {
    try {
      const { session } = await authService.getSession()
      setSession(session)
      setUser(session?.user ?? null)
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const signup = async (email, password, username) => {
    try {
      setLoading(true)
      const { data, error } = await authService.signup(email, password, username)
      
      if (error) {
        toast.error(error.message)
        return { error }
      }

      toast.success('Account created successfully! Please check your email to verify.')
      return { data, error: null }
    } catch (error) {
      toast.error('Failed to create account')
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true)
      const { data, error } = await authService.login(email, password)
      
      if (error) {
        toast.error(error.message)
        return { error }
      }

      toast.success('Logged in successfully!')
      return { data, error: null }
    } catch (error) {
      toast.error('Failed to login')
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      const { error } = await authService.logout()
      
      if (error) {
        toast.error(error.message)
        return { error }
      }

      setUser(null)
      setSession(null)
      toast.success('Logged out successfully')
      return { error: null }
    } catch (error) {
      toast.error('Failed to logout')
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email) => {
    try {
      const { error } = await authService.resetPassword(email)
      
      if (error) {
        toast.error(error.message)
        return { error }
      }

      toast.success('Password reset email sent! Check your inbox.')
      return { error: null }
    } catch (error) {
      toast.error('Failed to send reset email')
      return { error }
    }
  }

  const updatePassword = async (newPassword) => {
    try {
      const { error } = await authService.updatePassword(newPassword)
      
      if (error) {
        toast.error(error.message)
        return { error }
      }

      toast.success('Password updated successfully!')
      return { error: null }
    } catch (error) {
      toast.error('Failed to update password')
      return { error }
    }
  }

  const value = {
    user,
    session,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

