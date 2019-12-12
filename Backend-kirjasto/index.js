require('dotenv').config()
const { ApolloServer, UserInputError, gql } = require('apollo-server')
const uuid = require('uuid/v1')
const mongoose = require('mongoose')
const Book = require('./Models/Book')
const Author = require('./Models/Author')

mongoose.set('useFindAndModify', false)

MONGODB_URI = process.env.MONGODB_URI

console.log('Connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to mongoDB')
  })
  .catch((error) => {
    console.log('error connection to mongoDB', error.message)
  })


const typeDefs = gql`
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
    id: ID!
    genres: [String!]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]
    allAuthors: [Author!]!
    findAuthor(name: String!): Author
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String]
    ): Book
    editAuthor(
      name: String!
      born: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    findAuthor: (root, args) => Author.findOne({ name: args.name }),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        return await Book.find({})
      } else {

        if (!args.author) {
          console.log('args', args)
          return Book.find({ genres: { $in: [args.genre]}})
        }

        if (!args.genre) {
          console.log('args', args)
          return Book.find({ author: { $in: [args.author] }})
        }
        else {
          console.log('args', args)
          return Book.find({ genres: { $in: [args.genre]} , author: { $in: [args.author]}})
          }
      }
    }, 
    
    allAuthors: () => Author.find({})
  },
  Author: {
    bookCount: async root => {     
      const kirjailija = await Author.findOne({ name: root.name })
      const books = await Book.collection.countDocuments({ author: kirjailija._id })
      return books
    }  
  },
  Book: {
    author: async (root) => {
      const author = await Author.find({ _id: root.author })
      return {
        name: author[0].name,
        born: author[0].born
      }
    }
  },

  Mutation: {
    addBook: async (root, args) => {
      const author = await Author.findOne({ name: args.author })
      const book = new Book({ ...args, author: author })
      
      try {
        await book.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }

      return book
    },

    editAuthor: async (root, args) => {
      console.log('args', args)
      const author = await Author.findOne({ name: args.name })
      console.log('Author', author)
      if (!author) {
        return null
      }
      console.log('Author', author)
      author.born = args.born
      
      
      try {
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return author
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})