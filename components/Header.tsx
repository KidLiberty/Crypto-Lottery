import React from 'react'
import type { NextPage } from 'next'
import Image from 'next/image'
import { useAddress, useDisconnect } from '@thirdweb-dev/react'
import { Bars3BottomRightIcon } from '@heroicons/react/24/solid'

import { NavButton } from '../components'
import { AlchemyLogo } from '../assets'

interface Props {}

const Header: NextPage = (props: Props) => {
  const address = useAddress()
  const disconnect = useDisconnect()

  return (
    <header className='grid grid-cols-2 md:grid-cols-5 justify-between items-center p-5'>
      <div className='flex items-center space-x-2'>
        <Image
          src={AlchemyLogo}
          width={60}
          height={60}
          className='rounded-full'
          alt='lottery_logo'
        />

        <div>
          <h1 className='text-lg text-white font-bold'>Crypto Lottery</h1>
          <p className='text-xs text-[#d52f8d] font-semibold truncate'>
            User: {address?.substring(0, 5)}...
            {address?.substring(address.length, address.length - 5)}
          </p>
        </div>
      </div>

      <div className='hidden md:flex md:col-span-3 items-center justify-center'>
        <div className='bg-[#151416] px-4 py-3 space-x-2 rounded-lg'>
          <NavButton isActive title='Buy Tickets' />
          <NavButton onClick={disconnect} title='Logout' />
        </div>
      </div>

      {/* ml-auto pushes the icon all the way to the right */}
      <div className='flex flex-col ml-auto text-right'>
        <Bars3BottomRightIcon className='text-white w-8 h-8 m-auto cursor-pointer' />
        <span className='md:hidden'>
          <NavButton onClick={disconnect} title='Logout' />
        </span>
      </div>
    </header>
  )
}

export default Header
