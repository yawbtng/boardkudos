require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')

const app = express()
const PORT = process.env.PORT || 3001

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
})

const prisma = new PrismaClient({ adapter })

app.use(cors())
app.use(express.json())

console.log(
  'OpenRouter configured:',
  Boolean(process.env.OPENROUTER_API_KEY)
)

// HOME
app.get('/', (req, res) => {
  res.send('Welcome to the Kudos Board API!')
})

// =========================
// BOARDS
// =========================

// GET ALL BOARDS
app.get('/boards', async (req, res) => {
  try {
    const { category, search, recent } = req.query

    const where = {}

    if (category && category !== 'all') {
      where.category = category
    }

    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive'
      }
    }

    const boards = await prisma.board.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      ...(recent === 'true' && {
        take: 6
      })
    })

    res.json(boards)
  } catch (error) {
    console.error('GET /boards error:', error)

    res.status(500).json({
      error: 'Failed to retrieve boards'
    })
  }
})

// GET ONE BOARD
app.get('/boards/:id', async (req, res) => {
  try {
    const boardId = Number(req.params.id)

    if (!Number.isInteger(boardId)) {
      return res.status(400).json({
        error: 'Invalid board ID'
      })
    }

    const board = await prisma.board.findUnique({
      where: {
        id: boardId
      }
    })

    if (!board) {
      return res.status(404).json({
        error: 'Board not found'
      })
    }

    res.json(board)
  } catch (error) {
    console.error('GET /boards/:id error:', error)

    res.status(500).json({
      error: 'Failed to retrieve board'
    })
  }
})

// CREATE BOARD
app.post('/boards', async (req, res) => {
  try {
    const {
      title,
      category,
      author,
      imageUrl
    } = req.body

    if (!title?.trim() || !category || !imageUrl?.trim()) {
      return res.status(400).json({
        error: 'Title, category, and image are required'
      })
    }

    const allowedCategories = [
      'celebration',
      'thank-you',
      'inspiration'
    ]

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        error: 'Invalid board category'
      })
    }

    const board = await prisma.board.create({
      data: {
        title: title.trim(),
        category,
        author: author?.trim() || null,
        imageUrl: imageUrl.trim()
      }
    })

    res.status(201).json(board)
  } catch (error) {
    console.error('POST /boards error:', error)

    res.status(500).json({
      error: 'Failed to create board'
    })
  }
})

// UPDATE BOARD
app.put('/boards/:id', async (req, res) => {
  try {
    const boardId = Number(req.params.id)

    if (!Number.isInteger(boardId)) {
      return res.status(400).json({
        error: 'Invalid board ID'
      })
    }

    const existingBoard = await prisma.board.findUnique({
      where: {
        id: boardId
      }
    })

    if (!existingBoard) {
      return res.status(404).json({
        error: 'Board not found'
      })
    }

    const {
      title,
      category,
      author,
      imageUrl
    } = req.body

    const updatedBoard = await prisma.board.update({
      where: {
        id: boardId
      },
      data: {
        ...(title !== undefined && {
          title: title.trim()
        }),

        ...(category !== undefined && {
          category
        }),

        ...(author !== undefined && {
          author: author?.trim() || null
        }),

        ...(imageUrl !== undefined && {
          imageUrl: imageUrl.trim()
        })
      }
    })

    res.json(updatedBoard)
  } catch (error) {
    console.error('PUT /boards/:id error:', error)

    res.status(500).json({
      error: 'Failed to update board'
    })
  }
})

// DELETE BOARD
app.delete('/boards/:id', async (req, res) => {
  try {
    const boardId = Number(req.params.id)

    if (!Number.isInteger(boardId)) {
      return res.status(400).json({
        error: 'Invalid board ID'
      })
    }

    const board = await prisma.board.findUnique({
      where: {
        id: boardId
      }
    })

    if (!board) {
      return res.status(404).json({
        error: 'Board not found'
      })
    }

    await prisma.board.delete({
      where: {
        id: boardId
      }
    })

    res.status(204).send()
  } catch (error) {
    console.error('DELETE /boards/:id error:', error)

    res.status(500).json({
      error: 'Failed to delete board'
    })
  }
})

// =========================
// CARDS
// =========================

