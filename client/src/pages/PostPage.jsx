import { Button, Spinner } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useParams,Link } from 'react-router-dom'
import CommentSection from './CommentSection'
import PostCard from '../components/PostCard'

const PostPage = () => {
    const { postSlug } = useParams()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [post, setPost] = useState(null)
    const [recentPost,setrecentPost]=useState(null)
    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/post/getposts?slug=${postSlug}`)
                const data = await res.json()
                if (!res.ok) {
                    setError(true)
                    setLoading(false)
                    return
                }
                else {
                    setPost(data.post[0])
                    setLoading(false)
                    setError(false)
                }
            } catch (error) {
                setError(true)
                setLoading(false)
            }
        }
        fetchPost()
    }, [postSlug])
    useEffect(()=>{
        const fetchRecentPost=async()=>{
            try {
                const res=await fetch(`/api/post/getposts?limit=3`)
                const data=await res.json()
                if(res.ok){
                    setrecentPost(data.post)
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchRecentPost()
    },[])
    if (loading) return (
        <div className='flex items-center min-h-screen justify-center'>
            <Spinner size={'xl'} />
        </div>
    )
    return (
        <div className='min-h-screen p-3 mx-auto flex flex-col'>
            <h1 className='text-center text-2xl p-2 mt-5 lg:text-3xl'>{post?.title}</h1>
            <Link to={`/search?category=${post?.category}`} className='self-center mt-5'>
                <Button size={'xs'} color={'gray'} pill className='capitalize'>{post?.category}</Button>
            </Link>
            <img src={post?.image} alt={post?.title} className='mt-7 p-3 max-h-[400px] w-full object-cover' />
            <div className='p-3 flex justify-between text-xs mx-auto w-full border-b border-slate-500'>
                <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                <span>{post && (post.content.length/1000).toFixed(0)} mins read</span>
            </div>
            <div className='p-2 mx-auto w-full post-content' dangerouslySetInnerHTML={{__html:post?.content}}>

            </div>
            <CommentSection postId={post._id}/>

           {/* ____________ Recent Articles___________ */}

            <div className='flex flex-col mb-3 justify-center items-center'>
                <h1 className='text-lg text-center'>Recent Articles</h1>
                <div className='flex flex-wrap gap-3 mt-3 justify-center'>
                    {recentPost && 
                        recentPost.map((post)=>{
                            return <PostCard key={post._id} post={post}/>
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default PostPage