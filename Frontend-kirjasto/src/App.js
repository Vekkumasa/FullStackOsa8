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
      author {
        name
        born
      }
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
query allBooks($genre: String) {
  allBooks(genre: $genre)  {
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
  const [user, setUser] = useState('')
  const apolloClient = useApolloClient()

  const handleError = (error) => {
    setErrorMessage(error.graphQLErrors[0].message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }
  
  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)
  const [addBook] = useMutation(CREATE_BOOK, {
    onError: handleError,
    refetchQueries: [
      { query: ALL_BOOKS },
      { query: ALL_AUTHORS }
    ]
  })
  const [editAuthor] = useMutation(EDIT_BIRTHYEAR, {
    onError: handleError,
    refetchQueries: [
      { query: ALL_AUTHORS }
    ]
  })

  const [login] = useMutation(LOGIN, {
    onError: handleError
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    apolloClient.resetStore()
    setUser('')
  }

  const errorNotification = () => errorMessage &&
    <div style={{ color: 'red' }}>
      {errorMessage}
    </div>

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {user === '' ? 
        <button onClick={() => setPage('loginForm')}>Log In</button> 
        :
        <div>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={logout}>log out!</button>
        </div>
      }
        
      </div>

    <br/>
    {errorMessage &&
    <div style={{ color: 'red' }}>
      {errorMessage}
      </div>
    }
      
    <h5>User: {user} </h5>

    <Authors 
      result={authors} 
      editAuthor={editAuthor} 
      show={page === 'authors'} 
    />

    <Books 
      result={books} 
      show={page === 'books'} 
    />
    
    <NewBook
      addBook={addBook} 
      show={page === 'add'}
      setPage={setPage}
      user={user}
    />

    <LoginForm
      show={page === 'loginForm'}
      setPage={setPage}
      login={login}
      user={user}
      setUser={setUser}
      setToken={(token) => setToken(token)}
      />
    <br/>
    <br/>
    
    </div>
  )
}

export default App