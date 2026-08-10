require('dotenv').config()

const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding Kudos Board...')

  // Clear existing data so we get a clean starter set
  await prisma.card.deleteMany()
  await prisma.board.deleteMany()

  const celebration = await prisma.board.create({
    data: {
      title: 'We Shipped It 🎉',
      category: 'celebration',
      author: 'Kudos Team',
      imageUrl:
        'https://media.giphy.com/media/26tOZ42Mg6pbTUPHW/giphy.gif'
    }
  })

  const thankYou = await prisma.board.create({
    data: {
      title: 'People Who Came Through 💙',
      category: 'thank-you',
      author: 'Kudos Team',
      imageUrl:
        'https://media.giphy.com/media/3oz8xIsloV7zOmt81G/giphy.gif'
    }
  })

  const inspiration = await prisma.board.create({
    data: {
      title: 'Keep Going 🚀',
      category: 'inspiration',
      author: 'Kudos Team',
      imageUrl:
        'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif'
    }
  })

  await prisma.card.createMany({
    data: [
      {
        message:
          'Huge shoutout to the whole team for pushing through the final stretch and getting this across the finish line.',
        author: 'Nana',
        gifUrl:
          'https://media.giphy.com/media/11sBLVxNs7v6WA/giphy.gif',
        upvotes: 14,
        boardId: celebration.id
      },
      {
        message:
          'You absolutely crushed this project. The effort, focus, and execution really showed.',
        author: 'Project Team',
        gifUrl:
          'https://media.giphy.com/media/g9582DNuQppxC/giphy.gif',
        upvotes: 9,
        boardId: celebration.id
      },
      {
        message:
          'Thank you for staying late and helping everyone get unstuck when things got hectic.',
        author: 'A grateful teammate',
        gifUrl:
          'https://media.giphy.com/media/26gsjCZpPolPr3sBy/giphy.gif',
        upvotes: 11,
        boardId: thankYou.id
      },
      {
        message:
          'You are the type of person who makes the whole team better just by showing up and caring.',
        author: 'Anonymous',
        gifUrl:
          'https://media.giphy.com/media/3oz8xAFtqoOUUrsh7W/giphy.gif',
        upvotes: 7,
        boardId: thankYou.id
      },
      {
        message:
          'The progress you have made is crazy. Keep going because you are nowhere near your ceiling yet.',
        author: 'Your biggest supporter',
        gifUrl:
          'https://media.giphy.com/media/ely3apij36BJhoZ234/giphy.gif',
        upvotes: 18,
        boardId: inspiration.id
      },
      {
        message:
          'Every difficult step is still a step forward. Stay locked in and trust the work.',
        author: 'Anonymous',
        gifUrl:
          'https://media.giphy.com/media/nbvFVPiEiJH6JOGIok/giphy.gif',
        upvotes: 12,
        boardId: inspiration.id
      }
    ]
  })

  console.log('Starter boards and cards created!')
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })