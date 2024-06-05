import { Sidebar } from 'flowbite-react'
import { HiUser, HiArrowSmRight,HiDocumentText,HiOutlineUserGroup } from 'react-icons/hi'
import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { signOutSuccess } from '../redux/features/userSlice'
import { useDispatch, useSelector } from 'react-redux'

const DashSidebar = () => {
    const location = useLocation()
    const [tab, setTab] = useState('')
    useEffect(() => {
        const queryParam = new URLSearchParams(location.search)
        const tabFromUrl = queryParam.get('tab')
        if (tabFromUrl) setTab(tabFromUrl)
    }, [location.search])
    const dispatch = useDispatch()
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
    const {currentUser}=useSelector(state=>state.user)
    return (
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col gap-1'>
                    <Link to='/dashboard?tab=profile'>
                        <Sidebar.Item as='div' active={tab == 'profile'} icon={HiUser} label={currentUser.isAdmin? "Admin":"User"} labelColor='dark' >
                            Profile
                        </Sidebar.Item>
                    </Link>
                    {currentUser?.isAdmin && <Link to='/dashboard?tab=posts'>
                        <Sidebar.Item as='div' active={tab == 'posts'} icon={HiDocumentText}>
                            Posts
                        </Sidebar.Item>
                    </Link>}
                    {currentUser?.isAdmin && <Link to='/dashboard?tab=users'>
                        <Sidebar.Item as='div' active={tab == 'posts'} icon={HiOutlineUserGroup}>
                            Users
                        </Sidebar.Item>
                    </Link>}
                    <Sidebar.Item onClick={handleSignOut} icon={HiArrowSmRight} className="cursor-pointer">
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}

export default DashSidebar