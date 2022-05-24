import '../styles/globals.css'

import { ApolloProvider } from '@apollo/client'
import type { AppProps } from 'next/app'
import Header from '../components/Header'
import { SessionProvider } from 'next-auth/react'
import client from '../apollo-client'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <SessionProvider session={session}>
        <div className="h-screen overflow-y-scroll bg-slate-200">
          <Header />
          <Component {...pageProps} />
        </div>
      </SessionProvider>
    </ApolloProvider>
  )
}

export default MyApp
