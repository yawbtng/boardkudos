import { API_URL } from '../api'

const KudosCard = ({
  card,
  onChanged
}) => {
  const upvote = async () => {
    await fetch(
      `${API_URL}/cards/${card.id}/upvote`,
      {
        method: 'PATCH'
      }
    )

    onChanged()
  }

  const remove = async () => {
    const confirmed = window.confirm(
      'Delete this kudos card?'
    )

    if (!confirmed) {
      return
    }

    await fetch(
      `${API_URL}/cards/${card.id}`,
      {
        method: 'DELETE'
      }
    )

    onChanged()
  }

  return (
    <article className="kudos-card">
      <img
        src={card.gifUrl}
        alt=""
        className="card-gif"
      />

      <div className="kudos-card-body">
        <p className="kudos-message">
          {card.message}
        </p>

        {card.author && (
          <p className="kudos-author">
            — {card.author}
          </p>
        )}

        <div className="card-actions">
          <button onClick={upvote}>
            ▲ {card.upvotes}
          </button>

          <button
            className="danger-button"
            onClick={remove}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}

export default KudosCard