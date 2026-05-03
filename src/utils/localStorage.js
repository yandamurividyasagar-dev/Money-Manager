export const saveData = data => {
  localStorage.setItem('transactions', JSON.stringify(data))
}

export const getData = () => {
  const data = localStorage.getItem('transactions')
  return data ? JSON.parse(data) : []
}
