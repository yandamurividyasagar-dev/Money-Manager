import './index.css'

const Insights = ({transactionsList}) => {
  const income = transactionsList
    .filter(t => t.type === 'INCOME')
    .reduce((a, b) => a + b.amount, 0)

  const expense = transactionsList
    .filter(t => t.type === 'EXPENSES')
    .reduce((a, b) => a + b.amount, 0)

  const percent = income ? ((expense / income) * 100).toFixed(1) : 0

  return (
    <div className="insights-container">
      <h3>Insights</h3>
      <p>Income: Rs {income}</p>
      <p>Expense: Rs {expense}</p>
      <p>Expense %: {percent}%</p>
    </div>
  )
}

export default Insights
