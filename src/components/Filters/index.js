import {useState} from 'react'
import './index.css'

const Filters = ({onFilter}) => {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('ALL')

  const handleChange = (s, t) => {
    onFilter({search: s, type: t})
  }

  return (
    <div className="filters-container">
      <input
        placeholder="Search..."
        value={search}
        onChange={e => {
          setSearch(e.target.value)
          handleChange(e.target.value, type)
        }}
      />
      <select
        value={type}
        onChange={e => {
          setType(e.target.value)
          handleChange(search, e.target.value)
        }}
      >
        <option value="ALL">All</option>
        <option value="INCOME">Income</option>
        <option value="EXPENSES">Expenses</option>
      </select>
    </div>
  )
}

export default Filters
