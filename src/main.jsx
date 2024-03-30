import ReactDOM from 'react-dom/client'
import App from './App'

import { setContext } from '@apollo/client/link/context'
import { 
  ApolloProvider, ApolloClient, InMemoryCache, createHttpLink, split 
} from '@apollo/client'

import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

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

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000',
  })
)
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' && 
      definition.operation === 'suscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
)

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink
})


const rootElement = document.getElementById('root');
ReactDOM.createRoot(rootElement).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);