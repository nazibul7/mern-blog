import { Button, Modal, Table } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from "react-icons/hi"

const DashPosts = () => {
  const { currentUser } = useSelector((state) => state.user)
  const [userPosts, setUserPosts] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [postIdToDelete, setPostIdToDelete] = useState('')

  useEffect(() => {
    if (currentUser?.isAdmin) {
      fetchPosts()
    }
  }, [currentUser._id])
  const fetchPosts = async () => {
    try {
      const res = await fetch(`/api/post/getposts?userId=${currentUser?._id}`)
      const data = await res.json()
      if (res.ok) {
        setUserPosts(data.post)
      }
      if (data.post.length <= 5) {
        setShowMore(false)
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  const handleShowMore = async () => {
    const startIndex = userPosts.length
    try {
      const res = await fetch(`/api/post/getposts?userId=${currentUser?._id}&startIndex=${startIndex}`)
      const data = await res.json()
      setUserPosts((prev) => [...prev, ...data.post])
      if (data.post.length < 5) {
        setShowMore(false)
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleDeletePost = async () => {
    setShowModal(false)
    try {
      const req = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
        method: "DELETE"
      })
      const data = await req.json()
      if (!req.ok) {
        console.log(data.message);
      }
      else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        )
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar'>
      <div>
        {(currentUser.isAdmin && userPosts.length > 0) ? (
          <>
            <Table hoverable className='shadow-md'>
              <Table.Head>
                <Table.HeadCell>Date Updated</Table.HeadCell>
                <Table.HeadCell>Post image</Table.HeadCell>
                <Table.HeadCell>post title</Table.HeadCell>
                <Table.HeadCell>category</Table.HeadCell>
                <Table.HeadCell>delete</Table.HeadCell>
                <Table.HeadCell>edit</Table.HeadCell>
              </Table.Head>
              {userPosts.map((post) => {
                return <Table.Body key={post._id} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell >{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>
                      <Link>
                        <img src={post.image} alt="" className='w-20 h-10 object-cover bg-gray-500' />
                      </Link>
                    </Table.Cell>
                    <Table.Cell><Link to={`/post/${post.slug}`}>{post.title}</Link></Table.Cell>
                    <Table.Cell>{post.category}</Table.Cell>
                    <Table.Cell>
                      <span onClick={() => {
                        setShowModal(true)
                        setPostIdToDelete(post._id)
                      }} className='font-medium text-red-500 hover:underline cursor-pointer'>
                        Delete
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link className='text-teal-500  hover:underline' to={`/update-post/${post._id}`}>
                        <span>Edit</span>
                      </Link>
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
          (<p>You have no post yet!</p>)}
      </div>
      <Modal show={showModal} onClose={() => { setShowModal(false) }} popup size={'md'}>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-11 w-11 text-gray-400 dark:text-gray-200 mb-3 mx-auto' />
            <h3 className='mb-4 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3>
            <div className='flex justify-between'>
              <Button color={'failure'} onClick={handleDeletePost}>Yes I'm sure</Button>
              <Button color={'gray'} onClick={() => setShowModal(false)}>No, cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashPosts