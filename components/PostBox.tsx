import { ADD_POST, ADD_SUBREDDIT } from '../graphql/mutations'
import { LinkIcon, PhotographIcon } from '@heroicons/react/outline'
import { useMutation, useQuery } from '@apollo/client'

import Avatar from './Avatar'
import { GET_SUBREDDIT_BY_TOPIC } from '../graphql/queries'
import client from '../apollo-client'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

type FormData = {
  postTitle: string
  postBody: string
  postImage: string
  subreddit: string
}

const PostBox = () => {
  const { data: session } = useSession()
  const [imageBoxOpen, setImageBoxOpen] = useState(false)
  const [addPost] = useMutation(ADD_POST)
  const [addSubreddit] = useMutation(ADD_SUBREDDIT)
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>()
  const onSubmit = handleSubmit(async (formData) => {
    console.log(formData)
    try {
      const {
        data: { getSubredditListByTopic },
      } = await client.query({
        query: GET_SUBREDDIT_BY_TOPIC,
        variables: {
          topic: formData.subreddit,
        },
      })
      const subredditExists = getSubredditListByTopic.length > 0
      if (!subredditExists) {
        //create
        const {
          data: { insertSubreddit: newSubreddit },
        } = await addSubreddit({
          variables: {
            topic: formData.subreddit,
          },
        })
        console.log('Creating post...', formData)
        const image = formData.postImage || ''
        const {
          data: { insertPost: newPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            subreddit_id: newSubreddit.id,
            title: formData.postTitle,
            username: session?.user?.name,
          },
        })
        console.log('New Post added:', newPost)
      } else {
        //use existing
        console.log(getSubredditListByTopic)
        const image = formData.postImage || ''
        const {
          data: { insertPost },
        } = await addPost({
          variables: {
            body: formData.postBody,
            image: image,
            subreddit_id: getSubredditListByTopic[0].id,
            title: formData.postTitle,
            username: session?.user?.name,
          },
        })
      }
      setValue('postBody', '')
      setValue('postImage', '')
      setValue('postTitle', '')
      setValue('subreddit', '')
    } catch (error) {}
  })
  return (
    <form
      onSubmit={onSubmit}
      className="broder-gray-300 sticky top-16 z-50 rounded-md border bg-white p-2"
    >
      <div className="flex items-center space-x-3">
        <Avatar seed="sonny" large />

        <input
          {...register('postTitle', { required: true })}
          type="text"
          placeholder={
            session ? 'Create a post by entering a title' : 'Sign in to Post'
          }
          disabled={!session}
          className="flex-1 rounded-md bg-gray-50 p-2 pl-5 outline-none"
        />
        <PhotographIcon
          onClick={() => setImageBoxOpen(!imageBoxOpen)}
          className={`h-6 cursor-pointer text-gray-300 ${
            imageBoxOpen && 'text-blue-300'
          }`}
        />
        <LinkIcon className="h-6 text-gray-300" />
      </div>
      {!!watch('postTitle') && (
        <div className="flex flex-col py-2">
          {/**Body */}
          <div className="flex items-center px-2">
            <p className="min-w-[90px]">Body:</p>
            <input
              type="text"
              className="m-2 flex-1 bg-blue-50 outline-none"
              placeholder="Text (optional)"
              {...register('postBody')}
            />
          </div>
          <div className="flex items-center px-2">
            <p className="min-w-[90px]">SubReddit:</p>
            <input
              type="text"
              className="m-2 flex-1 bg-blue-50 outline-none"
              placeholder="i.e. reactjs"
              {...register('subreddit', { required: true })}
            />
          </div>
          {imageBoxOpen && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">SubReddit:</p>
              <input
                type="text"
                className="m-2 flex-1 bg-blue-50 outline-none"
                placeholder="Optional..."
                {...register('postImage')}
              />
            </div>
          )}
          {/**Errors */}
          {Object.keys(errors).length > 0 && (
            <div className="space-y-2 p-2 text-red-500">
              {errors.postTitle?.type === 'required' && (
                <p>Post Ttile is required</p>
              )}
              {errors.subreddit?.type === 'required' && (
                <p>Subreddit is required</p>
              )}
            </div>
          )}
          {!!watch('postTitle') && (
            <button
              type="submit"
              className="w-full rounded-full bg-blue-400 p-2 text-white"
            >
              Create Post
            </button>
          )}
        </div>
      )}
    </form>
  )
}

export default PostBox
