import React from 'react'
import { useSelector } from 'react-redux'
import { Button, TextInput } from "flowbite-react"

const DashProfile = () => {
    const { currentUser } = useSelector(state => state.user)
    const { profilePicture, username, email } = currentUser.rest
    return (
        <div className='flex flex-col p-5 mt-3 items-center w-full'>
            <h1 className='text-2xl font-semibold my-3 mb-5'>Profile</h1>
            <form className='flex flex-col items-center gap-3 w-96'>
                <img src={profilePicture} alt="user"
                    className='cursor-pointer shadow-2xl rounded-full w-[60px] object-cover border-4 border-[#a9a7a7]' />
                <TextInput className='w-full' type='text' id='username' placeholder='username' defaultValue={username} />
                <TextInput className='w-full' type='email' id='email' placeholder='email' defaultValue={email} />
                <TextInput className='w-full' type='password' id='password' placeholder='password' />
                <Button type='submit' className='w-full' gradientDuoTone={'purpleToBlue'} outline>
                    Update
                </Button>
            </form>
            <div className='w-96 flex justify-between text-red-500 gap-10'>
                <span>Delete Account</span>
                <span>Sign Out</span>
            </div>
        </div>
    )
}

export default DashProfile