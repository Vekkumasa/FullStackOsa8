import React, { useState } from 'react'
import { Query, ApolloConsumer, Mutation } from 'react-apollo'
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { gql } from 'apollo-boost'
import LoginForm from './components/LoginForm'

const LOGIN = gql`
  mutation login ($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

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
    author {
      name
      born
    }
    genres
  }
}
`

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('authors')
  const [editAuthor] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [
      { query: ALL_AUTHORS }
    ]
  })
  const [user, setUser] = useState('')
  const apolloClient = useApolloClient()

  const handleError = (error) => {
    setErrorMessage(error.graphQLErrors[0].message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    apolloClient.resetStore()
  }

  const [login] = useMutation(LOGIN, {
    onError: handleError
  })

  const errorNotification = () => errorMessage &&
    <div style={{ color: 'red' }}>
      {errorMessage}
    </div>

  const testi = () => {
    console.log(token)
    console.log(user)
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('loginForm')}>Log In</button>
      </div>
      
      <h5>User: {user} </h5>

      <ApolloConsumer>
      {(client =>
        <Query query={ALL_AUTHORS}>
          {(result) =>
            <Authors 
            result={result} 
            editAuthor={editAuthor}
            client={client} 
            show={page === 'authors'} />
          }
        </Query>
      )}
    </ApolloConsumer>

    <ApolloConsumer>
      {(client =>
        <Query query={ALL_BOOKS}>
          {(result) =>
            <Books 
            result={result} 
            client={client} 
            show={page === 'books'} 
            />
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
        addBook={addBook} 
        show={page === 'add'}
      />
      }
    </Mutation>

    <LoginForm
      show={page === 'loginForm'}
      login={login}
      user={user}
      setUser={setUser}
      setToken={(token) => setToken(token)}
      />
    <br/>
    <br/>
    
    <button onClick={logout}>log out!</button>
    <br/>
    <br/>
    
    <button onClick={testi}>testi</button>
    
    </div>
  )
}

export default App