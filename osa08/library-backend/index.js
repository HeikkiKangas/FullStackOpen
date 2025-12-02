const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const config = require('./config')
const mongoose = require('mongoose')
const { ApolloServer } = require('@apollo/server')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const express = require('express')
const http = require('http')
const cors = require('cors')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { expressMiddleware } = require('@as-integrations/express5')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')


mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((e) => {
    console.log('Failed to connect to MongoDB:', e.message)
  })

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/'
  })

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  })

  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            }
          }
        }
      }
    ]
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(
      server,
      {
        context: async ({ req }) => {
          const auth = req ? req?.headers?.authorization : null
          if (auth && auth.startsWith('Bearer ')) {
            const decodedToken = jwt.verify(
              auth.substring(7),
              config.SECRET
            )
            const currentUser = await User.findById(decodedToken.id)
            return { currentUser }
          }
        }
      }
    )
  )

  const PORT = 4000

  httpServer.listen(PORT, () => console.log(`Listening on ${PORT}`))
}

start()
