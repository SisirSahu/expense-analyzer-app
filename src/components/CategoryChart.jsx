import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

function CategoryChart({ data, type, title }) {
  const COLORS = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
    '#14B8A6', '#F43F5E', '#A78BFA', '#FB923C', '#4ADE80'
  ]

  const chartData = Object.entries(data.byCategory)
    .map(([category, values]) => ({
      name: category,
      value: type === 'income' ? values.income : values.expense,
      count: values.count
    }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 10) // Top 10 categories

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
        <div className="h-80 flex items-center justify-center text-gray-400">
          No data available
        </div>
      </div>
    )
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value)
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            Amount: <span className="font-semibold">{formatCurrency(payload[0].value)}</span>
          </p>
          <p className="text-sm text-gray-600">
            Transactions: <span className="font-semibold">{payload[0].payload.count}</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Legend with amounts */}
      <div className="mt-4 grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
        {chartData.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-gray-700 truncate flex-1">{entry.name}</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryChart

