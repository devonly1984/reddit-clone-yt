import { useQuery } from '@apollo/client'
import { GET_ALL_POSTS } from '../graphql/queries'
import Post from './Post'


const Feed = () => {
  const {data} = useQuery(GET_ALL_POSTS)
  const posts = data?.getPostList

  return (
    <div>
      {posts?.map((post: Post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  )
}

export default Feed
