import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useContext,
} from 'react'
import AddIcon from '@mui/icons-material/Add'
import SearchBar from '@components/SearchBar'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import {
  createDraft,
  fetchDraftNewPlayers,
  getPlayer1Contract,
  getPlayer2Contract,
  getPlayerData,
  getTxnConfirm,
  resetDraftNewPlayers,
  resetTxnConfirmationData,
  setShowNewDraftPopupRedux,
  getPlayerDrafts,
  setTxnConfirmSuccess,
  setTxnConfirmError,
} from '@root/apis/playerCoins/playerCoinsSlice'
import classNames from 'classnames'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  getCircleColor,
  getCountryCode,
  getCountryNameNew,
  isMobile,
} from '@utils/helpers'
import BottomPopup from '@components/Dialog/BottomPopup'
import { useNavigate } from 'react-router-dom'
import SubmitButton from '@components/Button/SubmitButton'
import MetamaskIcon from '@assets/icons/icon/metamask.svg'
import CoinbaseIcon from '@assets/icons/icon/coinbase.svg'
import WalletIcon from '@assets/icons/icon/wallet.webp'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import TooltipLabel from '@components/TooltipLabel'
import UserAvatar from '@assets/images/user_avatar.webp'
import ApiBottomPopup from '@components/Dialog/ApiBottomPopup'

import ReactCanvasConfetti from 'react-canvas-confetti'
import debounce from 'lodash.debounce'
import ImageComponent from '@components/ImageComponent'
import { ConnectContext } from '@root/WalletConnectProvider'
import { getUserXp } from '@root/apis/onboarding/authenticationSlice'
import { useWalletHelper } from '@utils/WalletHelper'
import { BASE_EXPLORE_URL } from '@root/constants'
interface Props {
  onClose: any
}
interface DraftFiltersData {
  limit?: any
  offset?: any
  sorted_by?: string
  q?: string
  reverse?: string
  status_id?: number[]
}

const canvasStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
} as React.CSSProperties

const overflowYStyle = {
  overflowY: 'auto',
} as React.CSSProperties

let txnCheckInterval: any = null

