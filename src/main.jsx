import ReactDOM from 'react-dom/client'
import App from './App'

import { ApolloProvider, ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000',
  })
})

const query = gql`
query {
  allPersons  {
    name,
    phone,
    address {
      street,
      city
    }
    id
  }
}
`

client.query({ query })
  .then((response) => {
    console.log(response.data)
})

const rootElement = document.getElementById('root');
ReactDOM.createRoot(rootElement).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);