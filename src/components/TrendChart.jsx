import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format, parse } from 'date-fns'
import { useState } from 'react'
import { TrendingUp } from 'lucide-react'

function TrendChart({ data }) {
  const [chartType, setChartType] = useState('line') // line or bar

  // Prepare monthly trend data
  const trendData = Object.entries(data.byMonth)
    .map(([month, values]) => {
      try {
        const date = parse(month, 'yyyy-MM', new Date())
        return {
          month,
          monthLabel: format(date, 'MMM yyyy'),
          income: values.income,
          expense: values.expense,
          net: values.income - values.expense
        }
      } catch {
        return null
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.month.localeCompare(b.month))

  if (trendData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Monthly Trend</h3>
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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-semibold">{formatCurrency(entry.value)}</span>
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const Chart = chartType === 'line' ? LineChart : BarChart

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800">Monthly Trend</h3>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('line')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              chartType === 'line'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Line
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              chartType === 'bar'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Bar
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <Chart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="monthLabel" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {chartType === 'line' ? (
            <>
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#10B981" 
                strokeWidth={3}
                name="Income"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="expense" 
                stroke="#EF4444" 
                strokeWidth={3}
                name="Expense"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="net" 
                stroke="#3B82F6" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Net"
                dot={{ r: 3 }}
              />
            </>
          ) : (
            <>
              <Bar dataKey="income" fill="#10B981" name="Income" />
              <Bar dataKey="expense" fill="#EF4444" name="Expense" />
            </>
          )}
        </Chart>
      </ResponsiveContainer>
    </div>
  )
}

export default TrendChart

