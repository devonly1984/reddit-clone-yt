import { ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: "https://liverpool.stepzen.net/api/binging-pronghorn/__graphql",
  headers: {
    Authorization: `Apikey ${process.env.NEXT_PUBLIC_STEPZEN_APIKEY}`,
  },
  cache: new InMemoryCache(),
})

export default client
