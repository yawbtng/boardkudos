import { useState } from 'react'

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('')

  const handleSubmit = event => {
    event.preventDefault()
    onSearch(query.trim())
  }

  const clearSearch = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        value={query}
        onChange={event => {
          const value = event.target.value
          setQuery(value)

          if (!value) {
            onSearch('')
          }
        }}
        placeholder="Search boards..."
      />

      <button type="submit">
        Search
      </button>

      {query && (
        <button
          type="button"
          className="clear-button"
          onClick={clearSearch}
        >
          Clear
        </button>
      )}
    </form>
  )
}

export default SearchBar