import React, { useState } from 'react'
import { gql } from 'apollo-boost'

const FIND_AUTHOR = gql`
  query findAuthorByName($nameToSearch: String!) {
    findAuthor(name: $nameToSearch) {
      name
      id
      bookCount
      born
    }
  }
`

const Authors = ({ result, client, editAuthor, show }) => {
  const [author, setAuthor] = useState(null)
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const authors = []

  if (!show) {
    return null
  }
  
  if ( result.loading ) {
    return <div>loading...</div>
  }

  const submit = async (e) => {
    e.preventDefault()
    console.log('name', name , 'born',  born)

    await editAuthor({
      variables: { name, born }
    })
  }
  
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {result.data.allAuthors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>

      <br/>
      <h2>Set Birthyear</h2>
        
          <form onSubmit={submit}>
            <div>
              Name:
              <input value={name}
              onChange={({ target }) => setName(target.value)}
              />
            </div>
            <div>
              Born:
              <input
              type='Number' 
              value={born}
              onChange={({ target }) => setBorn(parseInt(target.value))}
              />
            </div>
            <button type='submit'>edit</button>
          </form>

    </div>
    
  )
}

export default Authors