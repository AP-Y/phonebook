const Filter = ({filter, setFilter}) => {
  const handleFilterChange = (event) => setFilter(event.target.value.toLowerCase())

  return (
    <div>
        filter show with <input value={filter} onChange={handleFilterChange} />
    </div>
  )
}

export default Filter