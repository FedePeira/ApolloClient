import { gql, useApolloClient, useQuery } from '@apollo/client'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Notify from './components/Notify'
import PhoneForm from './components/PhoneForm'
import LoginForm from './components/LoginForm'
import { useState } from 'react'

const ALL_PERSONS = gql`
  query AllPersons {
    allPersons {
      name
      phone
      address {
        street
        city
      }
      id
    }
  }
`

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)
  const result = useQuery(ALL_PERSONS, {
    pollInterval: 2000
  })
  const client = useApolloClient()

  if (result.loading)  {
    return <div>loading...</div>
  }
  
  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }
  
  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }


  if(!token) {
    return(
      <>
        <Notify errorMessage={errorMessage}/>
        <h2>Login</h2>
        <LoginForm 
          setToken={setToken}
          setError={notify}/>
      </>
    )
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <button onClick={logout}>logout</button>
      <Persons persons={result.data.allPersons}/>
      <PersonForm setError={notify}/>
      <PhoneForm setError={notify}/>
    </div>
  )
}

export default App