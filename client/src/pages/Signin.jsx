import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInFailure, signInStart, signInSuccess } from '../redux/features/userSlice'
import { useDispatch, useSelector } from "react-redux"
import OAuth from "../components/OAuth"
import BlogForgeLogo from '../components/BlogForgeLogo'

const Signin = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({})
  const { loading, error: errorMessage } = useSelector(state => state.user)
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value.trim() });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill out all the fields"))
    }
    try {
      dispatch(signInStart())
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success == false) {
        dispatch(signInFailure(data.message))
      }
      if (res.ok) {
        dispatch(signInSuccess(data))
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='flex p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto min-h-screen'>
        <div className='flex flex-col md:flex-row md:gap-12 lg:gap-16 w-full my-auto'>

          {/* Left side - Brand */}
          <div className='flex-1 md:flex flex-col justify-center mb-8 md:mb-0 hidden'>
            <Link to={'/'} className='flex items-center tracking-tight text-3xl sm:text-4xl font-bold'>
              <BlogForgeLogo size='xl' showText={false} />
              <span className='px-2 py-1 ml-[-15px] bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 transition-all'>
                BlogForge
              </span>
            </Link>
            <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-5'>
              Publish your ideas. Read freely.
            </p>

            {/* Additional info for desktop */}
            <div className='hidden md:block mt-8 space-y-4'>
              <div className='flex items-start gap-3'>
                <div className='w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0'>
                  <span className='text-purple-600 dark:text-purple-400'>✓</span>
                </div>
                <div>
                  <h3 className='font-semibold text-gray-800 dark:text-gray-200'>Share Your Ideas</h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>Publish blog posts and reach thousands of readers</p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <div className='w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0'>
                  <span className='text-purple-600 dark:text-purple-400'>✓</span>
                </div>
                <div>
                  <h3 className='font-semibold text-gray-800 dark:text-gray-200'>Free Access</h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>Read and comment on posts without an account</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className='flex-1 max-w-md mx-auto w-full'>
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8'>
              <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-900 dark:text-white">
                Sign In
              </h2>
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2 mb-6">
                Welcome back! Sign in to continue publishing your blog posts.
                <br className='hidden sm:inline' />
                <span className='sm:inline'> </span>
                You can read & comment without an account.
              </p>

              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <Label htmlFor='email' value='Email' className='mb-2 block' />
                  <TextInput
                    onChange={handleChange}
                    type='email'
                    placeholder='name@example.com'
                    id='email'
                    sizing='lg'
                  />
                </div>

                <div>
                  <Label htmlFor='password' value='Password' className='mb-2 block' />
                  <TextInput
                    onChange={handleChange}
                    type='password'
                    placeholder='••••••••'
                    id='password'
                    sizing='lg'
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  gradientDuoTone='purpleToPink'
                  className='w-full'
                  type='submit'
                  disabled={loading}
                  size='lg'
                >
                  {loading ? (
                    <>
                      <Spinner size='sm' />
                      <span className='pl-2'>Loading...</span>
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <OAuth />
              </form>

              <div className='flex justify-center gap-2 text-sm mt-3 text-gray-600 dark:text-gray-400'>
                <span>Don't have an account?</span>
                <Link to='/sign-up' className='text-blue-600 dark:text-blue-400 hover:underline font-medium'>
                  Sign Up
                </Link>
              </div>

              {errorMessage && (
                <Alert className='mt-4' color='failure'>
                  {errorMessage}
                </Alert>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;