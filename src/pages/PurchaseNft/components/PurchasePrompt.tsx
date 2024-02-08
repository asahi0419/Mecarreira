import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import SubmitButton from '@components/Button/SubmitButton'
import MetamaskIcon from '@assets/icons/icon/metamask.svg'
import CoinbaseIcon from '@assets/icons/icon/coinbase.svg'
import WalletIcon from '@assets/icons/icon/wallet.webp'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import { useDispatch, useSelector } from 'react-redux'
import ReactCanvasConfetti from 'react-canvas-confetti'
import { ethers } from 'ethers'
import { isMobile } from '@utils/helpers'
import { RootState } from '@root/store/rootReducers'
import ImageComponent from '@components/ImageComponent'
import { getUserXp } from '@root/apis/onboarding/authenticationSlice'
import { resetTxnConfirmationData } from '@root/apis/playerCoins/playerCoinsSlice'
import { useWalletHelper } from '@utils/WalletHelper'
import { BASE_EXPLORE_URL } from '@root/constants'
let txnCheckInterval: any = null

interface Props {
  promptText: string
  onClose: () => void
  operationMode?: string
  walletAddress?: string
  hideWalletAddress?: boolean
  actionMode?: string
  contract?: string
  callBack?: any
}

const PurchasePrompt: React.FC<Props> = ({
  onClose,
  promptText,
  operationMode = 'add',
  walletAddress,
  hideWalletAddress = false,
  contract = '',
  callBack,
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  // confetti
  const canvasStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  } as React.CSSProperties
  const refAnimationInstance = useRef<any>(null)
  const { getWeb3Provider } = useWalletHelper()

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
  const [confirmApprove, setConfirmApprove] = useState(false)
  const { player1contractabi, proxyContract, player2contractabi } = useSelector(
    (state: RootState) => state.playercoins,
  )
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const { selectedThemeRedux } = authenticationData
  const [txnHash, setTxnHash] = useState('')
  const [txnError, setTxnError] = useState('')
  const walletType = localStorage.getItem('wallet')
  const loginInfo = localStorage.getItem('loginInfo')
  const [receipt, setReceipt] = useState(false)

  useEffect(() => {
    return () => {
      clearInterval(txnCheckInterval)
      dispatch(resetTxnConfirmationData())
    }
  }, [])

  useEffect(() => {
    if (receipt) {
      setTimeout(() => {
        callBack()
      }, 3000)
    }
  }, [receipt])

  const txnStatus = async txnHash => {
    const provider = await getWeb3Provider()
    const receipt = await provider.getTransactionReceipt(txnHash)
    try {
      if (receipt?.status === 1) {
        setReceipt(true)
        fire()
        dispatch(getUserXp(false))
      }
      setConfirmApprove(true)
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    if (txnHash && receipt) {
      clearInterval(txnCheckInterval)
    } else if (txnHash) {
      handleTxnCheck()
    }
  }, [txnHash, receipt])

  const handleTxnCheck = () => {
    txnStatus(txnHash)
    txnCheckInterval = setInterval(() => {
      txnStatus(txnHash)
    }, 10000)
  }

  useEffect(() => {
    clearInterval(txnCheckInterval)
    if (!document.hidden) {
      if (txnHash) {
        handleTxnCheck()
      }
    }
  }, [document.hidden])

  const buyForExternalWalletProxyApprove = async currencyContract => {
    if (walletType) {
      const provider = await getWeb3Provider()
      const playerContract = new ethers.Contract(
        currencyContract, // contract address of Router
        player2contractabi || player1contractabi, //  contract abi of Router
        //eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        provider.getSigner(loginInfo!),
      )

      try {
        const options = {
          amountIn: ethers.utils.parseEther(
            '115792089237316195423570985008687907853269984665640564039457.584007913129639935',
          ),
        }
        const tx = await playerContract.approve(
          proxyContract,
          options.amountIn,
          {
            gasLimit: ethers.utils.hexlify(1000000),
          },
        )
        setTxnHash(tx.hash)
      } catch (err: any) {
        const isErrorGasEstimation = `${err}`.includes('cannot estimate gas')
        if (err.message === '406') {
          setTxnError(t('this functionality unavailable for internal users'))
        }
        if (isErrorGasEstimation) {
          setTxnError(t('not enough funds to pay for blockchain transaction'))
        } else {
          setTxnError(err.reason || err.message)
        }
      }
    } else {
      setTxnError(t('this functionality unavailable for internal users'))
    }
  }

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
  //             onClose()
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
    <section className="new-draft" style={{ height: '100% !important' }}>
      {confirmApprove ? (
        <section
          className="new-draft vertical-flex buy-fly"
          style={{ height: '100%' }}
        >
          {walletType ? (
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
                className="draftee-metamaskicon"
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
          ) : (
            <div className="draftee-metamaskicon"></div>
          )}
          {!txnHash && !txnError ? (
            <div className="checkout-loader-wrapper draftee-propmt mt-40">
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
              <div
                className="close-button"
                onClick={() => {
                  onClose()
                }}
                style={{ color: '#fff' }}
              >
                {t('close')}
              </div>
            </div>
          ) : (
            <>
              {txnHash ? (
                <div
                  style={{ height: '50px' }}
                  className={classNames(
                    'add-draftee-success',
                    'web3action-success',
                    'mt-20',
                  )}
                >
                  <div className="check-container-txn">
                    <CheckCircleOutlinedIcon className="response-icon success-icon web3-success-check" />
                    {receipt === false ? (
                      <div
                        className={classNames('spinner check-spinner')}
                      ></div>
                    ) : (
                      <>
                        {receipt === true ? (
                          <CheckCircleOutlinedIcon className="response-icon success-icon web3-success-check" />
                        ) : (
                          <CancelOutlinedIcon className="response-icon error-icon" />
                        )}
                      </>
                    )}
                  </div>
                  <span>{t('transaction sent')}</span>
                  {receipt === true ? (
                    <span
                      style={{
                        fontSize: isMobile() ? '20px' : '17px',
                        margin: 'unset',
                      }}
                      className={classNames(
                        receipt === true
                          ? 'txn-confirm-success'
                          : 'txn-confirm-error',
                      )}
                    >
                      {!confirmApprove && receipt === true
                        ? t('transaction confirmed')
                        : !confirmApprove && receipt === true
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
                  <div className="input-feedback">{txnError}</div>
                </div>
              )}

              <div className="bottom-close mb-20">
                <div
                  className="close-button"
                  onClick={() => {
                    onClose()
                  }}
                >
                  {t('close')}
                </div>
              </div>
            </>
          )}
          <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
        </section>
      ) : (
        <div className="remove-adminplayer-prompt-wrapper">
          <div className="new-draft-title">{promptText}</div>
          {hideWalletAddress ? (
            <div
              className={classNames(
                'new-draft-title eth-address',
                operationMode === 'add' ? 'success' : 'error',
              )}
            >
              {walletAddress ?? localStorage.getItem('userWalletAddress')}
            </div>
          ) : (
            ''
          )}
          <div className="mt-10">
            <SubmitButton
              title={t('yes')}
              className="m-0auto mt-20"
              onPress={() => {
                setConfirmApprove(true)
                buyForExternalWalletProxyApprove(contract)
              }}
            />
            <SubmitButton
              title={t('no')}
              className="m-0auto mt-20 btn-disabled"
              onPress={onClose}
            />
          </div>
        </div>
      )}
    </section>
  )
}

export default PurchasePrompt
