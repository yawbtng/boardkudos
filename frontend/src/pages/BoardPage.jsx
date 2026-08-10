import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CardForm from '../components/CardForm'
import KudosCard from '../components/KudosCard'
import { API_URL } from '../api'

const BoardPage = () => {
  const { id } = useParams()

  const [board, setBoard] = useState(null)
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)

  const loadBoard = useCallback(async () => {
    const [boardResponse, cardsResponse] =
      await Promise.all([
        fetch(`${API_URL}/boards/${id}`),
        fetch(`${API_URL}/boards/${id}/cards`)
      ])

    const boardData = await boardResponse.json()
    const cardData = await cardsResponse.json()

    setBoard(boardData)
    setCards(Array.isArray(cardData) ? cardData : [])
    setLoading(false)
  }, [id])

  useEffect(() => {
    loadBoard()
  }, [loadBoard])

  if (loading) {
    return <p className="status">Loading board...</p>
  }

  if (!board?.id) {
    return <p className="error-text">Board not found.</p>
  }

  return (
    <>
      <Link to="/" className="back-link">
        ← Back to boards
      </Link>

      <section className="board-hero">
        <img src={board.imageUrl} alt="" />

        <div>
          <span className="category-chip">
            {board.category.replace('-', ' ')}
          </span>

          <h1>{board.title}</h1>

          {board.author && (
            <p>Created by {board.author}</p>
          )}
        </div>
      </section>

      <CardForm
        boardId={id}
        onCreated={loadBoard}
      />

      {cards.length === 0 ? (
        <div className="empty-state">
          <span>💌</span>
          <h2>No kudos yet</h2>
          <p>Be the first one to say something.</p>
        </div>
      ) : (
        <section className="card-grid">
          {cards.map(card => (
            <KudosCard
              key={card.id}
              card={card}
              onChanged={loadBoard}
            />
          ))}
        </section>
      )}
    </>
  )
}

export default BoardPage