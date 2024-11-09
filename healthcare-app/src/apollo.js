// src/apollo.js
import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'https://grown-longhorn-84.hasura.app/v1/graphql',
});

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      'x-hasura-admin-secret': 'sPaSSN6Qtmb0FRYslriTw33aoGj0a40XGhwGzCVqNu0psUxNqLsM6Z7UaeCUMlDC',
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      patients: {
        fields: {
          lab_results: {
            merge: false, // Don't merge arrays, replace them
          }
        }
      },
      Query: {
        fields: {
          patients: {
            // Merge function for search results
            merge(existing, incoming) {
              return incoming; // Always use new data for search results
            }
          }
        }
      }
    },
    addTypename: true
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only', // Don't cache search results
      nextFetchPolicy: 'cache-first'
    },
    query: {
      fetchPolicy: 'network-only' // Don't cache one-time queries
    }
  }
});

export const ApolloWrapper = ({ children }) => (
  <ApolloProvider client={client}>
    {children}
  </ApolloProvider>
);