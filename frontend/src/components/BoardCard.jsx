import { Link } from 'react-router-dom'

const BoardCard = ({ board, onDelete }) => {
  return (
    <article className="board-card">
      <Link to={`/boards/${board.id}`}>
        <img
          src={board.imageUrl}
          alt={board.title}
          className="board-image"
        />

        <div className="board-content">
          <span className="category-chip">
            {board.category.replace('-', ' ')}
          </span>

          <h2>{board.title}</h2>

          {board.author && (
            <p>by {board.author}</p>
          )}
        </div>
      </Link>

      <button
        className="delete-board"
        onClick={() => onDelete(board.id)}
      >
        Delete
      </button>
    </article>
  )
}

export default BoardCard