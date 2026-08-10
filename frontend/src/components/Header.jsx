import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="site-header">
      <Link to="/" className="logo">
        ✨ Kudos Board
      </Link>

      <p>Celebrate people while they are here to hear it.</p>
    </header>
  )
}

export default Header