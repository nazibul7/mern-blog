import { Button } from 'flowbite-react'
import React from 'react'
import { AiFillGoogleCircle } from "react-icons/ai"
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/features/userSlice'
import { useNavigate } from 'react-router-dom'

const OAuth = () => {
    const auth = getAuth(app)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: "select_account" })
        try {
            const resultFromGoogle = await signInWithPopup(auth, provider)
            // console.log(resultFromGoogle);
            const res = await fetch('api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: resultFromGoogle.user.displayName,
                    email: resultFromGoogle.user.email,
                    googlePhotoUrl: resultFromGoogle.user.photoURL
                }),
            })
            const data =await res.json()
            if (res.ok) {
                dispatch(signInSuccess(data))
                console.log(data);
                navigate('/')
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Button onClick={handleGoogleClick} className='w-full mt-2' type='button' gradientDuoTone='pinkToOrange' outline>
            <AiFillGoogleCircle className='w-6 h-6 mr-2' />
            Continue with Google
        </Button>
    )
}

export default OAuth