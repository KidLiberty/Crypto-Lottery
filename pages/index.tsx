import type { NextPage } from 'next'
import Head from 'next/head'
import {
  useAddress,
  useContract,
  useDisconnect,
  useMetamask
} from '@thirdweb-dev/react'

import { Header } from '../components'

const Home: NextPage = () => {
  const address = useAddress()

  console.log(address)

  return (
    <div className='bg-[#0c0b0b] min-h-screen flex flex-col'>
      <Head>
        <title>Crypto Lottery</title>
      </Head>
      <Header />
    </div>
  )
}

export default Home