// GET CARDS FOR BOARD
app.get('/boards/:id/cards', async (req, res) => {
  try {
    const boardId = Number(req.params.id)

    if (!Number.isInteger(boardId)) {
      return res.status(400).json({
        error: 'Invalid board ID'
      })
    }

    const board = await prisma.board.findUnique({
      where: {
        id: boardId
      }
    })

    if (!board) {
      return res.status(404).json({
        error: 'Board not found'
      })
    }

    const cards = await prisma.card.findMany({
      where: {
        boardId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json(cards)
  } catch (error) {
    console.error('GET /boards/:id/cards error:', error)

    res.status(500).json({
      error: 'Failed to retrieve cards'
    })
  }
})

// CREATE CARD
app.post('/cards', async (req, res) => {
  try {
    const {
      message,
      gifUrl,
      author,
      boardId
    } = req.body

    if (
      !message?.trim() ||
      !gifUrl?.trim() ||
      boardId === undefined
    ) {
      return res.status(400).json({
        error: 'Message, GIF, and boardId are required'
      })
    }

    const parsedBoardId = Number(boardId)

    if (!Number.isInteger(parsedBoardId)) {
      return res.status(400).json({
        error: 'Invalid board ID'
      })
    }

    const board = await prisma.board.findUnique({
      where: {
        id: parsedBoardId
      }
    })

    if (!board) {
      return res.status(404).json({
        error: 'Board not found'
      })
    }

    const card = await prisma.card.create({
      data: {
        message: message.trim(),
        gifUrl: gifUrl.trim(),
        author: author?.trim() || null,
        boardId: parsedBoardId
      }
    })

    res.status(201).json(card)
  } catch (error) {
    console.error('POST /cards error:', error)

    res.status(500).json({
      error: 'Failed to create card'
    })
  }
})

// UPDATE CARD
app.put('/cards/:id', async (req, res) => {
  try {
    const cardId = Number(req.params.id)

    if (!Number.isInteger(cardId)) {
      return res.status(400).json({
        error: 'Invalid card ID'
      })
    }

    const existingCard = await prisma.card.findUnique({
      where: {
        id: cardId
      }
    })

    if (!existingCard) {
      return res.status(404).json({
        error: 'Card not found'
      })
    }

    const {
      message,
      gifUrl,
      author
    } = req.body

    const updatedCard = await prisma.card.update({
      where: {
        id: cardId
      },
      data: {
        ...(message !== undefined && {
          message: message.trim()
        }),

        ...(gifUrl !== undefined && {
          gifUrl: gifUrl.trim()
        }),

        ...(author !== undefined && {
          author: author?.trim() || null
        })
      }
    })

    res.json(updatedCard)
  } catch (error) {
    console.error('PUT /cards/:id error:', error)

    res.status(500).json({
      error: 'Failed to update card'
    })
  }
})

// UPVOTE CARD
app.patch('/cards/:id/upvote', async (req, res) => {
  try {
    const cardId = Number(req.params.id)

    if (!Number.isInteger(cardId)) {
      return res.status(400).json({
        error: 'Invalid card ID'
      })
    }

    const card = await prisma.card.findUnique({
      where: {
        id: cardId
      }
    })

    if (!card) {
      return res.status(404).json({
        error: 'Card not found'
      })
    }

    const updatedCard = await prisma.card.update({
      where: {
        id: cardId
      },
      data: {
        upvotes: {
          increment: 1
        }
      }
    })

    res.json(updatedCard)
  } catch (error) {
    console.error('PATCH /cards/:id/upvote error:', error)

    res.status(500).json({
      error: 'Failed to upvote card'
    })
  }
})

// DELETE CARD
app.delete('/cards/:id', async (req, res) => {
  try {
    const cardId = Number(req.params.id)

    if (!Number.isInteger(cardId)) {
      return res.status(400).json({
        error: 'Invalid card ID'
      })
    }

    const card = await prisma.card.findUnique({
      where: {
        id: cardId
      }
    })

    if (!card) {
      return res.status(404).json({
        error: 'Card not found'
      })
    }

    await prisma.card.delete({
      where: {
        id: cardId
      }
    })

    res.status(204).send()
  } catch (error) {
    console.error('DELETE /cards/:id error:', error)

    res.status(500).json({
      error: 'Failed to delete card'
    })
  }
})

// =========================
// OPENROUTER AI
// =========================

app.post('/ai/kudos', async (req, res) => {
  try {
    const {
      prompt,
      tone = 'warm'
    } = req.body

    if (!prompt?.trim()) {
      return res.status(400).json({
        error: 'Prompt is required'
      })
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(503).json({
        error: 'AI is not configured'
      })
    }

    const allowedTones = [
      'warm',
      'funny',
      'professional',
      'enthusiastic',
      'heartfelt'
    ]

    const selectedTone = allowedTones.includes(tone)
      ? tone
      : 'warm'

    const openRouterResponse = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',

        headers: {
          Authorization:
            `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          model: 'openrouter/free',

          messages: [
            {
              role: 'system',
              content:
                'You write short, natural, thoughtful kudos messages. Return only the kudos message.'
            },
            {
              role: 'user',
              content: `
Write a kudos message using the context below.

Context:
${prompt.trim()}

Tone:
${selectedTone}

Requirements:
- 1 to 3 sentences
- natural and specific
- no hashtags
- do not mention AI
- return only the kudos message
              `.trim()
            }
          ]
        })
      }
    )

    const data = await openRouterResponse.json()

    if (!openRouterResponse.ok) {
      console.error(
        'OpenRouter response error:',
        data
      )

      return res.status(openRouterResponse.status).json({
        error:
          data?.error?.message ||
          'OpenRouter request failed'
      })
    }

    const message =
      data?.choices?.[0]?.message?.content?.trim()

    if (!message) {
      console.error(
        'Unexpected OpenRouter response:',
        data
      )

      return res.status(500).json({
        error: 'AI did not return a message'
      })
    }

    res.json({
      message
    })
  } catch (error) {
    console.error('AI route error:', error)

    res.status(500).json({
      error: 'Unable to generate kudos'
    })
  }
})

// 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found'
  })
})

// START SERVER
app.listen(PORT, () => {
  console.log(
    `Kudos Board API running on http://localhost:${PORT}`
  )
})
