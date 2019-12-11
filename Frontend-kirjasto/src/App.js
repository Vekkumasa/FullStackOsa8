import React, { useState } from 'react'
import { Query, ApolloConsumer, Mutation, useMutation } from 'react-apollo'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { gql } from 'apollo-boost'

const CREATE_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String]) {
    addBook(
      title: $title,   
      author: $author,
      published: $published,
      genres: $genres
    ) {
      title
      author
      published
      id
      genres
    }
  }
`
const EDIT_BIRTHYEAR = gql`
  mutation editAuthor($name: String!, $born: Int!) {
    editAuthor(name: $name, born: $born) {
      name
      born
    }
  }
`

const ALL_AUTHORS = gql`
{
  allAuthors  {
    name
    bookCount
    id
    born
  }
}
`
const ALL_BOOKS = gql`
{
  allBooks  {
    title
    published
    id
    author
    genres
  }
}
`

const App = () => {
  const [page, setPage] = useState('authors')
  const [editAuthor] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [
      { query: ALL_AUTHORS }
    ]
  })

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <ApolloConsumer>
      {(client =>
        <Query query={ALL_AUTHORS}>
          {(result) =>
            <Authors 
            result={result} 
            editAuthor={editAuthor}
            client={client} 
            ALL_AUTHORS={ALL_AUTHORS}
            show={page === 'authors'} />
          }
        </Query>
      )}
    </ApolloConsumer>

    <ApolloConsumer>
      {(client =>
        <Query query={ALL_BOOKS}>
          {(result) =>
            <Books result={result} client={client} show={page === 'books'} />
          }
        </Query>
      )}
    </ApolloConsumer>

    <Mutation 
    mutation={CREATE_BOOK}
    refetchQueries={[{ query: ALL_BOOKS }]}
    >
      {(addBook) =>
      <NewBook
        addBook={addBook} show={page === 'add'}
      />
      }
    </Mutation>
    </div>
  )
}

export default App