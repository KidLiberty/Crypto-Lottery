import React from 'react'
import Image from 'next/image'
import PropagateLoader from 'react-spinners/PropagateLoader'

import { AlchemyLogo } from '../assets'

interface Props {}

const Loading = (props: Props) => {
  return (
    <div className='h-screen bg-[#070707] flex flex-col items-center justify-center'>
      <div className='flex items-center space-x-2 mb-10'>
        <Image
          src={AlchemyLogo}
          className='rounded-full'
          width={75}
          height={75}
          alt='lottery_logo'
        />
        <h1 className='text-lg text-white font-bold'>
          Loading the Crypto Lottery...
        </h1>
      </div>
      <PropagateLoader color='#d52f8d' size={30} />
    </div>
  )
}

export default Loading
