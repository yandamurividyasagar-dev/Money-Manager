import './index.css'

const MoneyDetails = ({transactionsList}) => {
  const income = transactionsList
    .filter(t => t.type === 'INCOME')
    .reduce((acc, t) => acc + t.amount, 0)

  const expenses = transactionsList
    .filter(t => t.type === 'EXPENSES')
    .reduce((acc, t) => acc + t.amount, 0)

  const balance = income - expenses

  return (
    <div className="money-details-container">
      <div className="money-item balance">
        <img
          src="https://assets.ccbp.in/frontend/react-js/money-manager/balance-image.png"
          alt="balance"
          className="money-image"
        />
        <div>
          <p>Your Balance</p>
          <p data-testid="balanceAmount">Rs {balance}</p>
        </div>
      </div>

      <div className="money-item income">
        <img
          src="https://assets.ccbp.in/frontend/react-js/money-manager/income-image.png"
          alt="income"
          className="money-image"
        />
        <div>
          <p>Your Income</p>
          <p data-testid="incomeAmount">Rs {income}</p>
        </div>
      </div>

      <div className="money-item expenses">
        <img
          src="https://assets.ccbp.in/frontend/react-js/money-manager/expenses-image.png"
          alt="expenses"
          className="money-image"
        />
        <div>
          <p>Your Expenses</p>
          <p data-testid="expensesAmount">Rs {expenses}</p>
        </div>
      </div>
    </div>
  )
}

export default MoneyDetails
