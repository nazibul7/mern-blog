import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashProfile from '../components/DashProfile'
import DashSidebar from '../components/DashSidebar'
import DashPosts from '../components/DashPosts'
import DashUsers from '../components/DashUsers'

const Dashboard = () => {
  const location = useLocation()
  const [tab, setTab] = useState('')
  useEffect(() => {
    const queryParam = new URLSearchParams(location.search)
    const tabFromUrl = queryParam.get('tab')
    if (tabFromUrl) setTab(tabFromUrl)
  }, [location.search])
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div>
        <DashSidebar />
      </div>
      {tab === 'profile' && <DashProfile />}
      {tab==='posts' && <DashPosts/>}
      {tab==='users' && <DashUsers/>}
    </div>
  )
}

export default Dashboard