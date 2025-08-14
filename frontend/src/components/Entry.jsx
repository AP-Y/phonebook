const Entry = ({person, handleDelete}) => {
  return (
    <div>
      <span>{person.name} {person.number}</span>
      <button onClick={handleDelete}>delete</button>
    </div>
  )
}

export default Entry