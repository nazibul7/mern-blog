
import React, { useEffect, useState } from 'react'
import moment from "moment"
import { FaThumbsUp } from "react-icons/fa"
import { useSelector } from 'react-redux'
import { Button, Textarea } from 'flowbite-react'

const Comment = ({ comment, onLike,onEdit }) => {
    const { currentUser } = useSelector(state => state.user)
    const [user, setUser] = useState({})
    console.log(comment);
    const [isEditing, setIsEditing] = useState(false)
    const [editedContent, setEditedContent] = useState('')
    console.log(editedContent);
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
    }, [comment])
    const handleEdit = () => {
        setIsEditing(true)
        setEditedContent(comment.commentContent)
    }
    const handleSave=async()=>{
        try {
            const res=await fetch(`/api/comment/editComment/${comment._id}`,{
                method:"PUT",
                headers:{
                    'Content-Type':"application/json"
                },
                body:JSON.stringify({
                    content:editedContent
                })
            })
            const data=(await res.json());
            console.log(data);
            if(res.ok){
                setIsEditing(false)
                onEdit(comment,editedContent)
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='flex items-center gap-3 mb-2 border-b p-4 dark:border-gray-600 text-sm'>
            <div className='flex-shrink-0'>
                <img className='w-10 h-10 rounded-full bg-gray-200' src={user.profilePicture} alt={user.username} />
            </div>
            <div className='flex-1'>
                <div>
                    <span className='font-bold mr-1 text-xs truncate'>{user ? `@${user.username}` : 'anonymous user'}</span>
                    <span className='text-gray-500 text-xs'>{moment(comment.createdAt).fromNow()}</span>
                </div>
                {isEditing ? (
                    <>
                        <Textarea onChange={(e) => setEditedContent(e.target.value)} rows='3' className='w-full p-2 resize-none focus:outline-none focus:bg-gray-100' value={editedContent} />
                        <div className='flex justify-end gap-2 mt-1 text-sm '>
                            <Button onClick={handleSave} type='button' size={'xs'} gradientDuoTone={'purpleToBlue'}>
                                Save
                            </Button>
                            <Button onClick={()=>setIsEditing(false)} type='button' size={'xs'} gradientDuoTone={'purpleToBlue'} outline>
                                Cancel
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <p>{comment.commentContent}</p>
                        <div className='flex items-center gap-2 text-xs'>
                            <button type='button' onClick={() => { onLike(comment._id) }} className={`text-gray-400 hover:text-blue-500 
                                 ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'
                                }`}>
                                <FaThumbsUp className='text-xs' />
                            </button>
                            <p className='text-gray-400'>
                                {
                                    comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (
                                        comment.numberOfLikes == 1 ? "like" : "likes"
                                    )
                                }
                            </p>
                            {
                                currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) &&
                                (
                                    <button onClick={handleEdit} type='button' className='text-gray-400 hover:text-blue-500'>
                                        Edit
                                    </button>
                                )
                            }
                        </div>
                    </>
                )}

            </div>
        </div>
    )
}

export default Comment