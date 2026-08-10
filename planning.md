# Kudos Board Planning

## 1. Component Architecture

### App
- Handles application routing
- Displays shared Header and Footer components
- Routes users between the Home page and individual Board pages

### HomePage
- Fetches and displays kudos boards
- Handles search and category filtering
- Handles the Recent filter
- Refreshes boards after creating or deleting a board

### BoardPage
- Displays one selected board
- Fetches the cards belonging to that board
- Allows users to create, upvote, and delete kudos cards

### Header
- Displays the Kudos Board branding
- Provides navigation back to the homepage

### Footer
- Displays basic application footer content

### SearchBar
- Accepts a board title search
- Allows users to submit or clear the search

### FilterBar
- Allows users to filter boards by:
  - All
  - Recent
  - Celebration
  - Thank You
  - Inspiration

### BoardCard
- Displays a board image/GIF, title, category, and author
- Links to the selected board
- Allows the board to be deleted

### BoardForm
- Allows users to create a board
- Requires a title, category, and image/GIF
- Allows an optional author

### GifPicker
- Searches the GIPHY API
- Displays GIF results
- Allows users to select a GIF for a board or kudos card

### CardForm
- Allows users to create a kudos card
- Requires a message and GIF
- Allows an optional author
- Includes the AI Kudos Writer

### AIKudosWriter
- Accepts context and a selected tone
- Sends the request to the backend AI endpoint
- Places the generated kudos message into the editable message field

### KudosCard
- Displays a kudos message, GIF, author, and upvote count
- Allows repeated upvotes
- Allows deletion


## 2. API Contracts

### GET /boards
Returns all boards.

Optional query parameters:
- `category`
- `search`
- `recent=true`

Success:
- `200 OK`
- Array of board objects

### GET /boards/:id
Returns one board.

Success:
- `200 OK`

Errors:
- `400 Invalid board ID`
- `404 Board not found`

### POST /boards
Creates a board.

Request body:

```json
{
  "title": "We Shipped It",
  "category": "celebration",
  "author": "Nana",
  "imageUrl": "https://example.com/image.gif"
}