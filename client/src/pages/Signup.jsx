import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({})
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value.trim() })
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage("Please fill out all the fields")
    }
    try {
      setLoading(true)
      setErrorMessage(null)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json()
      if (data.success == false) {
        return setErrorMessage(data.message)
      }
      setLoading(false)
      if(res.ok){
        navigate('/sign-in')
      }
    } catch (error) {
      setErrorMessage(error.message)
      setLoading(false)
    }
  }
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
              <TextInput onChange={handleChange} type='text' placeholder='Username' id='username' />
            </div>
            <div>
              <Label value='Email'></Label>
              <TextInput onChange={handleChange} type='email' placeholder='Email' id='email' />
            </div>
            <div>
              <Label value='Password'></Label>
              <TextInput onChange={handleChange} type='password' placeholder='Password' id='password' />
            </div>
            <div className='mt-3'>
              <Button onClick={handleSubmit} gradientDuoTone='purpleToPink' className='w-full' type='submit'
                disabled={loading} >
                {loading ? (
                  <>
                    <Spinner size={'sm'} />
                    <span className='pl-2'>Loading...</span>
                  </>
                ) : "Sign Up"}
              </Button>
            </div>
          </form>
          <div className='flex gap-2 text-sm mt-4'>
            <span>Have an account?</span>
            <Link to='/sign-in' className='text-blue-500'>Sign In</Link>
          </div>
          {errorMessage && (
            <Alert className='mt-4' color={'failure'}>
              {errorMessage}
            </Alert>
          )}
        </div>

      </div>
    </div>
  )
}

export default Signup