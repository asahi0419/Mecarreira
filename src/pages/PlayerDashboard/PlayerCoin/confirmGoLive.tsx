import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useContext,
} from 'react'
import { AppLayout } from '@components/index'
import { useNavigate } from 'react-router-dom'
import '@assets/css/pages/PurchaseNft.css'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import SubmitButton from '@components/Button/SubmitButton'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { isMobile } from '@utils/helpers'
import BottomPopup from '@components/Dialog/BottomPopup'
import MetamaskIcon from '@assets/icons/icon/metamask.svg'
import CoinbaseIcon from '@assets/icons/icon/coinbase.svg'
import WalletIcon from '@assets/icons/icon/wallet.webp'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import {
  getTxnConfirm,
  launchCoin,
  resetTxnConfirmationData,
  setTxnConfirmError,
  setTxnConfirmSuccess,
} from '@root/apis/playerCoins/playerCoinsSlice'
import ApiBottomPopup from '@components/Dialog/ApiBottomPopup'

import ReactCanvasConfetti from 'react-canvas-confetti'
import ImageComponent from '@components/ImageComponent'
import Web3 from 'web3'
import { ConnectContext } from '@root/WalletConnectProvider'
import { getUserXp } from '@root/apis/onboarding/authenticationSlice'
import { useWalletHelper } from '@utils/WalletHelper'
import { BASE_EXPLORE_URL } from '@root/constants'

let txnCheckInterval: any = null
const canvasStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
} as React.CSSProperties

