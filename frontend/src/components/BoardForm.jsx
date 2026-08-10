import { useState } from 'react'
import GifPicker from './GifPicker'
import { API_URL } from '../api'

const BoardForm = ({ onCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'celebration',
    author: '',
    imageUrl: ''
  })

  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async event => {
    event.preventDefault()

    try {
      setError('')

      const response = await fetch(`${API_URL}/boards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      setFormData({
        title: '',
        category: 'celebration',
        author: '',
        imageUrl: ''
      })

      setShowForm(false)
      onCreated()
    } catch (err) {
      setError(err.message)
    }
  }

  if (!showForm) {
    return (
      <button
        className="create-board-button"
        onClick={() => setShowForm(true)}
      >
        + Create Board
      </button>
    )
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button
          className="modal-close"
          onClick={() => setShowForm(false)}
        >
          ×
        </button>

        <h2>Create a new board</h2>

        {error && (
          <p className="error-text">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="board-form">
          <label>
            Board title
            <input
              required
              value={formData.title}
              onChange={event =>
                setFormData({
                  ...formData,
                  title: event.target.value
                })
              }
            />
          </label>

          <label>
            Category
            <select
              value={formData.category}
              onChange={event =>
                setFormData({
                  ...formData,
                  category: event.target.value
                })
              }
            >
              <option value="celebration">
                Celebration
              </option>

              <option value="thank-you">
                Thank You
              </option>

              <option value="inspiration">
                Inspiration
              </option>
            </select>
          </label>

          <label>
            Author
            <input
              value={formData.author}
              onChange={event =>
                setFormData({
                  ...formData,
                  author: event.target.value
                })
              }
            />
          </label>

          <div>
            <p className="field-label">
              Board GIF / image
            </p>

            {formData.imageUrl && (
              <img
                className="selected-gif"
                src={formData.imageUrl}
                alt="Selected board GIF"
              />
            )}

            <GifPicker
              onSelect={imageUrl =>
                setFormData({
                  ...formData,
                  imageUrl
                })
              }
            />
          </div>

          <button
            className="primary-button"
            type="submit"
          >
            Create Board
          </button>
        </form>
      </div>
    </div>
  )
}

export default BoardForm