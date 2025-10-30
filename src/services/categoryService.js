import { supabase } from '../utils/supabase'

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
  }
}

