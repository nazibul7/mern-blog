import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Button, TextInput } from "flowbite-react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from '../firebase'
import { updateFailure, updateStart, updateSuccess } from '../redux/features/userSlice'

const DashProfile = () => {
    const { currentUser } = useSelector(state => state.user)
    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
    const [imageFileUploadError, setImageFileUploadError] = useState(null)
    const [formData, setFormData] = useState({})
    const [updateUserSuccess, setUpdateUserSuccess] = useState(false)
    const [updateUserError, setUpdateUserError] = useState(false)
    const dispatch = useDispatch()
    const { error: errorMessage } = useSelector(state => state.user)
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            setImageFileUrl(URL.createObjectURL(file))
        }
    }
    const handleSubmit = async (event) => {
        dispatch(updateStart())
        setUpdateUserError(false)
        setUpdateUserSuccess(false)
        event.preventDefault()
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
        dispatch(updateStart())
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
                <Button type='submit' className='w-full' gradientDuoTone={'purpleToBlue'} outline>
                    Update
                </Button>
            </form>
            <div className='w-96 mt-3 flex justify-between text-red-500 gap-10'>
                <span>Delete Account</span>
                <span>Sign Out</span>
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
        </div>
    )
}

export default DashProfile