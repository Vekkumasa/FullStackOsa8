import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { Query, ApolloConsumer, Mutation, useMutation } from 'react-apollo'
import Select from 'react-select'
import { useApolloClient } from '@apollo/react-hooks'

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
  const [author, setAuthor] = useState('')
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  if (!show) {
    return null
  }
  
  if ( result.loading ) {
    return <div>loading...</div>
  }

  console.log('AUTHORS', result)

  const authors = result.data.allAuthors
  const options = authors.map(a => {
    return {
      value: a.name,
      label: a.name
    }
  })

  const valinta = (author) => {
    setAuthor(author)  
    console.log('name', author)
    setName(author.value)
  }
  
  console.log('Authors', authors)

  const submit = async (e) => {
    e.preventDefault()
    console.log('name', author , 'born',  born)
    await editAuthor({
      variables: { name, born }
    })
    setBorn('')
    setName('')
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
              <Select
              options={options}
              value={author}
              onChange={valinta}
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