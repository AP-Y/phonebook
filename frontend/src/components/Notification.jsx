const Notification = ({message}) => {
  if (message === null) {
    return null
  }

  const isError = message.toLowerCase().includes("error")
  return (
    <div className={`message ${isError ? "error" : ""}`}>
      {message}
    </div>
  )
}

export default Notification