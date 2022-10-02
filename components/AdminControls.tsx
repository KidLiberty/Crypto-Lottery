import React from 'react'
import {
  useContract,
  useContractRead,
  useContractWrite
} from '@thirdweb-dev/react'
import { ethers } from 'ethers'
import {
  ArrowPathIcon,
  ArrowUturnDownIcon,
  CurrencyDollarIcon,
  StarIcon
} from '@heroicons/react/24/solid'
import { currency } from '../constants'
import toast from 'react-hot-toast'

interface Props {}

const AdminControls = (props: Props) => {
  const { contract } = useContract(
    process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS
  )
  const { data: totalCommission } = useContractRead(
    contract,
    'operatorTotalCommission'
  )
  const { mutateAsync: DrawWinnerTicket } = useContractWrite(
    contract,
    'DrawWinnerTicket'
  )
  const { mutateAsync: WithdrawCommission } = useContractWrite(
    contract,
    'WithdrawCommission'
  )
  const { mutateAsync: RestartDraw } = useContractWrite(contract, 'restartDraw')
  const { mutateAsync: RefundAll } = useContractWrite(contract, 'RefundAll')

  const drawWinner = async () => {
    const notification = toast.loading('Drawing lottery winner...')
    try {
      const data = await DrawWinnerTicket([{}])
      toast.success('A winner has been selected!', { id: notification })
      console.info('Contract call success.', data)
    } catch (e) {
      toast.error('Whoops, something went wrong!', { id: notification })
      console.error('contract call failure', e)
    }
  }

  const onWithdrawCommission = async () => {
    const notification = toast.loading('Withdrawing commission...')
    try {
      const data = await WithdrawCommission([{}])
      toast.success('Your commission has been withdrawn successfully.', {
        id: notification
      })
      console.info('Contract call success.', data)
    } catch (e) {
      toast.error('Whoops, something went wrong!', { id: notification })
      console.error('contract call failure', e)
    }
  }

  const onRestartDraw = async () => {
    const notification = toast.loading('Restarting lottery draw...')
    try {
      const data = await RestartDraw([{}])
      toast.success('The draw has been restared successfully.', {
        id: notification
      })
      console.info('Contract call success.', data)
    } catch (e) {
      toast.error('Whoops, something went wrong!', { id: notification })
      console.error('contract call failure', e)
    }
  }

  const onRefundAll = async () => {
    const notification = toast.loading('Refunding wallet addresses...')
    try {
      const data = await RefundAll([{}])
      toast.success(
        'All participating wallet addresses have been refunded successfully.',
        {
          id: notification
        }
      )
      console.info('Contract call success.', data)
    } catch (e) {
      toast.error('Whoops, something went wrong!', { id: notification })
      console.error('contract call failure', e)
    }
  }

  return (
    <div className='text-white text-center px-5 py-3 rounded-md border border-[#d52f8d]'>
      <h2 className='font-bold'>Admin Controls</h2>
      <p className='mb-5'>
        Total Commission to be Withdrawn:{' '}
        <span className='font-semibold'>
          {totalCommission &&
            ethers.utils.formatEther(totalCommission.toString())}{' '}
          {currency}
        </span>
      </p>

      <div className='flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2'>
        <button className='admin-button' onClick={drawWinner}>
          <StarIcon className='h-6 mx-auto mb-2' />
          Draw Winner
        </button>
        <button className='admin-button' onClick={onWithdrawCommission}>
          <CurrencyDollarIcon className='h-6 mx-auto mb-2' />
          Withdraw Commission
        </button>
        <button className='admin-button' onClick={onRestartDraw}>
          <ArrowPathIcon className='h-6 mx-auto mb-2' />
          Restart the Draw
        </button>
        <button className='admin-button' onClick={onRefundAll}>
          <ArrowUturnDownIcon className='h-6 mx-auto mb-2' />
          Refund All
        </button>
      </div>
    </div>
  )
}

export default AdminControls
