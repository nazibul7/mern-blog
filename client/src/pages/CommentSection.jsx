import { Alert, Button, Textarea } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { Link, useNavigate } from 'react-router-dom';
import Comment from '../components/Comment';

const CommentSection = ({ postId }) => {
    const { currentUser } = useSelector(state => state.user)
    const [comment, setComment] = useState('')
    const [commentError, setCommentError] = useState(null)
    const [comments, setComments] = useState([])
    const navigate = useNavigate()
    const handleSubmit = async (event) => {
        event.preventDefault()
        if (comment.length > 200) return
        try {
            const res = await fetch(`/api/comment/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ commentContent: comment, postId, userId: currentUser._id })
            })
            const data = await res.json()
            console.log(data);
            if (res.ok) {
                setComment('')
                setCommentError(null)
            }
        } catch (error) {
            console.log(error);
            setCommentError(error.message)
        }
    }
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comment/getPostComments/${postId}`)
                const data = await res.json()
                if (res.ok) {
                    setComments(data)
                }
            } catch (error) {
                console.log(error);
                setCommentError(error.message)
            }
        }
        fetchComments()
    }, [postId, comment])
    const handleLike = async (commentId) => {
        try {
            if (!currentUser) {
                navigate('/sign-in')
                return
            }
            const res = await fetch(`/api/comment/likeComment/${commentId}`, {
                method: "PUT"
            })
            if (res.ok) {
                const data = await res.json()
                console.log(data);
                setComments(comments.map(comment => {
                    return comment._id == commentId ? {
                        ...comment, likes: data.likes,
                        numberOfLikes: data.numberOfLikes
                    } : comment
                }))
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleEdit=async(comment,editedContent)=>{
        setComments(comments.map(c=>{
            return c._id==comment._id?{...c,commentContent:editedContent}:c
        }))
    }
    return (
        <div className='w-full mx-auto p-3'>
            {currentUser ?
                (
                    <div className='flex items-center gap-1 text-gray-500 text-sm'>
                        <p>Signed in as:</p>
                        <img className='h-7 w-7 object-cover rounded-full' src={currentUser.profilePicture} alt="" />
                        <Link className='text-sm text-cyan-600 hover:underline' to={'/dashboard?tab=profile'}>
                            @{currentUser.username}
                        </Link>
                    </div>
                )
                : (
                    <div className='text-sm text-teal-400 my-5 flex gap-1'>
                        You must be signed in to comment.
                        <Link className='text-blue-500 hover:underline' to={'/sign-in'}>Sign In</Link>
                    </div>
                )}
            {currentUser && (
                <>
                    <form onSubmit={handleSubmit} className='border p-3 border-teal-500 rounded mt-3'>
                        <Textarea placeholder='Add a comment...'
                            value={comment}
                            rows={'3'}
                            maxLength={'200'}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <div className='flex justify-between items-center mt-3'>
                            <p className='text-sm text-gray-500'>{200 - comment.length} characters remaining</p>
                            <Button type='submit' gradientDuoTone={'purpleToBlue'} outline>Submit</Button>
                        </div>
                    </form>
                    {commentError && <Alert color={'failure'} className='mt-3'>
                        {commentError}
                    </Alert>}
                </>
            )}
            {comments.length === 0 ? (
                <p className='text-sm my-3'>No comments yet!</p>
            ) : (
                <>
                    <div className='text-sm flex items-center my-3 gap-2'>
                        <p>Comments</p>
                        <p className='border px-2 py-1 rounded-sm'>{comments.length}</p>
                    </div>
                    {
                        comments.map(comment => (
                            <Comment key={comment._id} onEdit={handleEdit} onLike={handleLike} comment={comment} />
                        ))
                    }
                </>
            )}
        </div>
    )
}

export default CommentSection