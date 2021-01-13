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

const Recommended = ( {result, client, show, me} ) => {

    if (!show) {
      return null
    }

    if ( result.loading ) {
        return <div>loading...</div>
      }    
    
    const books = result.data.allBooks.filter(a => {
        return a.genres.includes(me.data.me.favoriteGenre)
    })
    
    return (
      <div>
        <h2>Books</h2>
  
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
            
            {books.map(a =>
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.published}</td>
              </tr>
            )}
            
          </tbody>
        </table>
      
    </div>
    )
  }
  
  export default Recommended