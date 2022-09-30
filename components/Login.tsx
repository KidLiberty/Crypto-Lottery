import React from 'react'
import Image from 'next/image'

import { AlchemyLogo } from '../assets'
import { useMetamask } from '@thirdweb-dev/react'

interface Props {}

const Login = (props: Props) => {
  const connectWithMetaMask = useMetamask()

  // *text-center helps with ceneting on mobile view
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-[#0c0b0b] text-center'>
      <div className='flex flex-col items-center mb-10'>
        <Image
          src={AlchemyLogo}
          width={200}
          height={200}
          className='rounded-full mb-10'
          alt='login_image'
        />
        <h1 className='text-white  text-6xl'>Crypto Lottery</h1>
        <h2 className='text-white '>
          Get started by connecting with MetaMask!
        </h2>
        <button
          onClick={connectWithMetaMask}
          className='text-[#d52f8d] border-[3px] border-[#d52f8d] p-3 rounded-md font-bold hover:text-[#070707] hover:bg-[#d52f8d] transition-all duration-200 active:bg-[#6f194a] active:border-[#6f194a]'
        >
          Login with MetaMask
        </button>
      </div>
    </div>
  )
}

export default Login
