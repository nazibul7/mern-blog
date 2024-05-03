import { Button, Label, TextInput } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

const Signup = () => {
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-2xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left side */}
        <div className='flex-1'>
          <Link to={'/'} className='text-4xl
            font-bold dark:text-white'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500
            via-purple-500 to-pink-500 rounded-lg text-white'>Nazibul's</span>
            Blog
          </Link>
          <p className='text-sm mt-5'>This is a demo project. You can sign up with your email and password
            or with Google.
          </p>
        </div>

        {/* right side */}

        <div className='flex-1'>
          <form>
            <div>
              <Label value='Username'></Label>
              <TextInput type='text' placeholder='Username' id='username' />
            </div>
            <div>
              <Label value='Email'></Label>
              <TextInput type='text' placeholder='Email' id='email' />
            </div>
            <div>
              <Label value='Password'></Label>
              <TextInput type='text' placeholder='Password' id='password' />
            </div>
            <div className='mt-3'>
              <Button gradientDuoTone='purpleToPink' className='w-full' type='submit'>
                Sign Up
              </Button>
            </div>
          </form>
          <div className='flex gap-2 text-sm mt-4'>
            <span>Have an account?</span>
            <Link to='/sign-in' className='text-blue-500'>Sign In</Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Signup