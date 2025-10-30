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

export const categoryService = {
  // Get all categories for current user
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('is_default', { ascending: false })
        .order('name', { ascending: true })

      if (error) throw error
      
      // If no categories exist, initialize default categories
      if (!data || data.length === 0) {
        await this.initializeDefaultCategories()
        // Fetch again after initialization
        const { data: newData, error: newError } = await supabase
          .from('categories')
          .select('*')
          .order('is_default', { ascending: false })
          .order('name', { ascending: true })
        
        if (newError) throw newError
        return { data: newData, error: null }
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('Get categories error:', error)
      return { data: null, error }
    }
  },

  // Get categories by type (income/expense)
  async getCategoriesByType(type) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('type', type)
        .order('is_default', { ascending: false })
        .order('name', { ascending: true })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Get categories by type error:', error)
      return { data: null, error }
    }
  },

  // Create a new category
  async createCategory(categoryData) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('categories')
        .insert([{
          ...categoryData,
          user_id: user.id,
          is_default: false
        }])
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Create category error:', error)
      return { data: null, error }
    }
  },

  // Update a category (only custom categories)
  async updateCategory(id, categoryData) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', id)
        .eq('is_default', false) // Only allow updating custom categories
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Update category error:', error)
      return { data: null, error }
    }
  },

  // Delete a category (only custom categories)
  async deleteCategory(id) {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('is_default', false) // Only allow deleting custom categories

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Delete category error:', error)
      return { error }
    }
  },

  // Initialize default categories for new user
  async initializeDefaultCategories() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('User not authenticated')

      const categoriesWithUserId = DEFAULT_CATEGORIES.map(cat => ({
        ...cat,
        user_id: user.id
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
  }
}

