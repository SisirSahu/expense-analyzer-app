import { supabase } from '../utils/supabase'

// Default categories to create for new users
const DEFAULT_CATEGORIES = [
  // Income categories
  { name: 'Salary', type: 'income', is_default: true },
  { name: 'Freelance', type: 'income', is_default: true },
  { name: 'Investment', type: 'income', is_default: true },
  { name: 'Gift', type: 'income', is_default: true },
  { name: 'Other Income', type: 'income', is_default: true },
  // Expense categories
  { name: 'Food', type: 'expense', is_default: true },
  { name: 'Transport', type: 'expense', is_default: true },
  { name: 'Shopping', type: 'expense', is_default: true },
  { name: 'Bills', type: 'expense', is_default: true },
  { name: 'Entertainment', type: 'expense', is_default: true },
  { name: 'Healthcare', type: 'expense', is_default: true },
  { name: 'Education', type: 'expense', is_default: true },
  { name: 'Other Expense', type: 'expense', is_default: true },
]

export const authService = {
  // Sign up a new user
  async signup(email, password, username) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0]
          }
        }
      })

      if (error) throw error

      // Initialize default categories for new user
      if (data.user) {
        await this.initializeDefaultCategories(data.user.id)
      }

      return { data, error: null }
    } catch (error) {
      console.error('Signup error:', error)
      return { data: null, error }
    }
  },

  // Login user
  async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Login error:', error)
      return { data: null, error }
    }
  },

  // Logout user
  async logout() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Logout error:', error)
      return { error }
    }
  },

  // Get current session
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return { session, error: null }
    } catch (error) {
      console.error('Get session error:', error)
      return { session: null, error }
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return { user, error: null }
    } catch (error) {
      console.error('Get user error:', error)
      return { user: null, error }
    }
  },

  // Reset password
  async resetPassword(email) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Reset password error:', error)
      return { data: null, error }
    }
  },

  // Update password
  async updatePassword(newPassword) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Update password error:', error)
      return { data: null, error }
    }
  },

  // Initialize default categories for new user
  async initializeDefaultCategories(userId) {
    try {
      const categoriesWithUserId = DEFAULT_CATEGORIES.map(cat => ({
        ...cat,
        user_id: userId
      }))

      const { error } = await supabase
        .from('categories')
        .insert(categoriesWithUserId)

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Initialize categories error:', error)
      return { error }
    }
  },

  // Subscribe to auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