const NewDraft: React.FC<Props> = () => {
  const { t } = useTranslation()
  const walletType = localStorage.getItem('wallet')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [txnHash, setTxnHash] = useState('')
  const [allPlayers, setAllPlayers] = useState<any>([])
  const [searchFocussed, setSearchFocussed] = useState<any>(false)
  const [isLoading, setLoading] = useState(false)
  const [isDeadEnd, setIsDeadEnd] = useState(false)
  const [targetPlayer, setTargetPlayer] = useState('')
  const [txnError, setTxnError] = useState('')
  const [appliedFilters, setAppliedFilters] = useState<DraftFiltersData>({
    sorted_by: 'market_cap',
    reverse: 'True',
    status_id: [3, 4],
    limit: 10,
    offset: 0,
  })
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { selectedThemeRedux } = authenticationData
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const {
    deployedPlayersList,
    playerCoinActiveTab,
    isDraftPlayersLoading,
    nextDeployedPlayerListUrl,
    previousDeployedPlayerListUrl,
    isFetchDeployedPlayerSuccess,
    isGetPlayerError,
    isTxnChecking,
    txnConfirmResp,
  } = playerCoinData

  const {
    allPlayersData,
    selectedPlayer,
    player2contract,
    player1contract,
    player1contractabi,
  } = useSelector((state: RootState) => state.playercoins)

  const { callWeb3Method } = useWalletHelper()

  const [showBottomPopup, setShowBottomPopup] = useState<boolean>(false)
  const { getTxnStatus } = useContext(ConnectContext)
  const loginInfo = localStorage.getItem('loginInfo')

  const handleDraftPlayer = async (playerItem: any) => {
    const { detailpageurl, name } = playerItem
    await setSearchFocussed(false)
    setTargetPlayer(name)
    dispatch(getPlayer2Contract(detailpageurl))
  }

  useEffect(() => {
    if (!playerCoinActiveTab) {
      console.log('test5')
      navigate('/app/player-dashboard')
    }
  }, [playerCoinActiveTab])

  useEffect(() => {
    if (!player1contract || !player1contractabi) {
      console.log('fetching_player_data4')
      dispatch(getPlayerData({}))
    }
  }, [player1contract, player1contractabi])

  useEffect(() => {
    if (!player1contract || !player1contractabi) {
      dispatch(getPlayer1Contract({ url: selectedPlayer?.detailpageurl }))
    }
  }, [allPlayersData])

  useEffect(() => {
    if (appliedFilters?.limit || appliedFilters?.offset) {
      dispatch(
        fetchDraftNewPlayers({
          ...appliedFilters,
          player_contract: player1contract,
        }),
      )
    }
  }, [appliedFilters])

  useEffect(() => {
    if (appliedFilters.limit || appliedFilters.offset) {
      if (appliedFilters.q) {
        const url_string = nextDeployedPlayerListUrl
        let obj: any = null
        if (url_string) {
          const url = new URL(url_string)
          obj = {
            limit: url.searchParams.get('limit'),
            offset: url.searchParams.get('offset'),
          }
        } else {
          obj = {
            limit: appliedFilters.limit,
            offset: appliedFilters.offset,
          }
        }
        if (appliedFilters.offset === obj.offset) {
          setIsDeadEnd(true)
          setAllPlayers(deployedPlayersList)
        } else {
          setAllPlayers([...allPlayers, ...deployedPlayersList])
        }
      } else {
        if (deployedPlayersList.length > 0 && isFetchDeployedPlayerSuccess) {
          setAllPlayers([...allPlayers, ...deployedPlayersList])
        } else if (
          deployedPlayersList.length === 0 &&
          isFetchDeployedPlayerSuccess
        ) {
          setIsDeadEnd(true)
        }
      }
    } else {
      setAllPlayers(deployedPlayersList)
    }
  }, [deployedPlayersList])

  useEffect(() => {
    return () => {
      setTxnHash('')
      clearInterval(txnCheckInterval)
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

  const handleCreateDraft = async () => {
    setLoading(true)
    console.log('createDraft2')
    if (localStorage.getItem('loginId')) {
      setShowBottomPopup(true)
      return
    }
    console.log({
      player1contract,
      player2contract,
    })
    const promise = callWeb3Method(
      'createDraftRequest',
      player1contract, // "0xb6000dffb543008bd7f9cda2615608828f0bf904"
      player1contractabi, // abi of player 1 contract
      [player2contract], // 0xa1eff55865575ddf81c2c5727490524dd56da5e4
    )
    promise
      .then((txn: any) => {
        setTxnHash(txn.hash)
        setLoading(false)
      })
      .catch((err: any) => {
        setLoading(false)
        const isErrorGasEstimation = `${err}`.includes('cannot estimate gas')
        if (err.message === '406') {
          setTxnError(t('this functionality unavailable for internal users'))
        }
        if (isErrorGasEstimation) {
          setTxnError(t('not enough funds to pay for blockchain transaction'))
        } else {
          setTxnError(err.reason || err.message)
        }
      })
  }

  const handleCreateDraftApi = (user_secret: any) => {
    const formData = new FormData()
    formData.append('drafter_address', player2contract)
    formData.append('user_secret', user_secret)
    dispatch(createDraft(formData))
  }

  const handleSearch = (value: string | undefined) => {
    setAllPlayers([])
    setIsDeadEnd(false)
    let request: any = {}
    request = {
      limit: '10',
      offset: '0',
      search: value || '',
    }
    if (!value) {
      delete request.q
    }
    setAppliedFilters({ ...appliedFilters, ...request })
  }
  const optimizedHandleSearch = useCallback(debounce(handleSearch, 500), [])
  const handleReset = () => {
    setAllPlayers([])
    const request: any = {
      sorted_by: 'market_cap',
      reverse: 'True',
      status_id: [3, 4],
      limit: 10,
      offset: 0,
    }
    setAppliedFilters(request)
    setIsDeadEnd(false)
  }

  useEffect(() => {
    return () => {
      clearInterval(txnCheckInterval)
      dispatch(resetDraftNewPlayers())
    }
  }, [])

  const getUrlParams = (url: string, param1: string, param2: string) => {
    const url_string = url
    if (url_string) {
      const newUrl = new URL(url_string)
      const obj: any = new Object()
      obj[param1] = newUrl.searchParams.get(param1)
      obj[param2] = newUrl.searchParams.get(param2)
      return obj
    }
    return {}
  }

  const handleJumpToPage = (head: string) => {
    if (head === 'back') {
      const paginationParams = getUrlParams(
        previousDeployedPlayerListUrl,
        'limit',
        'offset',
      )
      setAppliedFilters({ ...appliedFilters, ...paginationParams })
    } else {
      const paginationParams = getUrlParams(
        nextDeployedPlayerListUrl,
        'limit',
        'offset',
      )
      if (nextDeployedPlayerListUrl) {
        setAppliedFilters({ ...appliedFilters, ...paginationParams })
      }
    }
  }

  const handleClose = () => {
    setLoading(false)
    setSearchFocussed(false)
    setTxnHash('')
    setTargetPlayer('')
    setShowBottomPopup(false)
    if (isMobile()) {
      navigate(-1)
    } else {
      dispatch(setShowNewDraftPopupRedux({ showNewDraftPopupRedux: false }))
      dispatch(getPlayerDrafts(player1contract))
    }
  }

  const handleCloseBottomPopup = () => {
    clearInterval(txnCheckInterval)
    setLoading(false)
    setSearchFocussed(false)
    setTxnHash('')
    setTargetPlayer('')
    setTxnError('')
    dispatch(resetTxnConfirmationData())
    if (isMobile()) {
      navigate(-1)
    } else {
      dispatch(setShowNewDraftPopupRedux({ showNewDraftPopupRedux: false }))
      dispatch(getPlayerDrafts(player1contract))
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
  //             handleCloseBottomPopup()
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
    <section
      className={classNames(
        'new-draft',
        isMobile() ? 'new-draft-internal' : '',
        isMobile() ? 'maxwidth player-dashboard-container mt-0' : '',
      )}
    >
      <BottomPopup
        mode="wallet drafting-players-loader"
        isOpen={
          (isLoading || searchFocussed || txnHash || targetPlayer) &&
          !showBottomPopup
        }
      >
        <section
          className="new-draft vertical-flex draftee-fly"
          style={isMobile() ? overflowYStyle : undefined}
        >
          {targetPlayer && !txnHash && !txnError && !isLoading ? (
            <div className="remove-adminplayer-prompt-wrapper">
              <div className="new-draft-title">
                {t('are you sure you want to add this player as draftee')}
              </div>
              <div
                className={classNames('new-draft-title eth-address', 'success')}
              >
                {targetPlayer}
              </div>
              <div className="mt-10">
                <SubmitButton
                  title={t('yes')}
                  className="m-0auto mt-20"
                  onPress={() => handleCreateDraft()}
                />
                <SubmitButton
                  title={t('no')}
                  className="m-0auto mt-20 btn-disabled"
                  onPress={() => setTargetPlayer('')}
                />
              </div>
            </div>
          ) : (
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
              {isLoading && !txnHash && !txnError ? (
                <div className="checkout-loader-wrapper draftee-propmt mt-40">
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                  </div>
                  <div
                    className={classNames(
                      isMobile() ? 'close-button-draftee' : 'close-button',
                    )}
                    onClick={handleCloseBottomPopup}
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
                        {txnConfirmResp.length === 0 ? (
                          <div
                            className={classNames('spinner check-spinner')}
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
                            : !isTxnChecking &&
                              txnConfirmResp[0]?.haserror === 1
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
                  <div
                    className={classNames(
                      isMobile() ? 'close-button-draftee' : 'close-button',
                    )}
                    onClick={handleCloseBottomPopup}
                  >
                    {t('close')}
                  </div>
                </>
              )}
            </>
          )}
          <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
        </section>
      </BottomPopup>
      {showBottomPopup && localStorage.getItem('loginId') && (
        <ApiBottomPopup
          showPopup={showBottomPopup}
          onSubmit={handleCreateDraftApi}
          onClose={handleClose}
          paymentMode="new-draft"
          customClass="purchase-pc-bottomwrapper"
        />
      )}
      <div
        className={classNames('new-draft-title', isMobile() ? 'd-none' : '')}
      >
        {t('find players')}
      </div>
      <SearchBar
        isFilterDisabled
        containerClass={classNames(
          'w-none',
          isMobile() ? 'draftee-search-mobile p-0' : '',
        )}
        onEdit={optimizedHandleSearch}
        onClose={() => handleReset()}
        mode={''}
      />
      {allPlayers.length > 0 ? (
        <div className="list-header">
          <div>{t('name')}</div>
        </div>
      ) : null}
      {allPlayers.length > 0 ? (
        <div>
          <InfiniteScroll
            className="player-list-pagination"
            dataLength={allPlayers.length}
            next={() => handleJumpToPage('forth')}
            hasMore={true}
            scrollThreshold={0.5}
            height={isMobile() ? 740 : 600}
            loader={
              !isDeadEnd ? (
                <h4 className="text-center">{t('loading')}...</h4>
              ) : (
                <h4 className="text-center">. . .</h4>
              )
            }
            endMessage={
              <p style={{ textAlign: 'center' }}>
                <b>. . .</b>
              </p>
            }
          >
            {allPlayers.map((item: any, index: any) => (
              <div className="nft-item p-default" key={index}>
                <div className="nft-image-section draft-option">
                  <div
                    className="image-border"
                    style={{
                      background: getCircleColor(item.playerlevelid),
                    }}
                  >
                    <ImageComponent
                      loading="lazy"
                      src={
                        item.playerpicturethumb ||
                        item.playerpicture ||
                        UserAvatar
                      }
                      alt=""
                      className="nft-image"
                    />
                  </div>
                  <div className="nft-name">
                    {item.name} &nbsp;
                    <TooltipLabel
                      title={getCountryNameNew(
                        item?.country_id || item?.nationality_id,
                      )}
                    >
                      <span
                        className={`fi fis fi-${getCountryCode(
                          item?.country_id || item?.nationality_id,
                        )}`}
                        style={{ lineHeight: 'unset' }}
                      ></span>
                    </TooltipLabel>
                  </div>
                </div>
                <div className="price-button-section">
                  <div className="nft-price-section">
                    <div className="text-primary-color"></div>
                    <div className="nft-price"></div>
                  </div>
                  <AddIcon
                    className="fg-primary-color"
                    onClick={() => handleDraftPlayer(item)}
                  />
                </div>
              </div>
            ))}
          </InfiniteScroll>
        </div>
      ) : isDraftPlayersLoading ? (
        <div className="nft-item no-data">
          <div className={classNames('all-players-loading')}>
            <div className="spinner"></div>
          </div>
        </div>
      ) : (
        <div className="drafts-no-action-container no-new-draft">
          {isGetPlayerError ? (
            <div className="nft-price">{t('no data found')}</div>
          ) : null}
          <div>{t('no results found')}</div>
        </div>
      )}
    </section>
  )
}

export default NewDraft
