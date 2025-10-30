import { format, parse } from 'date-fns'

/**
 * Transform Supabase transactions data to match the existing Dashboard data structure
 */
export function transformSupabaseData(transactions) {
  if (!transactions || transactions.length === 0) {
    return {
      transactions: [],
      summary: { totalIncome: 0, totalExpense: 0, netBalance: 0 },
      monthlyTrends: [],
      byMonth: {}, // For TrendChart
      byCategory: {}, // For CategoryChart
      categoryBreakdown: { income: {}, expense: {} },
      years: [],
      months: [],
      categories: []
    }
  }

  // Transform transactions to match existing format
  const transformedTransactions = transactions.map(t => {
    const date = new Date(t.date)
    return {
      date,
      type: t.type,
      amount: parseFloat(t.amount),
      category: t.category_name,
      account: t.account || '',
      notes: t.notes || '',
      time: format(date, 'MMM dd, yyyy h:mm a'),
      // Add fields required by filter functions
      dateStr: format(date, 'yyyy-MM-dd'),
      year: format(date, 'yyyy'),
      month: format(date, 'yyyy-MM'),
      timestamp: date.getTime()
    }
  })

  // Calculate summary
  const summary = {
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0
  }

  transformedTransactions.forEach(t => {
    if (t.type === 'income') {
      summary.totalIncome += t.amount
    } else {
      summary.totalExpense += t.amount
    }
  })

  summary.netBalance = summary.totalIncome - summary.totalExpense

  // Calculate monthly trends (byMonth object for TrendChart)
  const byMonth = {}
  transformedTransactions.forEach(t => {
    const monthKey = format(t.date, 'yyyy-MM')
    if (!byMonth[monthKey]) {
      byMonth[monthKey] = {
        income: 0,
        expense: 0
      }
    }
    if (t.type === 'income') {
      byMonth[monthKey].income += t.amount
    } else {
      byMonth[monthKey].expense += t.amount
    }
  })

  // Also create monthlyTrends array for backward compatibility
  const monthlyTrends = Object.entries(byMonth).map(([key, values]) => ({
    month: format(parse(key, 'yyyy-MM', new Date()), 'MMM yyyy'),
    income: values.income,
    expense: values.expense
  })).sort((a, b) => {
    const dateA = parse(a.month, 'MMM yyyy', new Date())
    const dateB = parse(b.month, 'MMM yyyy', new Date())
    return dateA - dateB
  })

  // Calculate category breakdown
  const categoryBreakdown = { income: {}, expense: {} }
  const byCategory = {}
  
  transformedTransactions.forEach(t => {
    // For categoryBreakdown (simple format)
    if (!categoryBreakdown[t.type][t.category]) {
      categoryBreakdown[t.type][t.category] = 0
    }
    categoryBreakdown[t.type][t.category] += t.amount

    // For byCategory (detailed format for CategoryChart)
    if (!byCategory[t.category]) {
      byCategory[t.category] = {
        income: 0,
        expense: 0,
        count: 0
      }
    }
    if (t.type === 'income') {
      byCategory[t.category].income += t.amount
    } else {
      byCategory[t.category].expense += t.amount
    }
    byCategory[t.category].count++
  })

  // Extract years
  const years = [...new Set(transformedTransactions.map(t => format(t.date, 'yyyy')))]
    .sort()
    .reverse()

  // Extract months
  const months = [...new Set(transformedTransactions.map(t => format(t.date, 'MMMM')))]
    .sort((a, b) => {
      const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      return monthOrder.indexOf(a) - monthOrder.indexOf(b)
    })

  // Extract categories
  const categories = [...new Set(transformedTransactions.map(t => t.category))].sort()

  return {
    transactions: transformedTransactions,
    summary,
    monthlyTrends,
    byMonth, // For TrendChart
    byCategory, // For CategoryChart
    categoryBreakdown,
    years,
    months,
    categories
  }
}

