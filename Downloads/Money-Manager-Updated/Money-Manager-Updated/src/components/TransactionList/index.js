import './index.css'
import TransactionItem from '../TransactionItem'
import EmptyState from '../EmptyState'

const TransactionList = ({transactionsList, onDelete, onEdit}) => {
  if (transactionsList.length === 0) {
    return <EmptyState />
  }

  return (
    <ul className="transaction-list">
      {transactionsList.map(each => (
        <TransactionItem
          key={each.id}
          transactionDetails={each}
          deleteTransaction={onDelete}
          editTransaction={onEdit}
        />
      ))}
    </ul>
  )
}

export default TransactionList
