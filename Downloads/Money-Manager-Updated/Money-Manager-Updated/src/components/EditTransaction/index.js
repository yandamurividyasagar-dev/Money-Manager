import {useState, useEffect} from 'react'
import './index.css'

const EditTransaction = ({selectedTx, onUpdate, onClose}) => {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('INCOME')

  useEffect(() => {
    if (selectedTx) {
      setTitle(selectedTx.title)
      setAmount(selectedTx.amount)
      setType(selectedTx.type)
    }
  }, [selectedTx])

  if (!selectedTx) return null

  const handleUpdate = () => {
    const updatedTx = {
      ...selectedTx,
      title,
      amount: Number(amount),
      type,
    }
    onUpdate(updatedTx)
    onClose()
  }

  return (
    <div className="edit-container">
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <input value={amount} onChange={e => setAmount(e.target.value)} />
      <select value={type} onChange={e => setType(e.target.value)}>
        <option value="INCOME">Income</option>
        <option value="EXPENSES">Expenses</option>
      </select>
      <button onClick={handleUpdate}>Update</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  )
}

export default EditTransaction
