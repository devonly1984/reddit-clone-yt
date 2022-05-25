import { useQuery } from '@apollo/client'
import { GET_ALL_POSTS } from '../graphql/queries'
import Post from './Post'

const Feed = () => {
  const data = useQuery(GET_ALL_POSTS)
  console.log('Feed Comp', data)

  return (
    <div>
      {/**{posts?.map((post) => (
        <Post key={post.id} post={post} />
      ))}*/}
    </div>
  )
}

export default Feed
