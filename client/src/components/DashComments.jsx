import { Button, Modal, Table } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import {FaCheck,FaTimes} from "react-icons/fa"
import { HiOutlineExclamationCircle } from "react-icons/hi"

const DashComments = () => {
  const { currentUser } = useSelector((state) => state.user)
  const [comments, setComments] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [commentIdToDelete, setCommentIdToDelete] = useState('')
// console.log(commentIdToDelete);
// console.log(comments);
  useEffect(() => {
    if (currentUser?.isAdmin) {
      fetchComments()
    }
  }, [currentUser._id])
  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comment/getcomments`)
      const data = await res.json()
      console.log(data);
      if (res.ok) {
        setComments(data.comments)
      }
      if (data.comments?.length < 5) {
        setShowMore(false)
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  const handleShowMore = async () => {
    const startIndex = comments.length
    try {
      const res = await fetch(`/api/user/getcomments?startIndex=${startIndex}`)
      const data = await res.json()
      setComments((prev) => [...prev, ...data.comments])
      if (data.comments.length < 5) {
        setShowMore(false)
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleDeleteComment = async () => {
    setShowModal(false)
    try {
      const req = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, {
        method: "DELETE"
      })
      const data = await req.json()
      if (!req.ok) {
        console.log(data.message);
      }
      else {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        )
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar'>
      <div>
        {(currentUser.isAdmin && comments?.length > 0) ? (
          <>
            <Table hoverable className='shadow-md'>
              <Table.Head>
                <Table.HeadCell>Date created</Table.HeadCell>
                <Table.HeadCell>Comment Content</Table.HeadCell>
                <Table.HeadCell>Number of likes</Table.HeadCell>
                <Table.HeadCell>PostId</Table.HeadCell>
                <Table.HeadCell>UserId</Table.HeadCell>
                <Table.HeadCell>delete</Table.HeadCell>
              </Table.Head>
              {comments.map((comment) => {
                return <Table.Body key={comment._id} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell >{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>{comment.commentContent}</Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                    <Table.Cell>{comment.postId}</Table.Cell>
                    <Table.Cell>{comment.userId}</Table.Cell>
                    <Table.Cell>
                      <span onClick={() => {
                        setShowModal(true)
                        setCommentIdToDelete(comment._id)
                      }} className='font-medium text-red-500 hover:underline cursor-pointer'>
                        Delete
                      </span>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              })}
            </Table>
            {showMore && (
              <button onClick={handleShowMore} className='w-full text-teal-500 mx-auto py-4 text-sm'>
                Show more
              </button>
            )}
          </>
        ) :
          (<p>You have no comments yet!</p>)}
      </div>
      <Modal show={showModal} onClose={() => { setShowModal(false) }} popup size={'md'}>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-11 w-11 text-gray-400 dark:text-gray-200 mb-3 mx-auto' />
            <h3 className='mb-4 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this comment?</h3>
            <div className='flex justify-between'>
              <Button color={'failure'} onClick={handleDeleteComment}>Yes I'm sure</Button>
              <Button color={'gray'} onClick={() => setShowModal(false)}>No, cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashComments