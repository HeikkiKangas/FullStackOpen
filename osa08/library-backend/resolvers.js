const { GraphQLError } = require('graphql/error')
const User = require('./models/user')
const Author = require('./models/author')
const Book = require('./models/book')
const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const { PubSub } = require('graphql-subscriptions')

const pubsub = new PubSub()

const resolvers = {
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) { throw new GraphQLError('Not authorized') }
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        const newAuthor = new Author({ name: args.author })
        try {
          author = await newAuthor.save()
        } catch (e) {
          throw new GraphQLError('Saving author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              e
            }
          })
        }
      }

      const newBook = new Book({ ...args, author })
      let book
      try {
        book = await newBook.save()
      } catch (e) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            e
          }
        })
      }
      book = await book.populate('author')

      pubsub.publish('BOOK_ADDED', { bookAdded: book })

      return book
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) { throw new GraphQLError('Not authorized', { extensions: { code: 'BAD_USER_INPUT' } }) }
      const author = await Author.findOne({ name: args.name })
      if (author) {
        author.born = args.setBornTo
        await author.save()
      }
      return author

    },
    login: async (root, { username, password }) => {
      const user = await User.findOne({ username })
      if (!user || password !== 'password') {
        throw new GraphQLError('Invalid credentials', { extensions: { code: 'BAD_USER_INPUT' } })
      }
      const userForToken = { username, id: user._id }
      return { value: jwt.sign(userForToken, SECRET) }
    },
    createUser: async (root, { username, favoriteGenre }) => {
      const user = new User({ username, favoriteGenre })
      return user.save().catch(e => {
        throw new GraphQLError('Saving user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: username,
            e
          }
        })
      })
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED')
    }
  },
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args?.author && args?.genre) {
        const books = await Book.find({ genres: args.genre }).populate('author')
        return books.filter(b => b.author.name === args.author)
      } else if (args?.genre) {
        return await Book.find({ genres: args.genre }).populate('author')
      } else if (args?.author) {
        const books = await Book.find({}).populate('author')
        return books.filter(b => b.author.name === args.author)
      }
      return await Book.find({}).populate('author')
    },
    allAuthors: async () => await Author.find({}),
    me: async (root, args, context) => context.currentUser
  },
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({ 'author': root._id })
      return books.length
    }
  }
}

module.exports = resolvers