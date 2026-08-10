import { useState } from 'react'

const GIPHY_KEY = import.meta.env.VITE_GIPHY_API_KEY

const GifPicker = ({ onSelect }) => {
  const [query, setQuery] = useState('')
  const [gifs, setGifs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const searchGifs = async () => {
    if (!query.trim()) {
      return
    }

    if (!GIPHY_KEY) {
      setError('GIPHY is not configured')
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_KEY}&q=${encodeURIComponent(
          query
        )}&limit=12&rating=g`
      )

      const data = await response.json()

      if (!response.ok) {
        console.error(data)
        throw new Error('GIPHY request failed')
      }

      setGifs(data.data || [])
    } catch (error) {
      console.error(error)
      setError('Could not load GIFs')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="gif-picker">
      <div className="gif-search-row">
        <input
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Search GIFs..."
          onKeyDown={event => {
            if (event.key === 'Enter') {
              event.preventDefault()
              searchGifs()
            }
          }}
        />

        <button
          type="button"
          onClick={searchGifs}
        >
          Find GIFs
        </button>
      </div>

      {loading && <p>Finding GIFs...</p>}

      {error && (
        <p className="error-text">
          {error}
        </p>
      )}

      <div className="gif-results">
        {gifs.map(gif => {
          const url =
            gif.images?.fixed_height?.url ||
            gif.images?.original?.url

          return (
            <button
              type="button"
              key={gif.id}
              className="gif-option"
              onClick={() => onSelect(url)}
            >
              <img
                src={url}
                alt={gif.title || 'GIF'}
              />
            </button>
          )
        })}
      </div>

      <p className="giphy-credit">
        Powered by GIPHY
      </p>
    </div>
  )
}

export default GifPicker