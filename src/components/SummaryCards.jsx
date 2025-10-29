import { TrendingUp, TrendingDown, Wallet, PieChart } from 'lucide-react'

function SummaryCards({ summary }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const cards = [
    {
      title: 'Total Income',
      amount: summary.totalIncome,
      count: summary.incomeCount,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Expense',
      amount: summary.totalExpense,
      count: summary.expenseCount,
      icon: TrendingDown,
      color: 'from-red-500 to-rose-600',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Net Balance',
      amount: summary.netBalance,
      count: summary.totalCount,
      icon: Wallet,
      color: summary.netBalance >= 0 ? 'from-blue-500 to-cyan-600' : 'from-orange-500 to-red-600',
      textColor: summary.netBalance >= 0 ? 'text-blue-600' : 'text-orange-600',
      bgColor: summary.netBalance >= 0 ? 'bg-blue-50' : 'bg-orange-50'
    }
  ]

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-lg p-6 hover-lift animate-scale-in relative overflow-hidden group"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* Animated background gradient on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{card.title}</p>
                <h3 className="text-3xl font-bold text-gray-900 transition-transform duration-300 group-hover:scale-105">
                  {formatCurrency(card.amount)}
                </h3>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-br ${card.color} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${card.bgColor} ${card.textColor} transition-all duration-300 group-hover:px-4`}>
                {card.count} transactions
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SummaryCards