const ConfirmGoLive: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const walletType = localStorage.getItem('wallet')
  const [txnErr, setTxnErr] = useState('')
  const [txnHash, setTxnHash] = useState<string>('')
  const [isGoLiveInProgress, setIsGoLiveInProgress] = useState<boolean>(false)
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const dispatch = useDispatch()
  const {
    selectedPlayer,
    nftcontract,
    stakingcontract,
    player1contract,
    player1contractabi,
    isTxnChecking,
    txnConfirmResp,
  } = playerCoinData

  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const { callWeb3Method } = useWalletHelper()

  const { selectedThemeRedux } = authenticationData
  const { getTxnStatus } = useContext(ConnectContext)
  const loginInfo = localStorage.getItem('loginInfo')

  const handleGoBack = async (value: boolean) => {
    if (value) {
      // handleLiving()
      // setIsGoLiveInProgress(true)
      handleLaunchCoinApi()
      navigate(-1)
    } else {
      navigate(-1)
    }
  }

  useEffect(() => {
    return () => {
      clearInterval(txnCheckInterval)
      dispatch(resetTxnConfirmationData())
    }
  }, [])

  const handleLiving = async () => {
    setIsGoLiveInProgress(true)
    if (!player1contract) {
      return
    }
    const nftContract = Web3.utils.toChecksumAddress(nftcontract)
    const stakingContract = Web3.utils.toChecksumAddress(stakingcontract)
    const promise = callWeb3Method(
      'initialize',
      player1contract,
      player1contractabi,
      [nftContract, stakingContract],
    )
    promise
      .then(async (txn: any) => {
        setTxnHash(txn.hash)
        localStorage.setItem('ISGOLIVECLICKED', 'true')
      })
      .catch((err: any) => {
        const isErrorGasEstimation = `${err}`.includes('cannot estimate gas')
        if (err.message === '406') {
          setTxnErr(t('this functionality unavailable for internal users'))
        }
        if (isErrorGasEstimation) {
          setTxnErr(t('not enough funds to pay for blockchain transaction'))
        } else {
          setTxnErr(err.reason || err.message)
        }
      })
  }

  const onClose = async () => {
    clearInterval(txnCheckInterval)
    if (txnHash) {
      await localStorage.setItem('optedGoLive', 'true')
    }
    navigate(-1)
  }

  useEffect(() => {
    if (txnHash) {
      handleTxnCheck()
    }
  }, [txnHash])

  useEffect(() => {
    clearInterval(txnCheckInterval)
    if (!document.hidden) {
      if (txnHash) {
        handleTxnCheck()
      }
    }
  }, [document.hidden])

  const handleTxnCheck = () => {
    if (loginInfo) {
      getTxnStatus(txnHash)
        .then(txn => dispatch(setTxnConfirmSuccess(txn?.status)))
        .catch(() => dispatch(setTxnConfirmError()))
    } else {
      dispatch(getTxnConfirm(txnHash))
      txnCheckInterval = setInterval(() => {
        dispatch(getTxnConfirm(txnHash))
      }, 10000)
    }
  }

  const handleLaunchCoinApi = (user_secret: any) => {
    const formData = new FormData()
    formData.append('contract', selectedPlayer?.playercontract)
    formData.append('user_secret', user_secret)
    dispatch(launchCoin(formData))
  }

  // confetti
  const refAnimationInstance = useRef<any>(null)

  const getInstance = useCallback(instance => {
    refAnimationInstance.current = instance
  }, [])

  const makeShot = useCallback((particleRatio, opts) => {
    refAnimationInstance.current &&
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio),
      })
  }, [])

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    })

    makeShot(0.2, {
      spread: 60,
    })

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    })

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    })

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    })
  }, [makeShot])

  useEffect(() => {
    if (!isTxnChecking && txnConfirmResp[0]?.haserror === 0) {
      fire()
      dispatch(getUserXp(false))
    }
  }, [isTxnChecking, txnConfirmResp[0]])

  return (
    <AppLayout
      headerStatus="header-status"
      headerClass="home"
      footerStatus="footer-status"
      noPageFooter={true}
    >
      <section className="player-dashboard-container">
        {/* {localStorage.getItem('loginId') ? (
          <ApiBottomPopup
            showPopup={isGoLiveInProgress}
            onSubmit={handleLaunchCoinApi}
            onClose={onClose}
            customClass={'go-live-web3 purchase-pc-bottomwrapper'}
          />
        ) : (
          <BottomPopup
            mode={classNames('wallet drafting-players-loader', 'vertical-flex')}
            isOpen={isGoLiveInProgress || txnHash.length > 0}
          >
            <ImageComponent
              loading="lazy"
              src={walletType === 'Metamask' ? MetamaskIcon : walletType === 'Privy' ? WalletIcon : CoinbaseIcon}
              alt="metamask-icon"
            />
              {walletType === 'Privy' ? (
                <div className="input-label approve-blockchain internal-mechanism-note">
                  {t('sending_transaction_to_the_blockchain')}
                </div>
              ) : (
                <div className="input-label approve-blockchain">
                  {t('please approve the blockchain transaction') +
                    ' ' +
                    walletType}
                </div>
              )}
            {isGoLiveInProgress && !txnHash && !txnErr ? (
              <div className={classNames('checkout-loader-wrapper', 'mt-40')}>
                <div className="loading-spinner">
                  <div className="spinner">
                  </div>
                </div>
                <div className="bottom-close w3actionprompt-close">
                  <div className="close-button" onClick={onClose}>
                    {t('close')}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {txnHash ? (
                  <div
                    className={classNames(
                      'purchase-submit-wrapper',
                      'btn-purchase',
                      'web3action-success mt-20',
                    )}
                  >
                    <div className="check-container-txn">
                      <CheckCircleOutlinedIcon className="response-icon success-icon web3-success-check" />
                      {txnConfirmResp.length === 0 ? (
                        <div
                          className={classNames('spinner check-spinner')}
                        >
                        </div>
                      ) : (
                        <>
                          {txnConfirmResp[0]?.haserror === 0 ? (
                            <CheckCircleOutlinedIcon className="response-icon success-icon web3-success-check" />
                          ) : (
                            <CancelOutlinedIcon className="response-icon error-icon" />
                          )}
                        </>
                      )}
                    </div>
                    <span>{t('transaction sent')}</span>
                    {txnConfirmResp.length > 0 ? (
                      <span
                        style={{
                          fontSize: isMobile() ? '20px' : '17px',
                          margin: 'unset',
                        }}
                        className={classNames(
                          txnConfirmResp[0]?.haserror === 0
                            ? 'txn-confirm-success'
                            : 'txn-confirm-error',
                        )}
                      >
                        {!isTxnChecking && txnConfirmResp[0]?.haserror === 0
                          ? t('transaction confirmed')
                          : !isTxnChecking && txnConfirmResp[0]?.haserror === 1
                          ? t('transaction failed')
                          : ''}
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: isMobile() ? '20px' : '17px',
                          color: 'var(--primary-text-color)',
                        }}
                      >
                        {t('confirming transaction') + '...'}
                      </span>
                    )}
                    {txnHash && (
                      <a
                        className="tx-link button-box"
                        href={`${BASE_EXPLORE_URL}/tx/${txnHash}`}
                        target="_blank"
                      >
                        {t('show transaction')}
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="txn-err-wrapper">
                    <CancelOutlinedIcon className="response-icon error-icon" />
                    <span>{t('transaction failed')}</span>
                    <div className="input-feedback">{txnErr}</div>
                  </div>
                )}

                <div className="bottom-close">
                  <div className={classNames('close-button')} onClick={onClose}>
                    {t('close')}
                  </div>
                </div>
              </>
            )}
            <ReactCanvasConfetti
              refConfetti={getInstance}
              style={canvasStyles}
            />
          </BottomPopup>
        )} */}
        <ApiBottomPopup
          showPopup={isGoLiveInProgress}
          onSubmit={handleLaunchCoinApi}
          onClose={onClose}
          customClass={'go-live-web3 purchase-pc-bottomwrapper'}
          noPasswordForm={true}
        />
        <section className="new-draft">
          <div className={classNames('remove-adminplayer-prompt-wrapper')}>
            <div className="new-draft-title">
              {t('you are about to switch on your player coin')}
            </div>
            <div
              className={classNames('new-draft-title eth-address', 'success')}
            ></div>
            <div className="mt-10">
              <SubmitButton
                title={t('yes')}
                className="m-0auto mt-20"
                onPress={() => handleGoBack(true)}
              />
              <SubmitButton
                title={t('cancel')}
                className="m-0auto mt-20 btn-disabled"
                onPress={() => handleGoBack(false)}
              />
            </div>
          </div>
        </section>
      </section>
    </AppLayout>
  )
}

export default ConfirmGoLive
