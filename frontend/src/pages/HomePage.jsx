import { useCallback, useEffect, useState } from 'react'
import BoardCard from '../components/BoardCard'
import BoardForm from '../components/BoardForm'
import FilterBar from '../components/FilterBar'
import SearchBar from '../components/SearchBar'
import { API_URL } from '../api'

const HomePage = () => {
  const [boards, setBoards] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchBoards = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const params = new URLSearchParams()

      if (
        filter !== 'all' &&
        filter !== 'recent'
      ) {
        params.append('category', filter)
      }

      if (filter === 'recent') {
        params.append('recent', 'true')
      }

      if (search) {
        params.append('search', search)
      }

      const query = params.toString()

      const response = await fetch(
        `${API_URL}/boards${query ? `?${query}` : ''}`
      )

      if (!response.ok) {
        throw new Error('Could not load boards')
      }

      const data = await response.json()
      setBoards(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filter, search])

  useEffect(() => {
    fetchBoards()
  }, [fetchBoards])

  const deleteBoard = async id => {
    const confirmed = window.confirm(
      'Delete this board and all of its cards?'
    )

    if (!confirmed) {
      return
    }

    await fetch(`${API_URL}/boards/${id}`, {
      method: 'DELETE'
    })

    fetchBoards()
  }

  return (
    <>
      <section className="hero">
        <p className="eyebrow">
          SAY THE GOOD THING OUT LOUD
        </p>

        <h1>
          A better place to give people their flowers.
        </h1>

        <p>
          Build boards for celebrations, thank-yous,
          and the people who deserve some recognition.
        </p>

        <BoardForm onCreated={fetchBoards} />
      </section>

      <SearchBar onSearch={setSearch} />

      <FilterBar
        activeFilter={filter}
        onFilter={setFilter}
      />

      {loading && (
        <p className="status">
          Loading boards...
        </p>
      )}

      {error && (
        <p className="error-text">
          {error}
        </p>
      )}

      {!loading && boards.length === 0 && (
        <div className="empty-state">
          <span>✨</span>
          <h2>No boards here yet</h2>
          <p>Create the first one.</p>
        </div>
      )}

      <section className="board-grid">
        {boards.map(board => (
          <BoardCard
            key={board.id}
            board={board}
            onDelete={deleteBoard}
          />
        ))}
      </section>
    </>
  )
}

export default HomePage