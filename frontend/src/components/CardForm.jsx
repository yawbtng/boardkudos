import { useState } from 'react'
import AIKudosWriter from './AiKudosWriter'
import GifPicker from './GifPicker'
import { API_URL } from '../api'

const CardForm = ({ boardId, onCreated }) => {
  const [message, setMessage] = useState('')
  const [author, setAuthor] = useState('')
  const [gifUrl, setGifUrl] = useState('')
  const [error, setError] = useState('')

  const submit = async event => {
    event.preventDefault()

    try {
      setError('')

      const response = await fetch(`${API_URL}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          author,
          gifUrl,
          boardId: Number(boardId)
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      setMessage('')
      setAuthor('')
      setGifUrl('')

      onCreated()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="card-form-panel">
      <h2>Add some kudos</h2>

      <AIKudosWriter
        onGenerated={setMessage}
      />

      {error && (
        <p className="error-text">
          {error}
        </p>
      )}

      <form onSubmit={submit} className="card-form">
        <label>
          Message
          <textarea
            required
            value={message}
            onChange={event => setMessage(event.target.value)}
            placeholder="Write something worth remembering..."
          />
        </label>

        <label>
          Author
          <input
            value={author}
            onChange={event => setAuthor(event.target.value)}
            placeholder="Optional"
          />
        </label>

        <div>
          <p className="field-label">
            Choose a GIF
          </p>

          {gifUrl && (
            <img
              className="selected-gif"
              src={gifUrl}
              alt="Selected GIF"
            />
          )}

          <GifPicker onSelect={setGifUrl} />
        </div>

        <button
          className="primary-button"
          type="submit"
        >
          Post Kudos
        </button>
      </form>
    </section>
  )
}

export default CardForm