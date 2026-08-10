import { useState } from 'react'
import { API_URL } from '../api'

const AIKudosWriter = ({ onGenerated }) => {
  const [prompt, setPrompt] = useState('')
  const [tone, setTone] = useState('warm')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generate = async () => {
    if (!prompt.trim()) {
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await fetch(
        `${API_URL}/ai/kudos`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            prompt,
            tone
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      onGenerated(data.message)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ai-writer">
      <div className="ai-heading">
        <span>✨</span>

        <div>
          <strong>AI Kudos Writer</strong>
          <p>
            Give it the context and let it help with the wording.
          </p>
        </div>
      </div>

      <textarea
        value={prompt}
        onChange={event => setPrompt(event.target.value)}
        placeholder="Ex: Maya stayed late to help our team finish the presentation..."
      />

      <div className="ai-controls">
        <select
          value={tone}
          onChange={event => setTone(event.target.value)}
        >
          <option value="warm">Warm</option>
          <option value="funny">Funny</option>
          <option value="professional">Professional</option>
          <option value="enthusiastic">Enthusiastic</option>
          <option value="heartfelt">Heartfelt</option>
        </select>

        <button
          type="button"
          onClick={generate}
          disabled={loading}
        >
          {loading ? 'Writing...' : 'Generate'}
        </button>
      </div>

      {error && (
        <p className="error-text">
          {error}
        </p>
      )}
    </div>
  )
}

export default AIKudosWriter