import { useMutation, useQuery } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import ReactTimeago from 'react-timeago'
import Avatar from '../../components/Avatar'
import Post from '../../components/Post'
import { ADD_COMMENT } from '../../graphql/mutations'
import { GET_POST_BY_POST_ID } from '../../graphql/queries'
type FormData = {
  comment: string
}
const PostPage = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>()
  const { data, error, loading } = useQuery(GET_POST_BY_POST_ID, {
    variables: {
      post_id: router.query.postId,
    },
  })
  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [GET_POST_BY_POST_ID, 'getPostListByPostId'],
  })
  const post: Post = data?.getPostListByPostId

  const { data: session } = useSession()

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    //post comment
    console.log('Submit handler', data)
    const notification = toast.loading('Posting your comment...')
    await addComment({
      variables: {
        post_id: router.query.postId,
        username: session?.user?.name,
        text: data.comment,
      },
    })
    setValue('comment', '')
    toast.success('Comment Successfully Added', {
      id: notification,
    })
  }
  console.log('postID', post)
  return (
    <div className="mx-auto my-7 max-w-5xl">
      <Post post={post} />
      <div className="-mt-1 rounded-b-md border border-t-0 border-gray-300 bg-white p-5 pl-16">
        <p className="text-sm">
          Comments as{' '}
          <span className="text-red-500">{session?.user?.name}</span>
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-2"
        >
          <textarea
            disabled={!session}
            {...register('comment')}
            className="h-24 rounded-md border border-gray-200 p-2 pl-4 outline-none disabled:bg-gray-50"
            placeholder={
              session ? 'What are your thoughts' : 'Please sign in to comment'
            }
          />
          <button
            type="submit"
            className="rounded-full bg-red-500 p-3 font-semibold text-white disabled:bg-gray-200"
          >
            Comment
          </button>
        </form>
      </div>
      <div className="-my-5 rounded-b-md border border-t-0 border-gray-300 bg-white py-5 px-10">
        <hr className="py-2" />
        {post?.comments?.length > 0 &&
          post?.comments?.map((comment: Comment) => (
            <div
              className="relative flex items-center space-x-2 space-y-5"
              key={comment.id}
            >
              <hr />
              <div>
                <Avatar seed={comment.username} />
              </div>
              <div className="flex flex-col">
                <p>
                  <span>{comment.username}</span>
                  <ReactTimeago date={comment.created_at} />
                </p>
                <p>{comment.text}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default PostPage
