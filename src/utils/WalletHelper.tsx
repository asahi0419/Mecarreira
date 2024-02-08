import { useWallets } from '@privy-io/react-auth'
import {
  POLYGON_NETWORK_PARAMS,
  POLYGON_NETWORK_RPC_URL,
  erc20Json,
} from '@root/constants'
import { RootState } from '@root/store/rootReducers'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

export const useWalletHelper = () => {
  const context = useWeb3React()

  const [web3Provider, setWeb3Provider] = useState(null)
  const { t } = useTranslation()

  const { privyWallets } = useSelector(
    (state: RootState) => state.authentication,
  )
  const { wallets } = useWallets()

  const getWeb3Provider = async () => {
    let tmpWeb3Provider = null
    if (localStorage.getItem('wallet')) {
      if (localStorage.getItem('wallet') === 'Privy') {
        console.log('privyWallets::', wallets)
        const embeddedWallet = wallets.find(
          wallet => wallet.walletClientType === 'privy',
        )
        console.log('for test embeddedWallet', embeddedWallet)
        if (embeddedWallet?.chainId === 'eip155:1') {
          await embeddedWallet.switchChain(
            POLYGON_NETWORK_PARAMS.chainId as `0x${string}`,
          )
          console.log(
            'for test balance getWeb3Provider  network changed successfully',
          )
          // const provider = await embeddedWallet.getEthereumProvider()
          // await provider.request({
          //   method: 'wallet_switchEthereumChain',
          //   params: [{ chainId: POLYGON_NETWORK_PARAMS.chainId }],
          // })
        }
        tmpWeb3Provider = await embeddedWallet.getEthersProvider()
      } else {
        const curWallet = localStorage.getItem('wallet')
        let provider = window.ethereum?.providers?.find((provider: any) =>
          curWallet === 'Metamask'
            ? provider.isMetaMask
            : curWallet === 'Coinbase'
            ? provider.isCoinbaseWallet
            : provider.isTrustWallet,
        )
        if (!provider) {
          if (
            (window.ethereum?.isMetaMask && curWallet === 'Metamask') ||
            (window.ethereum?.isCoinbaseWallet && curWallet === 'Coinbase')
          ) {
            provider = window.ethereum
          }
        }
        tmpWeb3Provider = new ethers.providers.Web3Provider(provider)
      }
      setWeb3Provider(tmpWeb3Provider)
    }
    return tmpWeb3Provider
  }

  const getEthereumProvider = async () => {
    if (localStorage.getItem('wallet')) {
      if (localStorage.getItem('wallet') === 'Privy') {
        const embeddedWallet = wallets.find(
          wallet => wallet.walletClientType === 'privy',
        )
        if (embeddedWallet.chainId === 'eip155:1') {
          await embeddedWallet.switchChain(
            POLYGON_NETWORK_PARAMS.chainId as `0x${string}`,
          )
        }
        return await embeddedWallet.getEthereumProvider()
      } else {
        const curWallet = localStorage.getItem('wallet')
        let provider = window.ethereum?.providers?.find((provider: any) =>
          curWallet === 'Metamask'
            ? provider.isMetaMask
            : curWallet === 'Coinbase'
            ? provider.isCoinbaseWallet
            : provider.isTrustWallet,
        )
        if (!provider) {
          if (
            (window.ethereum?.isMetaMask && curWallet === 'Metamask') ||
            (window.ethereum?.isCoinbaseWallet && curWallet === 'Coinbase')
          ) {
            provider = window.ethereum
          }
        }
        return provider
      }
    }
  }

  const isValid = (
    methodName: string,
    player1contract: string,
    player1contractabi: any,
  ) => {
    let validTest = {}

    if (!methodName) {
      validTest = { ...validTest, isError: t('method name is required') }
    } else if (!player1contract) {
      validTest = {
        ...validTest,
        isError: t('host contract address is required'),
      }
    } else if (!player1contractabi) {
      validTest = { ...validTest, isError: t('host contract abi is required') }
    }
    return validTest
  }

  interface validationInstanceObj {
    isError?: string
  }

  const callWeb3Method = async (
    methodName: string,
    player1contract: string,
    player1contractabi: any,
    inputPrams: string[] | any, // 2nd player contract adddress
  ) => {
    const loginWallet = localStorage.getItem('loginInfo')
    const isValidInstace: validationInstanceObj = isValid(
      methodName,
      player1contract,
      player1contractabi,
    )
    const provider = await getWeb3Provider()
    const web3Promise = new Promise(function (resolve, reject) {
      try {
        if (loginWallet) {
          if (!isValidInstace?.isError) {
            const playerContract = new ethers.Contract(
              player1contract,
              player1contractabi,
              provider?.getSigner(loginWallet),
            )
            let tx = null
            if (inputPrams.length > 0) {
              tx = playerContract[methodName](...inputPrams, {
                gasLimit: 1000000,
              })
            } else {
              tx = playerContract[methodName]({
                gasLimit: 1000000,
              })
            }
            resolve(tx)
          } else {
            throw new Error(isValidInstace?.isError)
          }
        } else {
          throw new Error('406')
        }
      } catch (e) {
        reject(e)
      }
    })
    return web3Promise
  }

  const getStakingContract = async (
    stakingcontract: string,
    stakingcontractabi: string,
  ) => {
    const loginWallet = localStorage.getItem('loginInfo')
    if (loginWallet) {
      const provider = await getWeb3Provider()
      return new ethers.Contract(
        stakingcontract, // player contract address of the player coin
        stakingcontractabi, // player contract abi of the player coin
        provider?.getSigner(loginWallet), // signer of the currently logged in user wallet address
      )
    }
  }

  const getBalance = async () => {
    const curWallet = localStorage.getItem('wallet')
    if (curWallet === 'Trust' || curWallet === 'WalletConnect') {
      const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(
        POLYGON_NETWORK_RPC_URL,
      )
      const { account } = context
      if (account && localStorage.getItem('loginInfo')) {
        //localStorage.setItem('loginInfo', account ?? '')
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
    } else {
      const web3Provider = await getWeb3Provider()
      const signer = web3Provider.getSigner()
      web3Provider
        .getBalance(
          localStorage.getItem('loginInfo') ?? (await signer.getAddress()),
        )
        .then(balance => {
          // convert a currency unit from wei to ether
          const balanceInEth =
            Math.trunc(
              Number.parseFloat(ethers.utils.formatEther(balance)) * 10 ** 6,
            ) /
            10 ** 6
          localStorage.setItem('balance', balanceInEth.toString())
        })
    }
  }

  const sendWithWallet = async (
    receiverAddress: string,
    amount: string,
    successCallback?: any,
    errorCallBack?: any,
  ) => {
    const provider = await getEthereumProvider()
    const accounts = await provider.request({
      method: 'eth_requestAccounts',
    })
    const account = accounts[0]
    const from = localStorage.getItem('loginInfo')
    if (account.toLowerCase() !== from?.toLowerCase()) {
      return
    }

    const params = {
      from: ethers.utils.getAddress(from ? from : ''),
      to: ethers.utils.getAddress(receiverAddress),
      gas: '0x5208', // 21000
      maxFeePerGas: ethers.utils.parseEther('0.000001')._hex,
      value: ethers.utils.parseEther(amount.toString())._hex,
    }

    provider
      .request({
        method: 'eth_sendTransaction',
        params: [params],
      })
      .then((txHash: any) => {
        successCallback(txHash)
      })
      .catch((error: any) => {
        // If the request fails, the Promise will reject with an error.
        console.log({ error })
        errorCallBack(error)
      })
  }

  const sendTokenWithWallet = async (
    receiverAddress: string,
    playerCoinContract: string,
    amount: string,
    currentWallet?: string,
    successCallback?: any,
    errorCallBack?: any,
  ) => {
    const web3Provider = await getWeb3Provider()
    const tokenAbi: any = erc20Json //JSON.parse(erc20Json)
    // const web3 = new Web3(Web3.givenProvider)
    const tokenContract = new ethers.Contract(
      playerCoinContract, // player contract address of the player coin
      tokenAbi, // player contract abi of the player coin
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      web3Provider.getSigner(currentWallet!), // signer of the currently logged in user wallet address
    )
    try {
      const txn = await tokenContract.transfer(
        receiverAddress,
        ethers.utils.parseEther(amount.toString())._hex,
        {
          gasLimit: ethers.utils.hexlify(300000),
        },
      )
      successCallback(txn.hash)
    } catch (err: any) {
      errorCallBack(err.reason || err.message)
    }
  }

  return {
    web3Provider,
    getWeb3Provider,
    getEthereumProvider,
    getBalance,
    callWeb3Method,
    getStakingContract,
    sendWithWallet,
    sendTokenWithWallet,
  }
}
