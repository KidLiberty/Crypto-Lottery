import type { NextPage } from 'next'
import Head from 'next/head'
import {
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
  useDisconnect,
  useMetamask
} from '@thirdweb-dev/react'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'

import { Header, Login, Loading, CountdownTimer } from '../components'
import { useEffect, useState } from 'react'
import { currency } from '../constants'

const Home: NextPage = () => {
  const address = useAddress()
  const [userTickets, setUserTickets] = useState(0)
  const [quantity, setQuantity] = useState<number>(1)
  const { contract, isLoading } = useContract(
    process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS
  )
  const { data: expiration } = useContractRead(contract, 'expiration')
  const { data: remainingTickets } = useContractRead(
    contract,
    'RemainingTickets'
  )
  const { data: currentWinningReward } = useContractRead(
    contract,
    'CurrentWinningReward'
  )
  const { data: ticketPrice } = useContractRead(contract, 'ticketPrice')
  const { data: ticketCommission } = useContractRead(
    contract,
    'ticketCommission'
  )
  const { data: tickets } = useContractRead(contract, 'getTickets')

  const { mutateAsync: BuyTickets } = useContractWrite(contract, 'BuyTickets')

  useEffect(() => {
    if (!tickets) return
    const totalTickets: string[] = tickets
    const numberOfUserTickets = totalTickets.reduce(
      (total, ticketAddress) => (ticketAddress === address ? total + 1 : total),
      0
    )
    setUserTickets(numberOfUserTickets)
  }, [tickets, address])

  console.log(userTickets)

  const handleClick = async () => {
    if (!ticketPrice) return

    const notification = toast.loading('Buying your tickets...')

    try {
      const data = await BuyTickets([
        {
          value: ethers.utils.parseEther(
            (
              Number(ethers.utils.formatEther(ticketPrice)) * quantity
            ).toString()
          )
        }
      ])
      toast.success('Tickets purchased successfully!', { id: notification })
    } catch (e) {
      toast.error('Whoops, Something went wrong!', { id: notification })
      console.error('Contract call failire.', e)
    }
  }

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

            <div className='mt-5 mb-3'>
              <CountdownTimer />
            </div>
          </div>

          <div className='stats-container space-y-2'>
            <div className='stats'>
              <div className='flex justify-between items-center text-white pb-2'>
                <h2>Price Per Ticket</h2>
                <p>
                  {ticketPrice &&
                    ethers.utils.formatEther(ticketPrice.toString())}{' '}
                  {currency}
                </p>
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
                  <p>
                    {ticketPrice &&
                      Number(
                        ethers.utils.formatEther(ticketPrice?.toString())
                      ) * quantity}{' '}
                    {currency}
                  </p>
                </div>

                <div className='flex items-center justify-between text-xs italic'>
                  <p>Service Fees</p>
                  <p>
                    {ticketCommission &&
                      ethers.utils.formatEther(
                        ticketCommission?.toString()
                      )}{' '}
                    {currency}
                  </p>
                </div>

                <div className='flex items-center justify-between text-xs italic'>
                  <p>+ Network Fee</p>
                  <p>TBC</p>
                </div>
              </div>

              <button
                disabled={
                  expiration?.toString() < Date.now().toString() ||
                  remainingTickets?.toNumber() === 0
                }
                onClick={handleClick}
                className='mt-5 w-full bg-gradient-to-br from-pink-300 to-pink-700 px-10 py-5 font-semibold rounded-md text-white shadow-xl disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed'
              >
                {`Buy ${quantity} ${quantity > 1 ? 'Tickets' : 'Ticket'} for
                ${
                  ticketPrice &&
                  Number(ethers.utils.formatEther(ticketPrice.toString())) *
                    quantity
                }
                ${currency}`}
              </button>
            </div>

            {userTickets > 0 && (
              <div className='stats'>
                <p className='mb-2 text-lg'>
                  You have {userTickets} tickets in this draw.
                </p>

                <div className='flex max-w-full flex-wrap gap-x-2 gap-y-2'>
                  {Array(userTickets)
                    .fill('')
                    .map((_, index) => {
                      return (
                        <div className='h-20 w-12 bg-[#8d1057] rounded-[4px] flex flex-col flex-shrink-0 items-start justify-start'>
                          <p
                            key={index}
                            className='w-full p-2 text-xs italic border-b-2 border-[#5ea28a] text-[10px]'
                          >
                            No. {index + 1}
                          </p>
                          <div className='w-full h-full flex flex-col items-end justify-end p-1'>
                            <p className='text-[10px] italic'>1 Draw</p>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
