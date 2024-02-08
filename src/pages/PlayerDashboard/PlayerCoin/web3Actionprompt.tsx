import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useContext,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import {
  getTxnConfirm,
  resetDraftNewPlayers,
  resetTxnConfirmationData,
  setTxnConfirmError,
  setTxnConfirmSuccess,
} from '@root/apis/playerCoins/playerCoinsSlice'
import ResponseAlert from '@components/ResponseAlert'
import classNames from 'classnames'
import { isMobile } from '@utils/helpers'
import BottomPopup from '@components/Dialog/BottomPopup'
import SubmitButton from '@components/Button/SubmitButton'
import MetamaskIcon from '@assets/icons/icon/metamask.svg'
import CoinbaseIcon from '@assets/icons/icon/coinbase.svg'
import WalletIcon from '@assets/icons/icon/wallet.webp'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'

import ReactCanvasConfetti from 'react-canvas-confetti'
import ImageComponent from '@components/ImageComponent'
import { ConnectContext } from '@root/WalletConnectProvider'
import { getUserXp } from '@root/apis/onboarding/authenticationSlice'
import { BASE_EXPLORE_URL } from '@root/constants'
interface Props {
  promptText: string
  txnHash: string
  onClose: () => void
  onSuccess: () => void
  walletAddress: string
  errorMsg: string
  isPromptLoading?: boolean
  operationMode?: string
  isPayout?: boolean
  isDispatch?: boolean
  isRewardPerc?: boolean
  getRewardPerc?: boolean
  getRewardPercValue?: any
  getPayoutAddress?: any
  draftingPer?: boolean
  getDraftingPercentage?: any
  customClass?: string
  paddingClass?: string
}

let txnCheckInterval: any = null
const canvasStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
} as React.CSSProperties
const Web3ActionPrompt: React.FC<Props> = ({
  onClose,
  onSuccess,
  walletAddress,
  promptText,
  txnHash,
  errorMsg,
  isPromptLoading = false,
  operationMode = 'add',
  isPayout,
  isDispatch,
  isRewardPerc,
  getPayoutAddress,
  customClass = '',
  paddingClass = '',
}) => {
  const walletType = localStorage.getItem('wallet')
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [isLoading, setLoading] = useState(false)
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const { isTxnChecking, txnConfirmResp } = playerCoinData
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  console.log({ operationMode })

  const { selectedThemeRedux } = authenticationData
  const { getTxnStatus } = useContext(ConnectContext)
  const loginInfo = localStorage.getItem('loginInfo')
  useEffect(() => {
    return () => {
      clearInterval(txnCheckInterval)
      dispatch(resetDraftNewPlayers())
      dispatch(resetTxnConfirmationData())
    }
  }, [])

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

  useEffect(() => {
    if (
      txnConfirmResp[0]?.haserror === 0 ||
      txnConfirmResp[0]?.haserror === 1
    ) {
      clearInterval(txnCheckInterval)
    }
  }, [txnConfirmResp])

  useEffect(() => {
    setLoading(isPromptLoading)
  }, [isPromptLoading])

  const handleInitRemoveAdminPlayer = () => {
    setLoading(true)
    onSuccess()
  }

  const handleClose = async () => {
    await clearInterval(txnCheckInterval)
    onClose()
  }

  const cancelRemoveAdminPlayer = () => {
    handleClose()
  }

  const handleTxnCheck = () => {
    if (loginInfo) {
      // console.log('get Txn status called')
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
      if (isDispatch) {
        setTimeout(() => {
          getPayoutAddress()
        }, 5000)
      }
    }
  }, [isTxnChecking, txnConfirmResp[0]])

  // const privyDialogRef = useRef(null)
  // useEffect(() => {
  //   const handleMutations = mutationsList => {
  //     mutationsList.forEach(mutation => {
  //       if (mutation.type === 'childList') {
  //         const privyDialog = document.getElementById('privy-dialog')
  //         if (privyDialog) {
  //           privyDialogRef.current = privyDialog
  //         }
  //         const privyDialogExist = privyDialogRef.current
  //         if (privyDialogExist) {
  //           if (!document.body.contains(privyDialogExist)) {
  //             handleClose()
  //           }
  //         }
  //       }
  //     })
  //   }
  //   const observer = new MutationObserver(handleMutations)
  //   observer.observe(document.body, { childList: true, subtree: true })
  //   return () => {
  //     observer.disconnect()
  //   }
  // }, [])

  return (
    <section className="new-draft">
      <BottomPopup
        mode={classNames(
          'wallet drafting-players-loader',
          !isPromptLoading ? 'vertical-flex' : '',
          customClass,
        )}
        isOpen={isLoading || txnHash.length > 0}
      >
        {!isPromptLoading ? (
          <>
            <ImageComponent
              loading="lazy"
              src={
                walletType === 'Metamask'
                  ? MetamaskIcon
                  : walletType === 'Privy'
                  ? WalletIcon
                  : CoinbaseIcon
              }
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
          </>
        ) : null}
        {/* {console.log(
          'loader issue',

          isLoading,
          txnHash,
          errorMsg,
          txnConfirmResp.length,
          txnConfirmResp[0]?.haserror,
        )} */}
        {isLoading && !txnHash && !errorMsg ? (
          <>
            <div className="checkout-loader-wrapper mt-40">
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            </div>
            <div className="close-button" onClick={handleClose}>
              {t('close')}
            </div>
          </>
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
                      className={classNames(
                        'spinner check-spinner',
                        isLoading ? '' : 'hidden',
                      )}
                    ></div>
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
            ) : (isPayout && !errorMsg) || (isRewardPerc && !errorMsg) ? (
              <div className="checkout-loader-wrapper mt-40">
                <div className="loading-spinner">
                  <div className="spinner"></div>
                </div>
              </div>
            ) : (
              <div className="txn-err-wrapper">
                <CancelOutlinedIcon className="response-icon error-icon" />
                <span>{t('transaction failed')}</span>
                <div className="input-feedback">{errorMsg}</div>
              </div>
            )}
            <div className={classNames('close-button')} onClick={handleClose}>
              {t('close')}
            </div>
          </>
        )}
        <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
      </BottomPopup>
      <div
        className={classNames(
          'remove-adminplayer-prompt-wrapper',
          walletType ? '' : 'no-wallet',
        )}
      >
        {walletType ? (
          <div className={paddingClass}>
            <div className="new-draft-title">{promptText}</div>
            <div
              className={classNames(
                'new-draft-title eth-address',
                operationMode === 'add' ? 'success' : 'error',
              )}
            >
              {walletAddress}
            </div>
            <div className="mt-10">
              <SubmitButton
                title={t('yes')}
                className="m-0auto mt-20"
                onPress={() => handleInitRemoveAdminPlayer()}
              />
              <SubmitButton
                title={t('no')}
                className="m-0auto mt-20 btn-disabled"
                onPress={() => cancelRemoveAdminPlayer()}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="txn-err-wrapper wallet-err-wrapper">
              <ResponseAlert status={'Error'} />
              <div className="input-feedback">
                {t('service unavailable for internal users')}
              </div>
            </div>
            <div className="close-button">{t('close')}</div>
          </>
        )}
      </div>
    </section>
  )
}

export default Web3ActionPrompt
