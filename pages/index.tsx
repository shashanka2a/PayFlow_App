import Head from 'next/head'
import App from '../src/App'

export default function Home() {
  return (
    <>
      <Head>
        <title>PayFlow - Send Money from USA to India | USD to INR Transfers</title>
        <meta name="description" content="Fast, secure USD to INR money transfers to India. Live exchange rates, low fees, and 1-2 day delivery. Send money to family in India with PayFlow." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="USD to INR, money transfer, send money to India, remittance, exchange rates" />
      </Head>
      <App />
    </>
  )
}