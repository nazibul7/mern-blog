import { Button, Modal, Table } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import {FaCheck,FaTimes} from "react-icons/fa"
import { HiOutlineExclamationCircle } from "react-icons/hi"

const DashUsers = () => {
  const { currentUser } = useSelector((state) => state.user)
  const [users, setUsers] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [userIdToDelete, setUserIdToDelete] = useState('')
console.log(userIdToDelete);
console.log(users);
  useEffect(() => {
    if (currentUser?.isAdmin) {
      fetchusers()
    }
  }, [currentUser._id])
  const fetchusers = async () => {
    try {
      const res = await fetch(`/api/user/getusers`)
      const data = await res.json()
      if (res.ok) {
        setUsers(data.users)
      }
      if (data.users?.length < 5) {
        setShowMore(false)
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  const handleShowMore = async () => {
    const startIndex = users.length
    try {
      const res = await fetch(`/api/user/getuser?startIndex=${startIndex}`)
      const data = await res.json()
      setUsers((prev) => [...prev, ...data.users])
      if (data.users.length < 5) {
        setShowMore(false)
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleDeleteuser = async () => {
    setShowModal(false)
    try {
      const req = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: "DELETE"
      })
      const data = await req.json()
      if (!req.ok) {
        console.log(data.message);
      }
      else {
        setUsers((prev) =>
          prev.filter((user) => user._id !== userIdToDelete)
        )
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar'>
      <div>
        {(currentUser.isAdmin && users?.length > 0) ? (
          <>
            <Table hoverable className='shadow-md'>
              <Table.Head>
                <Table.HeadCell>Date created</Table.HeadCell>
                <Table.HeadCell>User image</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
                <Table.HeadCell>Email</Table.HeadCell>
                <Table.HeadCell>Admin</Table.HeadCell>
                <Table.HeadCell>delete</Table.HeadCell>
              </Table.Head>
              {users.map((user) => {
                return <Table.Body key={user._id} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell >{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell>
                        <img src={user.profilePicture} alt={user.username} className='w-10 h-10 rounded-full object-cover bg-gray-500' />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                    <Table.Cell>{user.email}</Table.Cell>
                    <Table.Cell>{user.isAdmin ? (<FaCheck className='text-green-400'/>):(<FaTimes className='text-red-500'/>)}</Table.Cell>
                    <Table.Cell>
                      <span onClick={() => {
                        setShowModal(true)
                        setUserIdToDelete(user._id)
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
          (<p>You have no users yet!</p>)}
      </div>
      <Modal show={showModal} onClose={() => { setShowModal(false) }} popup size={'md'}>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-11 w-11 text-gray-400 dark:text-gray-200 mb-3 mx-auto' />
            <h3 className='mb-4 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this user?</h3>
            <div className='flex justify-between'>
              <Button color={'failure'} onClick={handleDeleteuser}>Yes I'm sure</Button>
              <Button color={'gray'} onClick={() => setShowModal(false)}>No, cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashUsers