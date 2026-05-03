import {Component} from 'react'
import {v4 as uuidv4} from 'uuid'
import MoneyDetails from '../MoneyDetails'
import TransactionList from '../TransactionList'
import Filters from '../Filters'
import RoleToggle from '../RoleToggle'
import BalanceChart from '../BalanceChart'
import CategoryChart from '../CategoryChart'
import Insights from '../Insights'
import EditTransaction from '../EditTransaction'
import {filterTransactions, saveData, getData} from '../../utils/helpers'
import './index.css'

const transactionTypeOptions = [
  {optionId: 'INCOME', displayText: 'Income'},
  {optionId: 'EXPENSES', displayText: 'Expenses'},
]

class MoneyManager extends Component {
  state = {
    titleInput: '',
    amountInput: '',
    typeInput: transactionTypeOptions[0].optionId,
    transactionsList: getData(),
    role: 'ADMIN',
    filters: {search: '', type: 'ALL'},
    selectedTransaction: null,
  }

  onChangeTitle = e => this.setState({titleInput: e.target.value})
  onChangeAmount = e => this.setState({amountInput: e.target.value})
  onChangeType = e => this.setState({typeInput: e.target.value})

  fireNotif = (type, title, amount) => {
    window.dispatchEvent(
      new CustomEvent('mm-transaction', {detail: {type, title, amount}}),
    )
  }

  onAddTransaction = e => {
    e.preventDefault()
    const {titleInput, amountInput, typeInput} = this.state
    if (!titleInput.trim()) return alert('Title required')
    if (!amountInput || isNaN(amountInput) || amountInput <= 0)
      return alert('Enter valid amount')
    const newTransaction = {
      id: uuidv4(),
      title: titleInput,
      amount: parseInt(amountInput),
      type: typeInput,
      date: new Date().toISOString(),
    }
    this.setState(
      prevState => {
        const updated = [...prevState.transactionsList, newTransaction]
        saveData(updated)
        return {
          transactionsList: updated,
          titleInput: '',
          amountInput: '',
          typeInput: transactionTypeOptions[0].optionId,
        }
      },
      () => this.fireNotif('add', newTransaction.title, newTransaction.amount),
    )
  }

  deleteTransaction = id => {
    if (!window.confirm('Delete this transaction?')) return
    this.setState(prevState => {
      const updated = prevState.transactionsList.filter(each => each.id !== id)
      saveData(updated)
      return {transactionsList: updated}
    })
  }

  setEditTransaction = tx => this.setState({selectedTransaction: tx})

  updateTransaction = updatedTx => {
    this.setState(
      prevState => {
        const updated = prevState.transactionsList.map(each =>
          each.id === updatedTx.id ? updatedTx : each,
        )
        saveData(updated)
        return {transactionsList: updated, selectedTransaction: null}
      },
      () => this.fireNotif('update', updatedTx.title, updatedTx.amount),
    )
  }

  componentDidMount() {
    this._searchHandler = e => {
      this.setState(prev => ({
        filters: {...prev.filters, search: e.detail || ''},
      }))
    }
    window.addEventListener('mm-search', this._searchHandler)
  }

  componentWillUnmount() {
    window.removeEventListener('mm-search', this._searchHandler)
  }

  render() {
    const {
      titleInput,
      amountInput,
      typeInput,
      transactionsList,
      role,
      filters,
      selectedTransaction,
    } = this.state
    const filteredList = filterTransactions(transactionsList, filters)
    const displayName = this.props.userName || 'there'

    return (
      <div className="money-manager-container">
        <div className="header-container">
          <h1 className="heading">Hi, {displayName}</h1>
          <p className="description">
            Welcome back to your{' '}
            <span className="money-manager">Finance Dashboard</span>
          </p>
        </div>
        <MoneyDetails transactionsList={transactionsList} />
        <div className="charts-row">
          <BalanceChart transactionsList={transactionsList} />
          <CategoryChart transactionsList={transactionsList} />
        </div>
        <RoleToggle role={role} setRole={role => this.setState({role})} />
        <div className="transactions-container">
          {role === 'ADMIN' && (
            <form
              className="add-transaction-form"
              onSubmit={this.onAddTransaction}
            >
              <h3 className="transaction-heading">Add Transaction</h3>
              <label className="label">Title</label>
              <input
                className="input"
                value={titleInput}
                onChange={this.onChangeTitle}
                placeholder="Title"
              />
              <label className="label">Amount</label>
              <input
                className="input"
                value={amountInput}
                onChange={this.onChangeAmount}
                placeholder="Amount"
                type="number"
              />
              <label className="label">Type</label>
              <select
                className="input"
                value={typeInput}
                onChange={this.onChangeType}
              >
                {transactionTypeOptions.map(option => (
                  <option key={option.optionId} value={option.optionId}>
                    {option.displayText}
                  </option>
                ))}
              </select>
              <button className="add-button" type="submit">
                Add
              </button>
            </form>
          )}
          <div className="history-container">
            <h3 className="transaction-heading">History</h3>
            <Filters onFilter={filters => this.setState({filters})} />
            <div className="table-header">
              <p className="table-text">Title</p>
              <p className="table-text">Amount</p>
              <p className="table-text">Type</p>
              <p className="table-text">Actions</p>
            </div>
            <TransactionList
              transactionsList={filteredList}
              onDelete={this.deleteTransaction}
              onEdit={this.setEditTransaction}
            />
          </div>
        </div>
        <EditTransaction
          selectedTx={selectedTransaction}
          onUpdate={this.updateTransaction}
          onClose={() => this.setState({selectedTransaction: null})}
        />
        <Insights transactionsList={transactionsList} />
      </div>
    )
  }
}

export default MoneyManager
