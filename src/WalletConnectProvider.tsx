/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'
import HotToaster from '@components/HotToaster'
import { useWeb3React } from '@web3-react/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import {
  erc20Json,
  POLYGON_NETWORK_PARAMS,
  POLYGON_NETWORK_RPC_URL,
} from './constants'
import { v4 as uuidv4 } from 'uuid'
import { walletConnectCheck } from '@root/apis/onboarding/authenticationSlice'
import store from '@root/store/store'
type connectStatus = true | false
// Type and component name conflicted
type ConnectContext = {
  connectStatus: connectStatus
  connect: (wallet: string) => void
  disconnect: () => void
  transactionStatus: string
  initialize: () => void
  initialConnect: () => void
  getTxnStatus: (txnHash: string) => any
  getBlockNumber: () => any
  setAccount: () => void
  verifyConnect: (wallet: string) => any
  signInProgress: boolean
  connectError: string
  checkChainId: () => void
  loggedInAddress: string
}

const POLLING_INTERVAL = 12000

const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(
  POLYGON_NETWORK_RPC_URL,
)

export const getLibrary = (provider: any): ethers.providers.Web3Provider => {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = POLLING_INTERVAL
  return library
}

export const ConnectContext = React.createContext<ConnectContext>(
  {} as ConnectContext,
)

