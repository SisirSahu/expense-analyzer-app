import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'

function QuickStats({ stats }) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'Total Income',
      amount: stats.totalIncome,
      color: 'green',
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Total Expense',
      amount: stats.totalExpense,
      color: 'red',
      icon: TrendingDown,
      gradient: 'from-red-500 to-rose-600'
    },
    {
      title: 'Net Balance',
      amount: stats.netBalance,
      color: stats.netBalance >= 0 ? 'blue' : 'orange',
      icon: Wallet,
      gradient: stats.netBalance >= 0 ? 'from-blue-500 to-purple-600' : 'from-orange-500 to-red-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 hover-lift relative overflow-hidden group"
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${card.gradient}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className={`text-3xl font-bold ${
                card.color === 'green' ? 'text-green-600' :
                card.color === 'red' ? 'text-red-600' :
                card.color === 'blue' ? 'text-blue-600' :
                'text-orange-600'
              }`}>
                ₹{Math.abs(card.amount).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {card.title === 'Total Income' && `${stats.incomeCount} transactions`}
                {card.title === 'Total Expense' && `${stats.expenseCount} transactions`}
                {card.title === 'Net Balance' && `${stats.transactionCount} total`}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default QuickStats

