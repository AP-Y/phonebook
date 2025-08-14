import phonebookService from '../services/phonebook'

const Form = ({persons, setPersons, newPerson, setNewPerson,
               displayMessage, emptyPerson, refreshAllPersons}) => {
  const addPerson = (event) => {
    event.preventDefault()
    const sameName = persons.filter(per => per.name === newPerson.name)

    if (sameName.length === 0) {
      // New name
      phonebookService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          displayMessage(`Added ${returnedPerson.name}`)
        })

    } else if (sameName[0].number === newPerson.number) {
      // Same name, same number
      displayMessage(`${newPerson.name} at ${newPerson.number} is already added to phonebook`)

    } else {
      // Same name, new number
      if (window.confirm(`${newPerson.name} is already added to the phonebook, replace the old number with a new one?`)) {
        const updateId = sameName[0].id
        phonebookService
          .update(updateId, {...newPerson, id: updateId})
          .then(returnedPerson => {
            setPersons(persons.map(per => per.id === updateId ? returnedPerson : per))
            displayMessage(`Changed ${returnedPerson.name}'s number`)
          })
          .catch(error => {
            displayMessage(`Error: information of ${newPerson.name} has already been removed from server`)
            refreshAllPersons()
            return error
          })
      }
    }

    setNewPerson(emptyPerson)
  }

  const handleNameChange = (event) => setNewPerson({...newPerson, name: event.target.value})

  const handleNumberChange = (event) => setNewPerson({...newPerson, number: event.target.value})

  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newPerson.name} onChange={handleNameChange} />
        <br />
        number: <input value={newPerson.number} onChange={handleNumberChange} />
      </div>
      <button type="submit">add</button>
    </form>
  )
}

export default Form