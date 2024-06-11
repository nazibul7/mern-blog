import React, { useEffect, useState } from 'react'
import moment from "moment"

const Comment = ({ comment }) => {
    console.log(comment);
    const [user, setUser] = useState({})
    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`)
                const data = await res.json()
                if (res.ok) {
                    setUser(data)
                }
            } catch (error) {
                console.log(error);
            }
        }
        getUser()
    }, [])
    return (
        <div className='flex items-center gap-3 mb-2 border-b p-4 dark:border-gray-600 text-sm'>
            <div className='flex-shrink-0'>
                <img className='w-10 h-10 rounded-full bg-gray-200' src={user.profilePicture} alt={user.username} />
            </div>
            <div className='flex-1'>
                <span className='font-bold mr-1 text-xs truncate'>{user ? `@${user.username}` : 'anonymous user'}</span>
                <span className='text-gray-500 text-xs'>{moment(comment.createdAt).fromNow()}</span>
                <p>{comment.commentContent}</p>
            </div>
        </div>
    )
}

export default Comment