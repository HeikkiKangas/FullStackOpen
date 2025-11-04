const mongoose = require('mongoose')
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const { GraphQLError } = require('graphql/error')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI
const SECRET = 'secret'
//const SECRET = process.env.SECRET

mongoose.connect(MONGODB_URI)

const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String
    id: ID!
  }
  
  type Token {
    value: String!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }
  
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }
  
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    
    login(
      username: String!
      password: String!
    ): Token
  }
  
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }
`

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

      return await book.populate('author')
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
    createUser: async (root, { username }) => {
      const user = new User({ username })
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

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const auth = req ? req?.headers?.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
