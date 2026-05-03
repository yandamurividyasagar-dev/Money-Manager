import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

const CustomTooltip = ({active, payload, label}) => {
  if (active && payload && payload.length) {
    const val = payload[0].value
    return (
      <div
        style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: '12px 16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        }}
      >
        <p style={{margin: 0, fontSize: 11, color: '#94a3b8', marginBottom: 4}}>
          Transaction #{label}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 800,
            color: val >= 0 ? '#16a34a' : '#dc2626',
          }}
        >
          ₹ {val.toLocaleString()}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: 11,
            color: val >= 0 ? '#16a34a' : '#dc2626',
          }}
        >
          {val >= 0 ? '▲ Positive' : '▼ Negative'} Balance
        </p>
      </div>
    )
  }
  return null
}

const BalanceChart = ({transactionsList}) => {
  if (!transactionsList || transactionsList.length === 0) {
    return (
      <div className="chart-container">
        <p className="chart-title">📈 Balance Trend</p>
        <div className="empty-chart">
          <div className="empty-chart-icon">📊</div>
          <p className="empty-chart-text">No transactions yet</p>
          <p className="empty-chart-sub">
            Add transactions to see your balance trend
          </p>
        </div>
      </div>
    )
  }

  let running = 0
  const data = transactionsList.map((t, i) => {
    running += t.type === 'INCOME' ? t.amount : -t.amount
    return {
      index: i + 1,
      balance: running,
      label: t.title.length > 8 ? t.title.slice(0, 8) + '…' : t.title,
      type: t.type,
    }
  })

  const max = Math.max(...data.map(d => d.balance))
  const min = Math.min(...data.map(d => d.balance))
  const current = data[data.length - 1]?.balance || 0
  const prev = data[data.length - 2]?.balance || 0
  const change = current - prev
  const isPositive = current >= 0

  return (
    <div className="chart-container">
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 16,
        }}
      >
        <div>
          <p className="chart-title" style={{margin: 0}}>
            📈 Balance Trend
          </p>
          <p style={{margin: '2px 0 0', fontSize: 11, color: '#94a3b8'}}>
            Running balance over all transactions
          </p>
        </div>
        <div style={{display: 'flex', gap: 10}}>
          <div
            style={{
              textAlign: 'right',
              background: '#f0fdf4',
              borderRadius: 8,
              padding: '6px 12px',
            }}
          >
            <p style={{margin: 0, fontSize: 10, color: '#64748b'}}>Highest</p>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 800,
                color: '#16a34a',
              }}
            >
              ₹{(max / 1000).toFixed(1)}k
            </p>
          </div>
          <div
            style={{
              textAlign: 'right',
              background: '#fef2f2',
              borderRadius: 8,
              padding: '6px 12px',
            }}
          >
            <p style={{margin: 0, fontSize: 10, color: '#64748b'}}>Lowest</p>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 800,
                color: '#dc2626',
              }}
            >
              ₹{(min / 1000).toFixed(1)}k
            </p>
          </div>
          <div
            style={{
              textAlign: 'right',
              background: isPositive ? '#eff6ff' : '#fef2f2',
              borderRadius: 8,
              padding: '6px 12px',
            }}
          >
            <p style={{margin: 0, fontSize: 10, color: '#64748b'}}>Current</p>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 800,
                color: isPositive ? '#2563eb' : '#dc2626',
              }}
            >
              ₹{(current / 1000).toFixed(1)}k
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          data={data}
          margin={{top: 10, right: 10, left: 0, bottom: 20}}
        >
          <defs>
            <linearGradient id="positiveGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f1f5f9"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{fontSize: 11, fill: '#94a3b8'}}
            axisLine={false}
            tickLine={false}
            label={{
              value: 'Transactions →',
              position: 'insideBottom',
              offset: -14,
              fontSize: 11,
              fill: '#cbd5e1',
            }}
          />
          <YAxis
            tick={{fontSize: 11, fill: '#94a3b8'}}
            axisLine={false}
            tickLine={false}
            tickFormatter={v =>
              `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`
            }
            width={55}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={0}
            stroke="#fca5a5"
            strokeDasharray="5 4"
            strokeWidth={1.5}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#22c55e"
            strokeWidth={2.5}
            fill="url(#positiveGrad)"
            dot={{fill: '#22c55e', r: 4, strokeWidth: 2, stroke: '#fff'}}
            activeDot={{r: 7, fill: '#16a34a', stroke: '#fff', strokeWidth: 2}}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Footer summary */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginTop: 8,
          paddingTop: 12,
          borderTop: '1px solid #f1f5f9',
        }}
      >
        <div style={{flex: 1, textAlign: 'center'}}>
          <p style={{margin: 0, fontSize: 11, color: '#94a3b8'}}>
            Total Transactions
          </p>
          <p
            style={{margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a'}}
          >
            {data.length}
          </p>
        </div>
        <div style={{flex: 1, textAlign: 'center'}}>
          <p style={{margin: 0, fontSize: 11, color: '#94a3b8'}}>Last Change</p>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 800,
              color: change >= 0 ? '#16a34a' : '#dc2626',
            }}
          >
            {change >= 0 ? '+' : ''}₹{change.toLocaleString()}
          </p>
        </div>
        <div style={{flex: 1, textAlign: 'center'}}>
          <p style={{margin: 0, fontSize: 11, color: '#94a3b8'}}>Net Balance</p>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 800,
              color: isPositive ? '#16a34a' : '#dc2626',
            }}
          >
            ₹{current.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default BalanceChart
