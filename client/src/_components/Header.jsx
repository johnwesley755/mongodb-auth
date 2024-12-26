import React from 'react'
import { assets } from '@/assets/assets'
import { Button } from '@/components/ui/button'

const Header = () => {
  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
        <img src={assets.header_img} alt='' className='w-36 h-36 rounded-full mb-6' />
        <h1 className='sm:text-3xl text-xl font-bold flex items-center gap-2'>Hey Developer <img src={assets.hand_wave} alt='' className='w-8 aspect-square' /> </h1>
        <h2 className='text-2xl sm:text-5xl font-extrabold mb-4 '>Welcome to our app</h2>
        <p className='mb-8 max-w-md font-semibold'>Let's start with a quick product tour and we will have you up and running in no time!</p>
        <Button className='bg-gradient-to-br from-indigo-900 to-purple-900 px-8 py-2.5 hover:bg-gradient-to-br hover:from-indigo-800 hover:to-purple-800'>Get Started</Button>
    </div>
  )
}

export default Header