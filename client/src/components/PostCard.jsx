import React from 'react'
import { Link } from 'react-router-dom'

const PostCard = ({ post }) => {
    return (
        <div className='group relative border border-teal-500 hover:border-2 transition-all duration-300 w-full h-[300px] overflow-hidden rounded-lg  sm:w-[270px]'>
            <Link to={`/post/${post.slug}`}>
                <img src={post.image} alt={post.slug}
                    className='h-[200px] object-cover w-full group-hover:h-[170px] transition-all duration-300 z-20'
                />
            </Link>
            <div className='p-3 flex flex-col gap-2'>
                <p className='text-lg font-semibold line-clamp-1'>{post.title}</p>
                <span className='italic text-sm'>{post.category}</span>
                <Link to={`/post/${post.slug}`}
                    className='z-10 group-hover:opacity-100 absolute opacity-0 bottom-0 left-0 right-0
                        border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white text-center rounded-md py-2
                        transition-all duration-300 m-2
                    '>
                    Read Artcle
                </Link>
            </div>
        </div>
    )
}

export default PostCard