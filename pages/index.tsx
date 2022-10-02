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
import Marquee from 'react-fast-marquee'

import {
  Header,
  Login,
  Loading,
  CountdownTimer,
  AdminControls
} from '../components'
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
  const { data: winnings } = useContractRead(
    contract,
    'getWinningsForAddress',
    address
  )
  const { mutateAsync: WithdrawWinnings } = useContractWrite(
    contract,
    'WithdrawWinnings'
  )
  const { data: lastWinner } = useContractRead(contract, 'lastWinner')
  const { data: lastWinnerAmount } = useContractRead(
    contract,
    'lastWinnerAmount'
  )
  const { data: isLotteryOperator } = useContractRead(
    contract,
    'lotteryOperator'
  )

  useEffect(() => {
    if (!tickets) return
    const totalTickets: string[] = tickets
    const numberOfUserTickets = totalTickets.reduce(
      (total, ticketAddress) => (ticketAddress === address ? total + 1 : total),
      0
    )
    setUserTickets(numberOfUserTickets)
  }, [tickets, address])

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

  const onWithdrawWinnings = async () => {
    const notification = toast.loading('Withdrawing your winnings...')

    try {
      const data = await WithdrawWinnings([{}])

      toast.success('Winnings withdrawn successfully', { id: notification })
    } catch (e) {
      toast.error('Whoops, something went wrong!', { id: notification })

      console.error('Contract call failure.', e)
    }
  }

  if (isLoading) return <Loading />
  if (!address) return <Login />

  return (
    <div className='bg-[#000000] min-h-screen flex flex-col'>
      <Head>
        <title>Crypto Lottery</title>
      </Head>

      <div className='flex-1'>
        <Header />
        <Marquee className='bg-[#131313] p-5 mb-5' gradient={false} speed={100}>
          <div className='flex space-x-2 text-white mx-10'>
            <h4 className='mx-10'>
              Last Winner:{' '}
              <span className='text-[#d52f8d]'>{lastWinner?.toString()}</span>
            </h4>
            <h4>
              Previous Winnings:{' '}
              <span className='text-[#d52f8d]'>
                {ethers.utils.formatEther(lastWinnerAmount?.toString())}{' '}
                {currency}
              </span>
            </h4>
          </div>
        </Marquee>

        {isLotteryOperator === address && (
          <div className='flex justify-center'>
            <AdminControls />
          </div>
        )}

        {winnings > 0 && (
          <div className='max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5'>
            <button
              className='p-5 bg-gradient-to-b from-orange-500 to-emerald-600 text-center rounded-xl w-full animate-pulse'
              onClick={onWithdrawWinnings}
            >
              <p className='font-bold text-xl'>
                Winner! Winner! Chicken Dinner!
              </p>
              <p className='text-[20px]'>
                Total Winnings:{' '}
                <span className='italic'>
                  {ethers.utils.formatEther(winnings.toString())}
                </span>{' '}
                <span className='font-semibold'>{currency}</span>
              </p>
              <br />
              <p className='font-semibold'>Click here to withdraw.</p>
            </button>
          </div>
        )}

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
