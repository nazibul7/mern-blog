import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase"
import { useNavigate } from 'react-router-dom'

const CreatePost = () => {
    const [file, setFile] = useState(null)
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
    const [imageFileUploadError, setImageFileUploadError] = useState(null)
    const [formData, setFormData] = useState({})
    const [publishError, setPublishError] = useState(null)
    const navigate = useNavigate()
    const handleInputChange = (event) => {
        setFormData({ ...formData, [event.target.id]: event.target.value })
    }
    console.log(formData);
    const handleUploadImage = async (event) => {
        event.preventDefault()
        try {
            if (!file) return
            setImageFileUploadError(null)
            const storage = getStorage(app)
            const filename = new Date().getTime() + file.name
            const storageRef = ref(storage, filename)
            const UploadTask = uploadBytesResumable(storageRef, file)
            UploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    setImageFileUploadProgress(progress.toFixed(0))
                },
                (error) => {
                    setImageFileUploadError("Image upload failed")
                    setImageFileUploadProgress(null)
                    console.log(error);
                },
                () => {
                    getDownloadURL(UploadTask.snapshot.ref).then((downLoadURL) => {
                        setImageFileUploadProgress(null)
                        setImageFileUploadError(null)
                        setFormData({ ...formData, image: downLoadURL })
                    })
                }
            )
        } catch (error) {
            setImageFileUploadError("Image uplaod failed")
            setImageFileUploadProgress(null)
            console.log(error);
        }
    }
    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const res = await fetch('/api/post/create', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (!res.ok) {
                setPublishError(data.message)
            }
            if (res.ok) {
                setPublishError(null)
                setFormData({})
                navigate(`/post/${data.slug}`)
            }
        } catch (error) {
            setPublishError("Something went wrong")
        }
    }
    return (
        <div className='p-3 max-w-3xl mx-auto  min-h-screen'>
            <h1 className='text-center text-3xl my-5 font-semibold'>Create a post</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-4 sm:flex-row'>
                    <TextInput onChange={handleInputChange} className='flex-1 ' type='text' placeholder='Title' required id='title' />
                    <Select onChange={handleInputChange} id='category'>
                        <option value={'uncategorized'}>Select a category</option>
                        <option value={'javascript'}>JavaScript</option>
                        <option value={'typescript'}>TypeScript</option>
                        <option value={'reactjs'}>React Js</option>
                        <option value={'nextjs'}>Next Js</option>
                    </Select>
                </div>
                <div className='border-4 border-cyan-400 p-2 flex justify-between items-center border-dotted'>
                    <FileInput type='file' accept='image/*' onChange={(e) => e.target.files[0]} />
                    <Button onClick={handleUploadImage} gradientDuoTone={'purpleToBlue'} size={'sm'} outline>Upload image</Button>
                </div>
                {imageFileUploadError && (
                    <Alert color={'failure'}>
                        {imageFileUploadError}
                    </Alert>
                )}
                {formData.image && (
                    <img src={formData.image} alt='upload' className='w-full h-60 mb-12 object-cover' />
                )}
                <ReactQuill onChange={(value) => setFormData({ ...formData, content: value })} theme='snow' placeholder='Write something...' className='h-72 mb-12' required />
                <Button type='submit' gradientDuoTone={'purpleToPink'}>Publish</Button>
                {
                    publishError && <Alert className='mt-3' color={'failure'}>{publishError}</Alert>
                }
            </form>
        </div>
    )
}

export default CreatePost