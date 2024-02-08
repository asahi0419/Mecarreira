/* eslint-disable no-unused-vars */
import React, { useContext, useEffect } from 'react'
import Modal from 'react-modal'
import classnames from 'classnames'
import '@assets/css/components/WalletModal.css'
import MetamaskIcon from '@assets/icons/icon/metamask.svg'
import CoinbaseIcon from '@assets/icons/icon/coinbase.svg'
import TrustIcon from '@assets/icons/icon/trust.svg'
import WalletConnectIcon from '@assets/icons/icon/walletconnect.svg'
import { ConnectContext } from '@root/WalletConnectProvider'
import { useDispatch } from 'react-redux'
import {
  loginWithWallet,
  walletConnectCheck,
  resetExternalWalletSuccess,
} from '@root/apis/onboarding/authenticationSlice'
import ImageComponent from '@components/ImageComponent'

interface Props {
  isOpen: boolean
  onClick: (v?: any) => void
  onClose: (v?: any) => void
}

Modal.setAppElement('#root')

const WalletModal: React.FC<Props> = ({ isOpen, onClick, onClose }) => {
  const dispatch = useDispatch()
  const { connectStatus, connect, setAccount, verifyConnect } =
    useContext(ConnectContext)

  const handleConnect = async (wallet: string) => {
    // const verify = await verifyConnect(wallet)
    console.log('showing_connect_confirm2')
    dispatch(
      walletConnectCheck({
        walletConnectConfirmPopUp: true,
        walletType: wallet,
      }),
    )
    // if (verify) {
    //   await connect(wallet)
    // } else {
    //   dispatch(
    //     walletConnectCheck({
    //       walletConnectConfirmPopUp: true,
    //       walletType: wallet,
    //     }),
    //   )
    // }
  }

  const loginId = localStorage.getItem('loginId')

  useEffect(() => {
    if (!loginId && connectStatus) {
      setAccount()
      console.log('for test loginWithWallet 110')
      dispatch(loginWithWallet(null))
      onClick()
    }
  }, [connectStatus])

  return (
    <div
      id="walletModal"
      className={classnames('modal', 'wallet-modal', isOpen ? 'show' : '')}
    >
      <div className="wallet-modal-content">
        <div className="close_end_wrapper">
          <button className="close_end">
            <span onClick={onClose}>&times;</span>
          </button>
        </div>
        <div
          className="wallet-modal-btn"
          onClick={() => handleConnect('WalletConnect')}
        >
          <ImageComponent
            loading="lazy"
            src={WalletConnectIcon}
            alt="walletconnect-icon"
          />
          <span>WalletConnect</span>
        </div>
        <div
          className="wallet-modal-btn"
          onClick={() => handleConnect('Metamask')}
        >
          <ImageComponent
            loading="lazy"
            src={MetamaskIcon}
            alt="metamask-icon"
          />
          <span>Metamask</span>
        </div>
        <div
          className="wallet-modal-btn"
          onClick={() => handleConnect('Coinbase')}
        >
          <ImageComponent
            loading="lazy"
            src={CoinbaseIcon}
            alt="coinbase-icon"
          />
          <span>Coinbase</span>
        </div>
        <div
          className="wallet-modal-btn"
          onClick={() => handleConnect('Trust')}
        >
          <ImageComponent loading="lazy" src={TrustIcon} alt="trust-icon" />
          <span>Trust</span>
        </div>
      </div>
    </div>
  )
}

export default WalletModal
