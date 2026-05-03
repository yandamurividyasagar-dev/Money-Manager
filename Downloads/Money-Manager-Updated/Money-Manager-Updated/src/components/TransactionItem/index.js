import './index.css'

const TransactionItem = props => {
  const {transactionDetails, deleteTransaction, editTransaction} = props
  const {id, title, amount, type} = transactionDetails

  return (
    <li className="transaction-item">
      <p className="table-text">{title}</p>
      <p className="table-text">Rs {amount}</p>
      <p className="table-text">{type}</p>
      <div className="action-buttons">
        <button
          className="edit-button"
          onClick={() => editTransaction(transactionDetails)}
        >
          ✏️
        </button>
        <button
          data-testid="delete"
          className="delete-button"
          onClick={() => deleteTransaction(id)}
        >
          <img
            src="https://assets.ccbp.in/frontend/react-js/money-manager/delete.png"
            alt="delete"
            className="delete-icon"
          />
        </button>
      </div>
    </li>
  )
}

export default TransactionItem
