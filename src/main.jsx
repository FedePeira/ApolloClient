import ReactDOM from 'react-dom/client'
import App from './App'
import { setContext } from '@apollo/client/link/context'
import { ApolloProvider, ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client'

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('phonenumbers-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }
})

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink)
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