import React from 'react'
import { gql } from 'apollo-boost'

const Books = ( {result, client, show} ) => {

  if (!show) {
    return null
  }

  if ( result.loading ) {
    return <div>loading...</div>
  }

  console.log('RESULT', result.data.allBooks)

  return (
    <div>
      <h2>books</h2>

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
          {result.data.allBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Books