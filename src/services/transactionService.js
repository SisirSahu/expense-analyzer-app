import { supabase } from '../utils/supabase'

export const transactionService = {
  // Get all transactions for current user
  async getTransactions(filters = {}) {
    try {
      let query = supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })

      // Apply filters if provided
      if (filters.startDate) {
        query = query.gte('date', filters.startDate)
      }
      if (filters.endDate) {
        query = query.lte('date', filters.endDate)
      }
      if (filters.type) {
        query = query.eq('type', filters.type)
      }
      if (filters.category) {
        query = query.eq('category_name', filters.category)
      }

      const { data, error } = await query

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Get transactions error:', error)
      return { data: null, error }
    }
  },

  // Get single transaction
  async getTransaction(id) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Get transaction error:', error)
      return { data: null, error }
    }
  },

  // Create a new transaction
  async createTransaction(transactionData) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          ...transactionData,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Create transaction error:', error)
      return { data: null, error }
    }
  },

  // Update a transaction
  async updateTransaction(id, transactionData) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update({
          ...transactionData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Update transaction error:', error)
      return { data: null, error }
    }
  },

  // Delete a transaction
  async deleteTransaction(id) {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Delete transaction error:', error)
      return { error }
    }
  },

  // Bulk create transactions (for CSV import)
  async bulkCreateTransactions(transactionsArray) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('User not authenticated')

      const transactionsWithUserId = transactionsArray.map(transaction => ({
        ...transaction,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))

      const { data, error } = await supabase
        .from('transactions')
        .insert(transactionsWithUserId)
        .select()

      if (error) throw error
      return { data, error: null, count: data.length }
    } catch (error) {
      console.error('Bulk create transactions error:', error)
      return { data: null, error, count: 0 }
    }
  },

  // Get transaction statistics
  async getStats(filters = {}) {
    try {
      const { data: transactions, error } = await this.getTransactions(filters)
      
      if (error) throw error

      const stats = {
        totalIncome: 0,
        totalExpense: 0,
        netBalance: 0,
        transactionCount: transactions?.length || 0,
        incomeCount: 0,
        expenseCount: 0
      }

      transactions?.forEach(transaction => {
        const amount = parseFloat(transaction.amount)
        if (transaction.type === 'income') {
          stats.totalIncome += amount
          stats.incomeCount++
        } else {
          stats.totalExpense += amount
          stats.expenseCount++
        }
      })

      stats.netBalance = stats.totalIncome - stats.totalExpense

      return { data: stats, error: null }
    } catch (error) {
      console.error('Get stats error:', error)
      return { data: null, error }
    }
  }
}

