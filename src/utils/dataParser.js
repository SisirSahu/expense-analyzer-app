import { parse, format } from 'date-fns'

export function parseCSVData(rows) {
  const transactions = []
  
  for (const row of rows) {
    // Clean up field names (remove extra spaces)
    const cleanRow = {}
    for (const [key, value] of Object.entries(row)) {
      cleanRow[key.trim()] = value
    }
    
    const time = cleanRow['TIME']?.trim()
    const type = cleanRow['TYPE']?.trim()
    const amount = cleanRow['AMOUNT']?.trim()
    const category = cleanRow['CATEGORY']?.trim()
    const account = cleanRow['ACCOUNT']?.trim()
    const notes = cleanRow['NOTES']?.trim()
    
    if (!time || !amount) continue
    
    try {
      // Parse date: "May 05, 2024 4:28 PM"
      const date = parse(time, 'MMM dd, yyyy h:mm a', new Date())
      
      transactions.push({
        date,
        timestamp: date.getTime(),
        dateStr: format(date, 'yyyy-MM-dd'),
        month: format(date, 'yyyy-MM'),
        year: format(date, 'yyyy'),
        type: type?.includes('Income') ? 'income' : 'expense',
        amount: parseFloat(amount),
        category: category || 'Uncategorized',
        account: account || 'Unknown',
        notes: notes || ''
      })
    } catch (err) {
      console.warn('Failed to parse row:', cleanRow, err)
    }
  }
  
  if (transactions.length === 0) {
    throw new Error('No valid transactions found in CSV')
  }
  
  // Sort by date (oldest first)
  transactions.sort((a, b) => a.timestamp - b.timestamp)
  
  return processData(transactions)
}

function processData(transactions) {
  const data = {
    transactions,
    summary: {
      totalIncome: 0,
      totalExpense: 0,
      netBalance: 0,
      incomeCount: 0,
      expenseCount: 0,
      totalCount: transactions.length
    },
    byYear: {},
    byMonth: {},
    byCategory: {},
    categories: new Set(),
    years: new Set(),
    months: new Set()
  }
  
  transactions.forEach(t => {
    // Summary
    if (t.type === 'income') {
      data.summary.totalIncome += t.amount
      data.summary.incomeCount++
    } else {
      data.summary.totalExpense += t.amount
      data.summary.expenseCount++
    }
    
    // Track unique values
    data.categories.add(t.category)
    data.years.add(t.year)
    data.months.add(t.month)
    
    // By Year
    if (!data.byYear[t.year]) {
      data.byYear[t.year] = { income: 0, expense: 0, transactions: [] }
    }
    data.byYear[t.year].transactions.push(t)
    if (t.type === 'income') {
      data.byYear[t.year].income += t.amount
    } else {
      data.byYear[t.year].expense += t.amount
    }
    
    // By Month
    if (!data.byMonth[t.month]) {
      data.byMonth[t.month] = { income: 0, expense: 0, transactions: [] }
    }
    data.byMonth[t.month].transactions.push(t)
    if (t.type === 'income') {
      data.byMonth[t.month].income += t.amount
    } else {
      data.byMonth[t.month].expense += t.amount
    }
    
    // By Category
    if (!data.byCategory[t.category]) {
      data.byCategory[t.category] = { income: 0, expense: 0, count: 0, transactions: [] }
    }
    data.byCategory[t.category].transactions.push(t)
    data.byCategory[t.category].count++
    if (t.type === 'income') {
      data.byCategory[t.category].income += t.amount
    } else {
      data.byCategory[t.category].expense += t.amount
    }
  })
  
  data.summary.netBalance = data.summary.totalIncome - data.summary.totalExpense
  
  // Convert Sets to sorted Arrays
  data.categories = Array.from(data.categories).sort()
  data.years = Array.from(data.years).sort()
  data.months = Array.from(data.months).sort()
  
  return data
}

export function filterByYear(data, year) {
  if (!year || year === 'all') return data
  
  const filtered = data.transactions.filter(t => t.year === year)
  return processData(filtered)
}

export function filterByMonth(data, month) {
  if (!month || month === 'all') return data
  
  const filtered = data.transactions.filter(t => t.month === month)
  return processData(filtered)
}

export function filterByCategory(data, category) {
  if (!category || category === 'all') return data
  
  const filtered = data.transactions.filter(t => t.category === category)
  return processData(filtered)
}

export function filterByDateRange(data, fromDate, toDate) {
  if (!fromDate && !toDate) return data
  
  const filtered = data.transactions.filter(t => {
    const transactionDate = t.dateStr
    
    if (fromDate && toDate) {
      return transactionDate >= fromDate && transactionDate <= toDate
    } else if (fromDate) {
      return transactionDate >= fromDate
    } else if (toDate) {
      return transactionDate <= toDate
    }
    
    return true
  })
  
  return processData(filtered)
}

