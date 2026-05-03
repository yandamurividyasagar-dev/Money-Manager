export const filterTransactions = (list, filters) => {
  return list.filter(each => {
    const matchesSearch = each.title
      .toLowerCase()
      .includes(filters.search.toLowerCase())

    const matchesType = filters.type === 'ALL' || each.type === filters.type

    return matchesSearch && matchesType
  })
}

export const saveData = data => {
  localStorage.setItem('transactions', JSON.stringify(data))
}

export const getData = () => {
  const data = localStorage.getItem('transactions')
  return data ? JSON.parse(data) : []
}
