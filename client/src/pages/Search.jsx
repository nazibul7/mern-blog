import { Button, Select, TextInput } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PostCard from '../components/PostCard'

const Search = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized'
  })
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showMore, setShowmore] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    const urlparams = new URLSearchParams(location.search)
    const searchtermFromUrl = urlparams.get('searchTerm')
    const sortFromUrl = urlparams.get('sort')
    const categoryFromUrl = urlparams.get('category')
    if (searchtermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        searchTerm: searchtermFromUrl, sort: sortFromUrl, category: categoryFromUrl
      })
    }
    const fetchPosts = async () => {
      setLoading(true)
      const searchQuery = urlparams.toString()
      try {
        const res = await fetch(`/api/post/getPosts?${searchQuery}`)
        const data = await res.json()
        if (res.ok) {
          setLoading(false)
          setPosts(data.post)
        }
      } catch (error) {
        setLoading(false)
        console.log(error);
        return
      }
    }
    fetchPosts()
  }, [location.search])
  const handleChange = (event) => {
    if (event.target.id == 'searchTerm') {
      setSidebarData({
        ...sidebarData, searchTerm: event.target.value
      })
    }
    if (event.target.id == 'sort') {
      const order = event.target.value || 'desc'
      setSidebarData({
        ...sidebarData,
        sort: order
      })
    }
    if (event.target.id == 'category') {
      const category = event.target.value || 'uncategorized'
      setSidebarData({
        ...sidebarData,
        category
      })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const urlParams = new URLSearchParams(location.search)
    urlParams.set('searchTerm', sidebarData.searchTerm)
    urlParams.set('sort', sidebarData.sort)
    urlParams.set('category', sidebarData.category)
    const searchQuery = urlParams.toString()
    console.log(searchQuery);
    navigate(`/search?${searchQuery}`)
  }
  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-5 border-b md:border-r md:min-h-screen border-gray-500'>
        <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
          <div className='flex items-center gap-2'>
            <label htmlFor="searchTerm" className='capitalize whitespace-nowrap font-semibold'>Search term:</label>
            <TextInput placeholder='Search...' id='searchTerm'
              value={sidebarData.searchTerm} onChange={handleChange}
            />
          </div>
          <div className='flex items-center gap-2'>
            <label htmlFor="sort" className='capitalize whitespace-nowrap font-semibold'>Sort:</label>
            <Select value={sidebarData.sort} onChange={handleChange} id='sort'>
              <option value={'desc'}>Latest</option>
              <option value={'asc'}>Oldest</option>
            </Select>
          </div>
          <div className='flex items-center gap-2'>
            <label htmlFor="category" className='capitalize whitespace-nowrap font-semibold'>category:</label>
            <Select value={sidebarData.category} onChange={handleChange} id='category'>
              <option value={'uncategorized'}>Uncategorized</option>
              <option value={'reactjs'}>React.Js</option>
              <option value={'nextjs'}>Next.Js</option>
              <option value={'javascript'}>JavaScript</option>
            </Select>
          </div>
          <Button type='submit' outline gradientDuoTone={'purpleToPink'}>
            Apply Filters
          </Button>
        </form>
      </div>
      <div className='w-full'>
        <h1 className='text-2xl font-semibold sm:border-b border-gray-500 p-2 mt-3'>Post Results:</h1>
        <div className='p-5 flex flex-wrap gap-3'>
          {!loading && posts.length == 0 && (
            <p className='text-xl text-gray-500'>No post found</p>
          )}
          {
            loading && <p className='text-xl text-gray-500'>Loading...</p>
          }
          {
            !loading && posts?.map((post)=>{
              return <PostCard key={post._id} post={post}/>
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Search