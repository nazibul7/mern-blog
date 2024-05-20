import React, { useEffect, useRef, useState } from 'react'
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Button, Modal, TextInput } from "flowbite-react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from '../firebase'
import { deletUserStart, deleteUserFailure, deleteUserSuccess, signOutSuccess, updateFailure, updateStart, updateSuccess } from '../redux/features/userSlice'
import { HiOutlineExclamationCircle } from "react-icons/hi"

const DashProfile = () => {
    const { currentUser, error: errorMessage, loading } = useSelector(state => state.user)
    console.log(currentUser);
    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
    const [imageFileUploadError, setImageFileUploadError] = useState(null)
    const [formData, setFormData] = useState({})
    const [updateUserSuccess, setUpdateUserSuccess] = useState(false)
    const [updateUserError, setUpdateUserError] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const dispatch = useDispatch()
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            setImageFileUrl(URL.createObjectURL(file))
        }
    }
    const handleSubmit = async (event) => {
        event.preventDefault()
        setUpdateUserError(false)
        setUpdateUserSuccess(false)
        if (Object.keys(formData).length == 0) {
            setUpdateUserError('No changes to be updated')
            return
        }
        try {
            dispatch(updateStart())
            const response = await fetch(`api/user/update/${currentUser._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            const data = await response.json()
            if (!response.ok) {
                dispatch(updateFailure(data.message))
                return
            } else {
                dispatch(updateSuccess(data))
                setUpdateUserSuccess("User profile updated successfully")
            }

        } catch (error) {
            dispatch(updateFailure(error.message))
        }
    }
    const filePickerRef = useRef()
    useEffect(() => {
        if (imageFile) {
            uploadeImage()
        }
    }, [imageFile])
    const handleChange = (event) => {
        setUpdateUserError(false)
        setUpdateUserSuccess(false)
        setFormData({ ...formData, [event.target.id]: event.target.value })
    }
    const uploadeImage = async () => {
        setImageFileUploadError(null)
        const storage = getStorage(app)
        const fileName = new Date().getTime() + imageFile.name
        const storageRef = ref(storage, fileName)
        const uploadtask = uploadBytesResumable(storageRef, imageFile)
        uploadtask.on("state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setImageFileUploadProgress(progress.toFixed(0))
            },
            (error) => {
                console.log(error);
                setImageFileUploadError("Could not upload image (File must be less tahn 2MB")
                setImageFileUploadProgress(null)
                setImageFile(null)
                setImageFileUrl(null)
            },
            () => {
                getDownloadURL(uploadtask.snapshot.ref).then((downloadUrl) => {
                    setImageFileUrl(downloadUrl)
                    setFormData({ ...formData, profilePicture: downloadUrl })
                })

            }
        )
    }
    const handleDeleteUser = async () => {
        setShowModal(false)
        try {
            dispatch(deletUserStart())
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: "DELETE"
            })
            const data = await res.json()
            if (!res.ok) {
                dispatch(deleteUserFailure(data.message))
            }
            else {
                dispatch(deleteUserSuccess(data))
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message))
        }
    }
    const handleSignOut = async () => {
        try {
            const res = await fetch(`/api/user/signout`, {
                method: 'POST'
            })
            const data = await res.json()
            if (!res.ok) {
                console.log(data.message)
            }
            else {
                dispatch(signOutSuccess(data))
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='flex flex-col p-5 mt-3 items-center w-full'>
            <h1 className='text-2xl font-semibold my-3 mb-5'>Profile</h1>
            <form onSubmit={handleSubmit} className='flex flex-col items-center gap-3 w-96'>
                <input type="file" accept='image/*' className='hidden' onChange={handleImageChange} ref={filePickerRef} />
                <img src={imageFileUrl || currentUser.profilePicture} alt="user" onClick={() => filePickerRef.current.click()}
                    className='cursor-pointer shadow-2xl rounded-full w-[65px] h-[65px] object-cover border-4 border-[#a9a7a7]' />
                {imageFileUploadError && <Alert color={'failure'}>{imageFileUploadError}</Alert>}
                <TextInput onChange={handleChange} className='w-full' type='text' id='username' placeholder='username' defaultValue={currentUser.username} />
                <TextInput onChange={handleChange} className='w-full' type='email' id='email' placeholder='email' defaultValue={currentUser.email} />
                <TextInput onChange={handleChange} className='w-full' type='password' id='password' placeholder='password' />
                <Button disabled={loading} type='submit' className='w-full' gradientDuoTone={'purpleToBlue'} outline>
                    {loading ? 'Loading...' : 'Update'}
                </Button>
                {currentUser.isAdmin && (
                    <Link to='/create-post' className='w-full'>
                        <Button type='button' gradientDuoTone={'purpleToBlue'} className='w-full'>
                            Create a post
                        </Button>
                    </Link>
                )}
            </form>
            <div className='w-96 mt-3 flex justify-between text-red-500 gap-10'>
                <span onClick={() => { setShowModal(true) }} className='cursor-pointer'>Delete Account</span>
                <span onClick={handleSignOut} className='cursor-pointer'>Sign Out</span>
            </div>
            {updateUserSuccess && (<Alert color={'success'} className='mt-3'>
                {updateUserSuccess}
            </Alert>)}
            {updateUserError && (<Alert color={'failure'} className='mt-3'>
                {updateUserError}
            </Alert>)}
            {errorMessage && (<Alert color={'failure'} className='mt-3'>
                {errorMessage}

            </Alert>)}
            <Modal show={showModal} onClose={() => { setShowModal(false) }} popup size={'md'}>
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-11 w-11 text-gray-400 dark:text-gray-200 mb-3 mx-auto' />
                        <h3 className='mb-4 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3>
                        <div className='flex justify-between'>
                            <Button color={'failure'} onClick={handleDeleteUser}>Yes I'm sure</Button>
                            <Button color={'gray'} onClick={() => setShowModal(false)}>No, cancel</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default DashProfile