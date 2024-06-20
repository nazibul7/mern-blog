import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PostCard from '../components/PostCard'

const Home = () => {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getPosts`)
        const data = await res.json()
        if (res.ok) {
          setPosts(data.post)
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchPost()
  }, [])
  return (
    <div>
      <div className='flex flex-col gap-4 p-20 mx-auto max-w-3xl'>
        <h1 className='text-3xl font-bold lg:text-4xl'>Welcome to my Blog</h1>
        <p className='text-gray-500 text-xs sm:text-sm'>
          Here you'll find variety of articles and tutorials
          on topics such as web development,software engineering, and programming language
        </p>
        <Link to={'/search'} className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'>
          View all posts
        </Link>
      </div>
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-5 py-5'>
        {posts?.length > 0 && (
          <div className='flex flex-col gap-5'>
            <h2 className='text-center text-2xl font-semibold'>Recent Posts</h2>
            <div className='flex flex-wrap gap-3 mx-auto w-full'>
              {posts.map((post) => {
                return <PostCard key={post._id} post={post} />
              })}
            </div>
            <Link to={'/search'} className='text-xs sm:text-sm text-teal-500 text-center font-bold hover:underline'>
              View all posts
            </Link>
          </div>
        )
        }
      </div>
    </div>
  )
}

export default Home