import { gql, useLazyQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      name
      phone 
      id
      address {
        street
        city
      }
    }
  }
`

const Persons = ({ persons }) => {
    const [getPerson, result] = useLazyQuery(FIND_PERSON)
    const [person, setPerson] = useState(null)

    const showPerson = (name) => {
      getPerson({ variables: { nameToSearch: name } })
    }

    useEffect(() => {
      if (result.data) {
        setPerson(result.data.findPerson)
      }
    }, [result])

    if (person) {
      return(
        <div>
          <h2>{person.name}</h2>
          <div>{person.address.street} {person.address.city}</div>
          <div>{person.phone}</div>
          <button onClick={() => setPerson(null)}>close</button>
        </div>
      )
    }

    return (
      <div>
        <h2>Persons</h2>
        {persons.map(p =>
          <div key={p.name}>
            {p.name} {p.phone}
            <button onClick={() => showPerson(p.name)} >
                show address
            </button> 
          </div>  
        )}
      </div>
    )
}

Persons.propTypes = {
 persons: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    phone: PropTypes.string,
    street: PropTypes.string,
    city: PropTypes.string,
 })).isRequired,
};

export default Persons