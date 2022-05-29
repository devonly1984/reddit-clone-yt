import Head from 'next/head'
import type { NextPage } from 'next'
import PostBox from '../components/PostBox'
import Feed from '../components/Feed'
import { GET_SUBREDDITS_WITH_LIMIT } from '../graphql/queries'
import { useQuery } from '@apollo/client'
import { Subreddit } from '../typings'
import SubRedditRow from '../components/SubRedditRow'

const Home: NextPage = () => {
  const { data } = useQuery(GET_SUBREDDITS_WITH_LIMIT, {
    variables: {
      limit: 10,
    },
  })
  const subreddits: Subreddit[] = data?.getSubredditListLimit

  return (
    <div className="my-7 mx-auto max-w-5xl">
      <Head>
        <title>Reddit Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PostBox />
      <div className="flex">
        <Feed />
        <div className="top-36mx-5 sticky mt-5 hidden h-fit min-w-[300px] rounded-md border border-gray-300 bg-white lg:inline">
          <p className="text-md mb-1 p-4 pb-3 font-bold">Top Communitites</p>
          <div>
            {subreddits?.map((subreddit, index) => (
              <SubRedditRow
                key={subreddit.id}
                topic={subreddit.topic}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
