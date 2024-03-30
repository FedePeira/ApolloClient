import { gql, useQuery } from '@apollo/client'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Notify from './components/Notify'
import PhoneForm from './components/PhoneForm'
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

  const result = useQuery(ALL_PERSONS, {
    pollInterval: 2000
  })

  if (result.loading)  {
    return <div>loading...</div>
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  console.log(result.data.allPersons)

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <Persons persons={result.data.allPersons}/>
      <PersonForm setError={notify}/>
      <PhoneForm setError={notify}/>
    </div>
  )
}

export default App