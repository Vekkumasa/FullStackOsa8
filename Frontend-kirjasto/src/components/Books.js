import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from '@apollo/react-hooks'

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

const Books = ( {result, client, show} ) => {
  const [genre, setGenre] = useState('all')

  const rajatut = useQuery(ALL_BOOKS, {
    variables: { genre: genre }
  })

  if (!show) {
    return null
  }

  if ( result.loading ) {
    return <div>loading...</div>
  }

  const haku = (genre) => () => {
    setGenre(genre)
  }

  const kaikki = []
  result.data.allBooks.forEach(b => {
    b.genres.forEach(g => {
      kaikki.push(g)
    })
  })
  const noDupes = new Set(kaikki)
  const genret = [...noDupes]

  return (
    <div>
      <h2>Books</h2>

      <button onClick={() => setGenre('all')}>all genres</button>
      {genret.map(genre =>
          <button key={genre} onClick={haku(genre)}>{genre}</button>
        )}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {genre === 'all' ?
          result.data.allBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.published}</td>
            </tr>
          )
          :
          rajatut.data.allBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.published}</td>
            </tr>
          )
          }
          
        </tbody>
      </table>
    
  </div>
  )
}

export default Books