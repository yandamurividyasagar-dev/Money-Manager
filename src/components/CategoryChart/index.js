import {PieChart, Pie, Cell, Tooltip, ResponsiveContainer} from 'recharts'

const COLORS = ['#2563eb', '#f97316', '#22c55e']

const CustomTooltip = ({active, payload}) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 10,
          padding: '10px 16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <p style={{margin: 0, fontSize: 13, fontWeight: 700}}>
          {payload[0].name}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 700,
            color: payload[0].color,
          }}
        >
          ₹ {payload[0].value.toLocaleString()}
        </p>
      </div>
    )
  }
  return null
}

const CategoryChart = ({transactionsList}) => {
  const income = transactionsList
    .filter(t => t.type === 'INCOME')
    .reduce((s, t) => s + t.amount, 0)
  const expenses = transactionsList
    .filter(t => t.type === 'EXPENSES')
    .reduce((s, t) => s + t.amount, 0)
  const balance = income - expenses
  const total = income + expenses
  const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0
  const incomePercent = total ? Math.round((income / total) * 100) : 0
  const expensePercent = total ? Math.round((expenses / total) * 100) : 0

  if (!transactionsList || transactionsList.length === 0) {
    return (
      <div className="chart-container">
        <p className="chart-title">🥧 Income vs Expenses</p>
        <div className="empty-chart">
          <div className="empty-chart-icon">🥧</div>
          <p className="empty-chart-text">No transactions yet</p>
          <p className="empty-chart-sub">
            Add transactions to see the breakdown
          </p>
        </div>
      </div>
    )
  }

  const data = [
    {name: 'Income', value: income},
    {name: 'Expenses', value: expenses},
  ]

  return (
    <div className="chart-container">
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <p className="chart-title" style={{margin: 0}}>
          🥧 Income vs Expenses
        </p>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: 999,
            background: savingsRate >= 0 ? '#f0fdf4' : '#fef2f2',
            color: savingsRate >= 0 ? '#16a34a' : '#dc2626',
          }}
        >
          {savingsRate >= 0 ? '💰' : '⚠️'} Savings {savingsRate}%
        </span>
      </div>

      {/* Chart + Stats side by side */}
      <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
        {/* Donut chart */}
        <div
          style={{position: 'relative', width: 160, height: 160, flexShrink: 0}}
        >
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
              textAlign: 'center',
            }}
          >
            <p style={{margin: 0, fontSize: 11, color: '#64748b'}}>Balance</p>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 800,
                color: balance >= 0 ? '#16a34a' : '#dc2626',
              }}
            >
              ₹{(balance / 1000).toFixed(1)}k
            </p>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 12}}
        >
          {/* Income */}
          <div
            style={{
              background: '#eff6ff',
              borderRadius: 12,
              padding: '12px 14px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}
            >
              <span style={{fontSize: 12, color: '#2563eb', fontWeight: 600}}>
                📥 Income
              </span>
              <span style={{fontSize: 13, fontWeight: 800, color: '#2563eb'}}>
                ₹ {income.toLocaleString()}
              </span>
            </div>
            <div style={{height: 6, background: '#bfdbfe', borderRadius: 999}}>
              <div
                style={{
                  height: 6,
                  background: '#2563eb',
                  borderRadius: 999,
                  width: `${incomePercent}%`,
                  transition: 'width 0.6s',
                }}
              />
            </div>
            <p style={{margin: '4px 0 0', fontSize: 11, color: '#64748b'}}>
              {incomePercent}% of total
            </p>
          </div>

          {/* Expenses */}
          <div
            style={{
              background: '#fff7ed',
              borderRadius: 12,
              padding: '12px 14px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}
            >
              <span style={{fontSize: 12, color: '#f97316', fontWeight: 600}}>
                📤 Expenses
              </span>
              <span style={{fontSize: 13, fontWeight: 800, color: '#f97316'}}>
                ₹ {expenses.toLocaleString()}
              </span>
            </div>
            <div style={{height: 6, background: '#fed7aa', borderRadius: 999}}>
              <div
                style={{
                  height: 6,
                  background: '#f97316',
                  borderRadius: 999,
                  width: `${expensePercent}%`,
                  transition: 'width 0.6s',
                }}
              />
            </div>
            <p style={{margin: '4px 0 0', fontSize: 11, color: '#64748b'}}>
              {expensePercent}% of total
            </p>
          </div>

          {/* Balance */}
          <div
            style={{
              background: balance >= 0 ? '#f0fdf4' : '#fef2f2',
              borderRadius: 12,
              padding: '12px 14px',
            }}
          >
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span
                style={{
                  fontSize: 12,
                  color: balance >= 0 ? '#16a34a' : '#dc2626',
                  fontWeight: 600,
                }}
              >
                💰 Net Balance
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: balance >= 0 ? '#16a34a' : '#dc2626',
                }}
              >
                ₹ {balance.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryChart
