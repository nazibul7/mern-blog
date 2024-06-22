import React from 'react'

const About = () => {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div>
          <h1 className='text-2xl font-semibold text-center mb-5'>About Nazibul's Blog</h1>
          <div className='text-sm text-gray-500 flex flex-col gap-4'>
            <p>
              Welocome to Nazibul Blog!. This Blog was created by Sk Nazibul Hossain as a personal project to share his thoughts and ideas with the world.
              Nazinul is a passionate developer who loves to write about technology,coding and everything in between.
            </p>
            <p>
              On this blog, you'll find weekly articles and tutorials on topics
              such as web development, software engineering, and programming
              languages. Sahand is always learning and exploring new
              technologies, so be sure to check back often for new content!
            </p>

            <p>
              We encourage you to leave comments on our posts and engage with
              other readers. You can like other people's comments and reply to
              them as well. We believe that a community of learners can help
              each other grow and improve.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About