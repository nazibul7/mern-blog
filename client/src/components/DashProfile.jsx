import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Alert, Button, TextInput } from "flowbite-react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from '../firebase'

const DashProfile = () => {
    const { currentUser } = useSelector(state => state.user)
    const x = currentUser?.rest
    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
    const [imageFileUploadError, setImageFileUploadError] = useState(null)
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            setImageFileUrl(URL.createObjectURL(file))
        }
    }
    const filePickerRef = useRef()
    useEffect(() => {
        if (imageFile) {
            uploadeImage()
        }
    }, [imageFile])
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
                })

            }
        )
    }
    return (
        <div className='flex flex-col p-5 mt-3 items-center w-full'>
            <h1 className='text-2xl font-semibold my-3 mb-5'>Profile</h1>
            <form className='flex flex-col items-center gap-3 w-96'>
                <input type="file" accept='image/*' className='hidden' onChange={handleImageChange} ref={filePickerRef} />
                <img src={imageFileUrl || x?.profilePicture || currentUser.profilePicture} alt="user" onClick={() => filePickerRef.current.click()}
                    className='cursor-pointer shadow-2xl rounded-full w-[65px] h-[65px] object-cover border-4 border-[#a9a7a7]' />
                {imageFileUploadError && <Alert color={'failure'}>{imageFileUploadError}</Alert>}
                <TextInput className='w-full' type='text' id='username' placeholder='username' defaultValue={x?.username || currentUser.username} />
                <TextInput className='w-full' type='email' id='email' placeholder='email' defaultValue={x?.email || currentUser.email} />
                <TextInput className='w-full' type='password' id='password' placeholder='password' />
                <Button type='submit' className='w-full' gradientDuoTone={'purpleToBlue'} outline>
                    Update
                </Button>
            </form>
            <div className='w-96 mt-3 flex justify-between text-red-500 gap-10'>
                <span>Delete Account</span>
                <span>Sign Out</span>
            </div>
        </div>
    )
}

export default DashProfile