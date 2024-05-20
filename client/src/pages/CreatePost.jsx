import { Button, FileInput, Select, TextInput } from 'flowbite-react'
import React from 'react'
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'

const CreatePost = () => {
    return (
        <div className='p-3 max-w-3xl  min-h-screen'>
            <h1 className='text-center text-3xl my-5 font-semibold'>Create a post</h1>
            <form className='flex flex-col gap-4'>
                <div className='flex flex-col gap-4 sm:flex-row'>
                    <TextInput className='flex-1 ' type='text' placeholder='Title' required id='title'/>
                    <Select>
                        <option value={'uncategorized'}>Select a category</option>
                        <option value={'javascript'}>JavaScript</option>
                        <option value={'typescript'}>TypeScript</option>
                        <option value={'reactjs'}>React Js</option>
                        <option value={'nextjs'}>Next Js</option>
                    </Select>
                </div>
                <div className='border-4 border-cyan-400 p-2 flex justify-between items-center border-dotted'>
                    <FileInput type='file' accept='image/*'/>
                    <Button gradientDuoTone={'purpleToBlue'} size={'sm'} outline>Upload image</Button>
                </div>
                <ReactQuill theme='snow' placeholder='Write something...' className='h-72 mb-12' required />
                <Button type='submit' gradientDuoTone={'purpleToPink'}>Publish</Button>
            </form>
        </div>
    )
}

export default CreatePost