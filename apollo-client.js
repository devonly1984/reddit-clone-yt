import { ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: 'http://localhost:5001/api/binging-pronghorn',
  headers: {
    Authorization: `Apikey ${process.env.NEXT_PUBLIC_STEPZEN_APIKEY}`,
  },
  cache: new InMemoryCache(),
})

export default client
