import type { NextPage } from 'next'
import Head from 'next/head'
import {
  useAddress,
  useContract,
  useContractRead,
  // useContractCall,
  useDisconnect,
  useMetamask
} from '@thirdweb-dev/react'
import { ethers } from 'ethers'

import { Header, Login, Loading } from '../components'
import { useState } from 'react'
import { currency } from '../constants'

const Home: NextPage = () => {
  const address = useAddress()
  const [quantity, setQuantity] = useState<number>(1)
  const { contract, isLoading } = useContract(
    process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS
  )
  const { data: remainingTickets } = useContractRead(
    contract,
    'RemainingTickets'
  )
  const { data: currentWinningReward } = useContractRead(
    contract,
    'CurrentWinningReward'
  )

  if (isLoading) return <Loading />

  if (!address) return <Login />

  return (
    <div className='bg-[#070707] min-h-screen flex flex-col'>
      <Head>
        <title>Crypto Lottery</title>
      </Head>

      <div className='flex-1'>
        <Header />

        <div className='space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5'>
          <div className='stats-container'>
            <h1 className='text-5xl text-white font-semibold text-center'>
              The Next Draw
            </h1>

            <div className='flex justify-between p-2 space-x-2'>
              <div className='stats'>
                <h2 className='text-sm '>Total Pool</h2>
                <p className='text-xl'>
                  {currentWinningReward &&
                    ethers.utils.formatEther(
                      currentWinningReward.toString()
                    )}{' '}
                  {currency}
                </p>
              </div>
              <div className='stats'>
                <h2 className='text-sm'>Tickets Remaining</h2>
                <p className='text-xl'>{Number(remainingTickets)}</p>
              </div>
            </div>

            {/* Countdown Timer */}
          </div>

          <div className='stats-container space-y-2'>
            <div className='stats'>
              <div className='flex justify-between items-center text-white pb-2'>
                <h2>Price Per Ticket</h2>
                <p></p>
              </div>

              <div className='flex text-white items-center space-x-2 bg-[#8d1057] border border-[#791c51] p-4'>
                <p>TICKETS</p>
                {/* text-right */}
                <input
                  className='flex w-full bg-transparent text-right outline-none'
                  type='number'
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                />
              </div>

              <div className='space-y-2 mt-5'>
                <div className='flex items-center justify-between text-sm italic'>
                  <p>Total Cost of Tickets</p>
                  <p>0.999</p>
                </div>

                <div className='flex items-center justify-between text-xs italic'>
                  <p>Service Fees</p>
                  <p>0.001 MATIC</p>
                </div>

                <div className='flex items-center justify-between text-xs italic'>
                  <p>+ Network Fee</p>
                  <p>TBC</p>
                </div>
              </div>

              <button className='mt-5 w-full bg-gradient-to-br from-pink-300 to-pink-700 px-10 py-5 rounded-md text-white shadow-xl disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed'>
                Buy Tickets
              </button>
            </div>
          </div>
        </div>

        {/* The Price Per Ticket box*/}
        <div></div>
      </div>
    </div>
  )
}

export default Home
