import { Alert, Button, Textarea } from 'flowbite-react';
import React, { useState } from 'react'
import { useSelector } from "react-redux"
import { Link } from 'react-router-dom';

const CommentSection = ({ postId }) => {
    const { currentUser } = useSelector(state => state.user)
    const [comment, setComment] = useState('')
    const [commentError, setCommentError] = useState(null)
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
        </div>
    )
}

export default CommentSection