export const WalletConnectProvider: React.FC = ({ children }) => {
  const [connectStatus, setConnectStatus] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState('init')
  const [signInProgress, setSignInProgress] = useState(false)
  const [connectError, setConnectError] = useState('')
  const [loggedInAddress, setLoggedInAddress] = useState('')
  const { t } = useTranslation()

  const context = useWeb3React()

  useEffect(() => {
    if (connectStatus) {
      store.dispatch(
        walletConnectCheck({
          walletConnectConfirmPopUp: false,
        }),
      )
    }
  }, [connectStatus])

  const isWebview = () => {
    if (typeof window === undefined) {
      return false
    }

    const navigator: any = window.navigator

    const standalone = navigator.standalone
    const userAgent = navigator.userAgent.toLowerCase()
    const safari = /safari/.test(userAgent)
    const ios = /iphone|ipod|ipad/.test(userAgent)

    return ios ? !standalone && !safari : userAgent.includes('wv')
  }

  const isMobileDevice = () => {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  }

  const connect = async (wallet: string) => {
    setConnectError('')
    localStorage.removeItem('wallet')
    localStorage.removeItem('loginInfo')
    localStorage.removeItem('loggedIn')
    localStorage.removeItem('externalWalletAddress')
    localStorage.removeItem('balance')
    window.localStorage.removeItem('ISLAUNCHCLICKED')
    setSignInProgress(false)
    let provider
    let web3Provider
    if (wallet === 'Trust') {
      if (!isMobileDevice()) {
        toast.error(t('trust wallet only works on mobile.'))
        return
      }
      if (isWebview()) {
        const { activate } = context
        activate(
          new InjectedConnector({
            supportedChainIds: [137],
          }),
          async (error: Error) => {
            toast.error(wallet + ' ' + error.message)
          },
        )
        const { library } = context
        provider = library
        web3Provider = library
        localStorage.setItem('wallet', wallet)
        setConnectStatus(true)
      } else {
        console.log('crashing_blank1')
        window.location.replace(
          'https://link.trustwallet.com/open_url?coin_id=966&url=' +
            window.location.href,
        )
      }
    } else if (wallet === 'WalletConnect') {
      const { activate } = context
      await activate(
        new WalletConnectConnector({
          rpc: {
            1: 'https://mainnet.infura.io/v3/1c3acca035dd41dfbf400abac71e59a7',
            137: 'https://rpc-mainnet.matic.quiknode.pro',
            80001: 'https://rpc-mumbai.maticvigil.com',
          },
          bridge: 'https://bridge.walletconnect.org',
          qrcode: true,
        }),
        async () => {
          // toast.error(wallet + ' ' + t('wallet is not installed.'))
        },
      )
      localStorage.setItem('wallet', 'Trust')
      // setConnectStatus(true)
    } else {
      provider = window.ethereum?.providers?.find((provider: any) =>
        wallet === 'Metamask'
          ? provider.isMetaMask
          : wallet === 'Coinbase'
          ? provider.isCoinbaseWallet
          : provider.isTrustWallet,
      )
      if (!provider) {
        if (
          (window.ethereum?.isMetaMask && wallet === 'Metamask') ||
          (window.ethereum?.isCoinbaseWallet && wallet === 'Coinbase')
        ) {
          provider = window.ethereum
        }
      }

      if (!isMobileDevice() && (!provider || provider === undefined)) {
        if (wallet === 'Metamask') {
          window.open('https://metamask.io/download/', '_blank')
        } else if (wallet === 'Coinbase') {
          window.open(
            'https://www.coinbase.com/wallet/articles/getting-started-extension',
            '_blank',
          )
        }
        return
      }

      try {
        await provider.request({ method: 'eth_requestAccounts' })
      } catch {
        if (wallet === 'Metamask') {
          window.location.replace(
            'https://metamask.app.link/dapp/' + window.location.href,
          )
        } else {
          console.log('crashing_blank2')
          window.location.replace(
            'https://go.cb-w.com/dapp?cb_url=' + window.location.href,
          )
        }
        return
      }
      let chainId = await provider.request({ method: 'eth_chainId' })
      if (chainId === POLYGON_NETWORK_PARAMS.chainId) {
        // console.log('Bravo!, you are on the correct network')
      } else {
        // console.log('olal, switch to the correct network')
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [POLYGON_NETWORK_PARAMS],
          })
          chainId = await provider.request({ method: 'eth_chainId' })
          if (chainId !== POLYGON_NETWORK_PARAMS.chainId) {
            return
          }
          console.log('You have succefully switched to Polygon Main Network')
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
            console.log(
              'This network is not available in your metamask, please add it',
            )
          }
          console.log('Failed to switch to the network')
          return
        }
      }
      try {
        web3Provider = new ethers.providers.Web3Provider(provider)

        const signer = web3Provider.getSigner()

        const address = await signer.getAddress()
        // const signatureLocal =
        //   localStorage.getItem(`${address}-signature`) || ''
        // const noncesLocal = localStorage.getItem(`${address}-nonces`) || ''
        // const signatureLocal = localStorage.getItem('signature') || ''
        // const noncesLocal = localStorage.getItem('nonces') || ''

        const signatureLocal = ''
        const noncesLocal = ''

        if (signatureLocal === '' || noncesLocal === '') {
          const unique_id = uuidv4()
          /* eslint-disable-next-line max-len */
          const message = `Welcome to Mecarreira! Click to sign in and accept the Mecarreira Terms of Service: https://dev.mecarreira.com/terms-conditions This request will not trigger a blockchain transaction or cost any gas fees. Your authentication status will reset after 24 hours. Wallet-address:${address} Nonce: ${unique_id}`
          setSignInProgress(true)
          const signature = await signer.signMessage(message)
          localStorage.setItem('loginInfo', address)
          setLoggedInAddress(address)
          localStorage.setItem('externalWalletAddress', address)
          // localStorage.setItem(`${address}-signature`, signature)
          // localStorage.setItem(`${address}-nonces`, unique_id)
          // localStorage.setItem('signature', signature)
          // localStorage.setItem('nonces', unique_id)
          localStorage.setItem('wallet', wallet)
        } else {
          /* eslint-disable-next-line max-len */
          const message = `Welcome to Mecarreira! Click to sign in and accept the Mecarreira Terms of Service: https://dev.mecarreira.com/terms-conditions This request will not trigger a blockchain transaction or cost any gas fees. Your authentication status will reset after 24 hours. Wallet-address:${address} Nonce: ${noncesLocal}`
          const signerAddr = await ethers.utils.verifyMessage(
            message,
            signatureLocal,
          )
          if (signerAddr !== address) {
            const unique_id = uuidv4()
            /* eslint-disable-next-line max-len */
            const message = `Welcome to Mecarreira! Click to sign in and accept the Mecarreira Terms of Service: https://dev.mecarreira.com/terms-conditions This request will not trigger a blockchain transaction or cost any gas fees. Your authentication status will reset after 24 hours. Wallet-address:${address} Nonce: ${unique_id}`
            setSignInProgress(true)
            const signature = await signer.signMessage(message)
            localStorage.setItem('loginInfo', address)
            setLoggedInAddress(address)
            localStorage.setItem('externalWalletAddress', address)
            // localStorage.setItem(`${address}-signature`, signature)
            // localStorage.setItem(`${address}-nonces`, unique_id)
            // localStorage.setItem('signature', signature)
            // localStorage.setItem('nonces', unique_id)
            localStorage.setItem('wallet', wallet)
            localStorage.removeItem('logg')
          } else {
            localStorage.setItem('loginInfo', address)
            setLoggedInAddress(address)
            localStorage.setItem('externalWalletAddress', address)
            localStorage.setItem('wallet', wallet)
          }
        }

        web3Provider.getBalance(address).then((balance: any) => {
          // convert a currency unit from wei to ether
          const balanceInEth =
            Math.trunc(
              Number.parseFloat(ethers.utils.formatEther(balance)) * 10 ** 6,
            ) /
            10 ** 6
          localStorage.setItem('balance', balanceInEth.toString())
        })
        setConnectStatus(true)
        // toast.success(t('successfully connected!'))
      } catch {
        setSignInProgress(false)
        setConnectError('Please check if you joined to wallet!')
        toast.error(t('Please check if you joined to wallet!'))
      }
    }
  }

  const verifyConnect = async (wallet: string) => {
    console.log('Enter verify Connect', wallet)
    localStorage.removeItem('wallet')
    localStorage.removeItem('loginInfo')
    localStorage.removeItem('loggedIn')
    localStorage.removeItem('externalWalletAddress')
    localStorage.removeItem('balance')
    window.localStorage.removeItem('ISLAUNCHCLICKED')
    let provider
    let web3Provider
    if (wallet === 'Trust') {
      if (!isMobileDevice()) {
        toast.error(t('trust wallet only works on mobile.'))
        return
      }
      if (isWebview()) {
        const { activate, connector } = context
        activate(
          new InjectedConnector({
            supportedChainIds: [137],
          }),
          async (error: Error) => {
            toast.error(wallet + ' ' + error.message)
          },
        )
        const { library } = context
        provider = library
        web3Provider = library
        localStorage.setItem('wallet', wallet)
        setConnectStatus(true)
      } else {
        console.log('crashing_blank3')
        window.location.replace(
          'https://link.trustwallet.com/open_url?coin_id=966&url=' +
            window.location.href,
        )
      }
    } else if (wallet === 'WalletConnect') {
      const { activate, connector } = context
      await activate(
        new WalletConnectConnector({
          rpc: {
            1: 'https://mainnet.infura.io/v3/1c3acca035dd41dfbf400abac71e59a7',
            137: 'https://rpc-mainnet.matic.quiknode.pro',
            80001: 'https://rpc-mumbai.maticvigil.com',
          },
          bridge: 'https://bridge.walletconnect.org',
          qrcode: true,
        }),
        async (error: Error) => {
          // toast.error(wallet + ' ' + t('wallet is not installed.'))
        },
      )
      localStorage.setItem('wallet', 'Trust')
      setConnectStatus(true)
    } else {
      provider = window.ethereum?.providers?.find((provider: any) =>
        wallet === 'Metamask'
          ? provider.isMetaMask
          : wallet === 'Coinbase'
          ? provider.isCoinbaseWallet
          : provider.isTrustWallet,
      )
      if (!provider) {
        if (
          (window.ethereum?.isMetaMask && wallet === 'Metamask') ||
          (window.ethereum?.isCoinbaseWallet && wallet === 'Coinbase')
        ) {
          provider = window.ethereum
        }
      }

      if (!isMobileDevice() && (!provider || provider === undefined)) {
        if (wallet === 'Metamask') {
          window.open('https://metamask.io/download/', '_blank')
        } else if (wallet === 'Coinbase') {
          window.open(
            'https://www.coinbase.com/wallet/articles/getting-started-extension',
            '_blank',
          )
        }
        return
      }

      try {
        await provider.request({ method: 'eth_requestAccounts' })
      } catch {
        if (wallet === 'Metamask') {
          window.location.replace(
            'https://metamask.app.link/dapp/' + window.location.href,
          )
        } else {
          console.log('crashing_blank4')
          window.location.replace(
            'https://go.cb-w.com/dapp?cb_url=' + window.location.href,
          )
        }
        return
      }
      let chainId = await provider.request({ method: 'eth_chainId' })
      if (chainId === POLYGON_NETWORK_PARAMS.chainId) {
        // console.log('Bravo!, you are on the correct network')
      } else {
        // console.log('olal, switch to the correct network')
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [POLYGON_NETWORK_PARAMS],
          })
          chainId = await provider.request({ method: 'eth_chainId' })
          if (chainId !== POLYGON_NETWORK_PARAMS.chainId) {
            return
          }
          console.log({ chainId })
          console.log('You have succefully switched to Polygon Main Network')
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
            console.log(
              'This network is not available in your metamask, please add it',
            )
          }
          console.log('Failed to switch to the network')
          return
        }
      }
      try {
        web3Provider = new ethers.providers.Web3Provider(provider)

        const signer = web3Provider.getSigner()

        const address = await signer.getAddress()
        const signatureLocal =
          localStorage.getItem(`${address}-signature`) || ''
        const noncesLocal = localStorage.getItem(`${address}-nonces`) || ''
        // const signatureLocal = localStorage.getItem('signature') || ''
        // const noncesLocal = localStorage.getItem('nonces') || ''
        const message = `Welcome to Mecarreira! Click to sign in and accept the Mecarreira Terms of Service: https://dev.mecarreira.com/terms-conditions This request will not trigger a blockchain transaction or cost any gas fees. Your authentication status will reset after 24 hours. Wallet-address:${address} Nonce: ${noncesLocal}`
        const signerAddr = await ethers.utils.verifyMessage(
          message,
          signatureLocal,
        )
        console.log('signAddr', { signerAddr, address })
        if (signatureLocal === '' && noncesLocal === '') {
          return false
        } else {
          if (signerAddr === address) {
            return false
          } else {
            return false
          }
        }
      } catch (error) {
        console.log('signAddrVerify', error)
        // toast.error(t('Please check if you joined to wallet!'))
      }
    }
  }
  const initialConnect = async () => {
    if (!isWebview()) {
      return
    }
    let provider
    let web3Provider
    let wallet: any
    if (window.ethereum?.isMetaMask) {
      wallet = 'Metamask'
    } else if (window.ethereum?.isCoinbaseWallet) {
      wallet = 'Coinbase'
    } else if (window.ethereum?.isTrust) {
      wallet = 'Trust'
    } else {
      wallet = false
    }
    if (!wallet) {
      return
    }
    localStorage.setItem('wallet', wallet)

    if (wallet === 'Trust') {
      const { activate } = context
      activate(
        new InjectedConnector({
          supportedChainIds: [137],
        }),
        async (error: Error) => {
          toast.error(error.message)
          console.log({ error })
        },
      )
      const { library } = context
      provider = library
      web3Provider = library
      setConnectStatus(true)
    } else {
      provider = window.ethereum
      try {
        await provider.request({ method: 'eth_requestAccounts' })
      } catch {
        return
      }
      const chainId = await provider.request({ method: 'eth_chainId' })
      if (chainId === POLYGON_NETWORK_PARAMS.chainId) {
        console.log('Bravo!, you are on the correct network')
      } else {
        console.log('olal, switch to the correct network')
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [POLYGON_NETWORK_PARAMS],
          })
          console.log('You have succefully switched to Polygon Main Network')
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
            console.log(
              'This network is not available in your metamask, please add it',
            )
          }
          console.log('Failed to switch to the network')
          return
        }
      }
    }
  }

  const disconnect = async () => {
    setConnectStatus(false)
  }

  const initialize = async () => {
    setTransactionStatus('init')
  }

  const setAccount = async () => {
    const curWallet = localStorage.getItem('wallet')
    if (curWallet === 'Trust' || curWallet === 'WalletConnect') {
      const { account } = context
      if (account) {
        localStorage.setItem('loginInfo', account ?? '')
        const balance = await simpleRpcProvider.getBalance(
          localStorage.getItem('loginInfo') ?? '',
        )
        const balanceInEth =
          Math.trunc(
            Number.parseFloat(ethers.utils.formatEther(balance)) * 10 ** 6,
          ) /
          10 ** 6
        localStorage.setItem('balance', balanceInEth.toString())
      }
    }
  }

  const getTxnStatus = async (txnHash: string) => {
    return await simpleRpcProvider.waitForTransaction(txnHash)
  }

  const getBlockNumber = async () => {
    return await simpleRpcProvider.getBlockNumber()
  }

  const checkChainId = async () => {
    const curWallet = localStorage.getItem('wallet')
    let provider
    if (
      (window.ethereum?.isMetaMask && curWallet === 'Metamask') ||
      (window.ethereum?.isCoinbaseWallet && curWallet === 'Coinbase')
    ) {
      provider = window.ethereum
    }

    const chainId = await provider?.request({ method: 'eth_chainId' })
    console.log({ chainId, llp: POLYGON_NETWORK_PARAMS })
    if (chainId === POLYGON_NETWORK_PARAMS.chainId) {
      console.log('correct_network')
    } else {
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [POLYGON_NETWORK_PARAMS],
        })
        const chainId = await provider.request({ method: 'eth_chainId' })
        if (chainId !== POLYGON_NETWORK_PARAMS.chainId) {
          return
        }
        console.log('You have succefully switched to Polygon Main Network')
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          console.log(
            'This network is not available in your metamask, please add it',
          )
        }
        console.log('Failed to switch to the network', switchError)
        return
      }
    }
  }

  return (
    <ConnectContext.Provider
      value={
        {
          connectStatus,
          connect,
          disconnect,
          verifyConnect,
          transactionStatus,
          initialize,
          initialConnect,
          getTxnStatus,
          getBlockNumber,
          setAccount,
          connectError,
          signInProgress,
          checkChainId,
          loggedInAddress,
        } as ConnectContext
      }
    >
      {children}
      <HotToaster />
    </ConnectContext.Provider>
  )
}
