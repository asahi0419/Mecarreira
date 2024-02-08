/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect } from 'react'
import SubmitButton from '@components/Button/SubmitButton'
import ArrowDown from '@components/Svg/ArrowDown'
import ArrowUp from '@components/Svg/ArrowUp'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import NewDraft from './NewDraft'
import CloseIcon from '@mui/icons-material/Close'
import { useDispatch, useSelector } from 'react-redux'
import {
  acceptDraft,
  createDraft,
  deleteDraftee,
  getPlayer2Contract,
  getPlayer2ContractReset,
  getPlayerDrafts,
  persistDraftAction,
  storeActiveTabBeforeLeaving,
  DraftingPercentage,
  resetDraftingPercentageMessage,
  setShowNewDraftPopupRedux,
} from '@root/apis/playerCoins/playerCoinsSlice'
import {
  getDraftingReallocationPercentage,
  showVotingMobile,
} from '@root/apis/onboarding/authenticationSlice'
import { RootState } from '@root/store/rootReducers'
import DialogBox from '@components/Dialog/DialogBox'
import { POLYGON_NETWORK_RPC_URL } from '@root/constants'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'
import {
  getCircleColor,
  getCountryCodeNew,
  getCountryName,
  getPlayerLevelName,
  isMobile,
} from '@utils/helpers'
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import Web3ActionPrompt from '../PlayerCoin/web3Actionprompt'
import TooltipLabel from '@components/TooltipLabel'
import 'flag-icons/css/flag-icons.min.css'
import ApiActionPrompt from '@components/Dialog/ApiActionprompt'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ImageComponent from '@components/ImageComponent'
import { useWalletHelper } from '@utils/WalletHelper'
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined'

const Drafts = () => {
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')
  const { t } = useTranslation()
  const [selectedFirst, setSelectedFirst] = useState(false)
  const [selectedSecond, setSelectedSecond] = useState(false)
  const [txnErr, setTxnErr] = useState('')
  const [selectedThird, setSelectedThird] = useState(true)
  const [requestedByList, setRequestedByList] = useState<any>([])
  const [txnHash, setTxnHash] = useState<string>('')
  const [showPrompt, setShowPropmt] = useState<boolean>(false)
  const [showNewDraftPopup, setShowNewDraftPopup] = useState(false)
  const [selectedFourth, setSelectedFourth] = useState(false)
  const [promptDialog, setPromptDialog] = useState('')
  const [web3Action, setWeb3Action] = useState('')
  const [promptLoading, setPromptLoading] = useState(false)
  const [drafteeAddress, setdrafteeAddress] = useState('')
  const [drafteeName, setdrafteeName] = useState('')
  const [openTooltip, setOpenTooltip] = useState(false)
  const [draftFeeValue, setDraftFeeValue] = useState(0)
  const [percentageError, setPercentageError] = useState('')
  const [editPercentageValue, setEditPercentageValue] = useState(true)
  const [draftingPer, setDraftingPer] = useState(false)
  useEffect(() => {
    if (draftFeeValue > 10 || draftFeeValue < 0 || !draftFeeValue) {
      setPercentageError(t('Input between 0-10'))
      setEditPercentageValue(false)
    } else {
      setPercentageError('')
      setEditPercentageValue(true)
    }
  }, [draftFeeValue])

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    countriesData,
    selectedThemeRedux,
    draftingReallocationPercentageData,
  } = authenticationData
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const {
    getPlayerDraftsData,
    player2contract,
    player1contract,
    player1contractabi,
    isGetPlayer2ContractSuccess,
    isGetPlayerContractError,
    player2contractabi,
    drafteePlayerUrl,
    allPlayersData,
    showNewDraftPopupRedux,
    selectedPlayer,
  } = playerCoinData

  const { getWeb3Provider, callWeb3Method } = useWalletHelper()

  const handleDraftNewPlayer = async () => {
    if (isMobile()) {
      await dispatch(storeActiveTabBeforeLeaving({ activeTab: 'drafts' }))
      navigate('/app/draft_new_player', {
        state: { playerContract: player1contract },
      })
    } else {
      setShowNewDraftPopup(true)
      dispatch(setShowNewDraftPopupRedux({ showNewDraftPopupRedux: true }))
    }
  }

  useEffect(() => {
    dispatch(getPlayerDrafts(player1contract))
    return () => {
      dispatch(getPlayer2ContractReset())
    }
  }, [])

  useEffect(() => {
    if (getPlayerDraftsData?.requested_by.length > 0) {
      const requestedBy = getPlayerDraftsData?.requested_by
      const draftedBy = getPlayerDraftsData?.drafted_by
      const newArr: any[] = []
      if (draftedBy.length > 0) {
        for (let i = 0; i < requestedBy.length; i++) {
          for (let j = 0; j < draftedBy.length; j++) {
            try {
              if (
                ethers.utils.getAddress(requestedBy[i].draftrequestby) !==
                ethers.utils.getAddress(draftedBy[j].draftedplayer)
              ) {
                newArr.push(requestedBy[i])
              }
            } catch (error) {
              continue
            }
          }
        }
        setRequestedByList(newArr)
      } else {
        setRequestedByList(requestedBy)
      }
    }
  }, [getPlayerDraftsData])

  useEffect(() => {
    if (isGetPlayer2ContractSuccess) {
      setPromptDialog(t('are you sure you want to add this player as draftee'))
      setWeb3Action('addDraftee')
      setPromptLoading(false)
    }
    if (isGetPlayerContractError) {
      toast.error(t('loading player contract failed'))
    }
  }, [isGetPlayer2ContractSuccess, isGetPlayerContractError])

  const buyforExternalWallet = async () => {
    console.log('createDraft1')
    const promise = callWeb3Method(
      'createDraftRequest',
      player1contract, // "0xb6000dffb543008bd7f9cda2615608828f0bf904"
      player1contractabi, // abi of player 1 contract
      [player2contract], // 0xa1eff55865575ddf81c2c5727490524dd56da5e4
    )
    promise
      .then((txn: any) => {
        setTxnHash(txn.hash)
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

  const handleDraftClose = (value: any) => {
    dispatch(getPlayerDrafts(player1contract))
    setShowNewDraftPopup(false)
    dispatch(setShowNewDraftPopupRedux({ showNewDraftPopupRedux: false }))
    if (value?.txnCompleted) {
      dispatch(getPlayerDrafts(player1contract))
    } else if (value?.playerUrl) {
      setShowPropmt(true)
      setPromptLoading(true)
      dispatch(getPlayer2Contract(value?.playerUrl))
    } else if (!value?.playerUrl) {
      setShowPropmt(false)
    }
  }

  useEffect(() => {
    if (drafteePlayerUrl) {
      navigate('/app/draft_confirmation')
      setPromptLoading(true)
      dispatch(getPlayer2Contract(drafteePlayerUrl))
    }
  }, [drafteePlayerUrl])

  const initDeleteDraftee = () => {
    const promise = callWeb3Method(
      'deleteDraftee',
      player1contract,
      player1contractabi,
      [drafteeAddress],
    )
    promise
      .then((txn: any) => {
        setTxnHash(txn.hash)
      })
      .catch((err: any) => {
        setTxnErr(err.reason || err.message)
      })
  }

  const initAcceptDraftee = () => {
    const promise = callWeb3Method(
      'acceptDraftRequest',
      player1contract,
      player1contractabi,
      [drafteeAddress],
    )
    promise
      .then((txn: any) => {
        setTxnHash(txn.hash)
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

  const handleDeleteDraftee = async (draftee: any) => {
    const { draftedplayer, name } = draftee
    if (isMobile()) {
      dispatch(storeActiveTabBeforeLeaving({ activeTab: 'drafts' }))
      const draftReq = {
        playerName: name || draftedplayer,
        playerAddress: draftedplayer,
        draftAction: 'deleteDraftee',
      }
      await dispatch(persistDraftAction(draftReq))
      navigate('/app/draft_confirmation')
    } else {
      setWeb3Action('deleteDraftee')
      setShowPropmt(true)
      setPromptDialog(t('are you sure you want to delete this draftee'))
      setdrafteeName(name)
      setdrafteeAddress(draftedplayer)
    }
  }

  const handleAcceptDraftee = async (draftee: any) => {
    const { name, draftrequestby } = draftee
    if (getPlayerDraftsData?.drafted_currently) {
      return
    }
    if (isMobile()) {
      dispatch(storeActiveTabBeforeLeaving({ activeTab: 'drafts' }))
      const draftReq = {
        playerName: name || draftrequestby,
        playerAddress: draftrequestby,
        draftAction: 'acceptDraftee',
      }
      await dispatch(persistDraftAction(draftReq))
      navigate('/app/draft_confirmation')
    } else {
      setWeb3Action('acceptDraftee')
      setShowPropmt(true)
      setPromptDialog(t('are you sure you want to accept this request'))
      setdrafteeAddress(draftrequestby)
      setdrafteeName(name)
    }
  }
  const handleDraftFeePercentage = async () => {
    if (isMobile()) {
      dispatch(storeActiveTabBeforeLeaving({ activeTab: 'drafts' }))
      dispatch(showVotingMobile({ playerCoinSettingsMobileView: true }))
      setWeb3Action('draftFeePer')
      const draftReq = {
        playerName: `${draftFeeValue}%`,
        playerAddress: `${draftFeeValue}%`,
        draftAction: 'draftFeePer',
        draftFeeValue,
      }
      await dispatch(persistDraftAction(draftReq))
      navigate('/app/draft_confirmation')
    }
    setWeb3Action('draftFeePer')
    setShowPropmt(true)
    setPromptDialog(
      t('are you sure you want to add this value as Drafting percentage ?'),
    )
  }
  const handleActionSuccess = async () => {
    if (web3Action === 'deleteDraftee') {
      initDeleteDraftee()
    } else if (web3Action === 'acceptDraftee') {
      initAcceptDraftee()
    } else if (web3Action === 'addDraftee') {
      buyforExternalWallet()
    } else if (web3Action === 'draftFeePer') {
      setDraftPercentageExternal()
    }
  }

  const handleActionSuccessApi = (user_secret: string) => {
    const formData = new FormData()
    formData.append('user_secret', user_secret)
    if (web3Action === 'deleteDraftee') {
      formData.append('drafter_address', drafteeAddress)
      dispatch(deleteDraftee(formData))
    } else if (web3Action === 'acceptDraftee') {
      formData.append('drafter_address', drafteeAddress)
      formData.append('contract', player1contract)
      dispatch(acceptDraft(formData))
    } else if (web3Action === 'addDraftee') {
      formData.append('drafter_address', player2contract)
      dispatch(createDraft(formData))
    } else if (web3Action === 'draftFeePer') {
      setDraftPercentageInternal(user_secret)
    }
  }

  const getHumanDate = (date: any) => {
    const unixDate: any = new Date(date * 1000)
    let day = unixDate.getDate()
    let month = unixDate.getMonth() + 1
    const year = unixDate.getFullYear()
    if (day < 10) day = '0' + day
    if (month < 10) month = '0' + month

    return day + '.' + month + '.' + year
  }

  const handleRemoveAdminPrompt = () => {
    setShowPropmt(false)
    setTxnErr('')
    setTxnHash('')
    setPromptDialog('')
    setWeb3Action('')
    setdrafteeAddress('')
    setdrafteeName('')
    dispatch(getPlayerDrafts(player1contract))
  }
  useEffect(() => {
    if (!showPrompt) {
      dispatch(showVotingMobile({ playerCoinSettingsMobileView: false }))
    }
  }, [showPrompt])
  const setDraftPercentageInternal = user_secret => {
    const formDataPer = new FormData()
    formDataPer.append('user_secret', user_secret)
    formDataPer.append('player_contract', player1contract || player2contract)
    formDataPer.append('drafting_percentage', draftFeeValue.toString())
    dispatch(DraftingPercentage(formDataPer))
  }
  const setDraftPercentageExternal = async () => {
    setDraftingPer(false)
    const provider = await getWeb3Provider()
    const playerContract = new ethers.Contract(
      player1contract, // contract address of Router
      player1contractabi, //  contract abi of Router
      provider.getSigner(loginInfo!),
    )
    const currentValueMultiply = draftFeeValue * 10
    try {
      const draftPer = await playerContract.setDraftingFeePercentage(
        currentValueMultiply,
        {
          gasLimit: ethers.utils.hexlify(1000000),
        },
      )
      setTxnHash(draftPer.hash)
      setDraftingPer(true)
    } catch (err) {
      const isErrorGasEstimation = `${err}`.includes('cannot estimate gas')
      if (isErrorGasEstimation) {
        setTxnErr(t('not enough funds to pay for blockchain transaction'))
      } else {
        setTxnErr(err.reason || err.message)
      }
    }
  }
  const getDraftPercentageExternal = async () => {
    console.log('gdpe')
    const provider = await getWeb3Provider()
    const playerContractDraftPer = new ethers.Contract(
      player1contract || player2contract, // contract address of Router
      player1contractabi || player2contractabi, //  contract abi of Router
      provider.getSigner(loginInfo!),
    )
    try {
      const getDraftPer =
        await playerContractDraftPer.draftingReallocationPercentage()
      const value = parseInt(getDraftPer._hex) / 10
      setDraftFeeValue(value)
    } catch (error) {
      console.log('error', error)
    }
  }
  // INTERNAL_API_INTEGRATION
  useEffect(() => {
    if (draftingReallocationPercentageData !== null) {
      const value = parseInt(draftingReallocationPercentageData) / 10
      setDraftFeeValue(value)
      console.log(
        'draftingReallocationPercentageData',
        draftingReallocationPercentageData,
      )
    }
  }, [draftingReallocationPercentageData])
  const getDraftPercentageInternal = async () => {
    // INTERNAL_API_INTEGRATION
    console.log('gdpi')
    dispatch(
      getDraftingReallocationPercentage({
        playerContract: player1contract || player2contract,
      }),
    )
    // const userWalletAddressUnder = await localStorage.getItem(
    //   'userWalletAddress',
    // )
    // const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(
    //   POLYGON_NETWORK_RPC_URL,
    // )
    // const playerContractDraftPer = new ethers.Contract(
    //   player1contract || player2contract, // contract address of Router
    //   player1contractabi || player2contractabi, //  contract abi of Router
    //   simpleRpcProvider.getSigner(userWalletAddressUnder!),
    // )
    // try {
    //   const getDraftPer =
    //     await playerContractDraftPer.draftingReallocationPercentage()
    //   const value = parseInt(getDraftPer._hex) / 10
    //   setDraftFeeValue(value)
    // } catch (error) {
    //   console.log('error', error)
    // }
  }
  useEffect(() => {
    if (loginInfo && player1contract) {
      getDraftPercentageExternal()
    }
    if (loginId && player1contract) {
      getDraftPercentageInternal()
    }
  }, [player1contract])

  const setDraftFee = e => {
    e.preventDefault()
    const re = /^[0-9.\b]+$/
    // if value is not blank, then test the regex

    if (
      (e.target.value === '' &&
        getPlayerLevelName(allPlayersData[0]?.playerlevelid) !== 'Diamond') ||
      (re.test(e.target.value) &&
        getPlayerLevelName(allPlayersData[0]?.playerlevelid) !== 'Diamond')
    ) {
      setDraftFeeValue(e.target.value)
      dispatch(resetDraftingPercentageMessage())
    }
  }

  const isAlreadyDrafted = () => {
    const inacceptibleIndex = requestedByList?.findIndex(
      item => item.isacceptable === false,
    )
    if (inacceptibleIndex > -1) {
      return true
    }
    return false
  }

  return (
    <div className="player-draft dlg-content box-wrapper">
      <DialogBox
        isOpen={(showNewDraftPopup && showNewDraftPopupRedux) || showPrompt}
        onClose={handleDraftClose}
        contentClass="onboarding-popup"
      >
        {showNewDraftPopup && showNewDraftPopupRedux ? (
          <NewDraft onClose={handleDraftClose} />
        ) : showPrompt ? (
          <>
            {localStorage.getItem('loginId') ? (
              <ApiActionPrompt
                promptText={promptDialog}
                onSuccess={handleActionSuccessApi}
                onClose={handleRemoveAdminPrompt}
                walletAddress={
                  web3Action === 'draftFeePer' ? `${draftFeeValue}%` : ''
                }
                hideWalletAddress={web3Action === 'draftFeePer' ? true : false}
                operationMode={
                  ['addDraftee', 'acceptDraftee', 'draftFeePer'].includes(
                    web3Action,
                  )
                    ? 'add'
                    : 'remove'
                }
                customClass={
                  isMobile() ? 'go-live-web3 purchase-pc-bottomwrapper' : ''
                }
              />
            ) : (
              <Web3ActionPrompt
                txnHash={txnHash}
                isPromptLoading={promptLoading}
                errorMsg={txnErr}
                promptText={promptDialog}
                onSuccess={handleActionSuccess}
                onClose={handleRemoveAdminPrompt}
                walletAddress={
                  drafteeName
                    ? drafteeName
                    : drafteeAddress
                    ? drafteeAddress
                    : web3Action === 'draftFeePer'
                    ? `${draftFeeValue}%`
                    : player2contract
                }
                operationMode={
                  ['addDraftee', 'acceptDraftee', 'draftFeePer'].includes(
                    web3Action,
                  )
                    ? 'add'
                    : 'remove'
                }
                draftingPer={draftingPer}
                getDraftingPercentage={getDraftPercentageExternal}
              />
            )}
          </>
        ) : null}
      </DialogBox>
      <>
        {getPlayerDraftsData?.active_draft_player ? (
          <>
            <div className="accordion mt-0">
              <br />
              {/* <SubmitButton
                isDisabled={
                  getPlayerDraftsData?.active_draft_player.length === 5
                }
                title={t('draft new player')}
                onPress={() => handleDraftNewPlayer()}
                className="m-0auto"
              /> */}
              <div
                className="plus-icon create-new-items"
                onClick={handleDraftNewPlayer}
              >
                <AddCircleOutlinedIcon />
              </div>
              <br />
              {/* Draft fee percentage */}

              <div className="player_reward_percentage_title">
                <h2 className="input-label" style={{ fontSize: '18px' }}>
                  {t('drafting_percentage')}
                </h2>
                <TooltipLabel
                  title={t('Input between 0-10')}
                  openTooltip={openTooltip}
                >
                  <InfoOutlinedIcon
                    sx={{
                      color: 'var(--secondary-foreground-color)',
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setOpenTooltip(true)
                      setTimeout(() => {
                        setOpenTooltip(false)
                      }, 5000)
                    }}
                  />
                </TooltipLabel>
              </div>
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div className="percentage_value_wrapper">
                    <input
                      style={{
                        width: '70px',
                        textAlign: 'left',
                        color:
                          getPlayerLevelName(
                            allPlayersData[0]?.playerlevelid,
                          ) === 'Diamond'
                            ? 'grey'
                            : '',
                        caretColor:
                          getPlayerLevelName(
                            allPlayersData[0]?.playerlevelid,
                          ) === 'Diamond'
                            ? 'transparent'
                            : '',
                      }}
                      className="new_percentage_value"
                      value={draftFeeValue}
                      type="number"
                      onChange={e => {
                        setDraftFee(e)
                      }}
                    />
                    <p
                      className="percentage_icon"
                      style={{
                        color:
                          getPlayerLevelName(
                            allPlayersData[0]?.playerlevelid,
                          ) === 'Diamond'
                            ? 'grey'
                            : '',
                      }}
                    >
                      %
                    </p>
                  </div>
                  <div>
                    <SubmitButton
                      isDisabled={
                        !editPercentageValue ||
                        getPlayerLevelName(allPlayersData[0]?.playerlevelid) ===
                          'Diamond'
                      }
                      title={t('Save')}
                      onPress={handleDraftFeePercentage}
                      className="m-0auto"
                      rewardPerc={true}
                    />
                  </div>
                </div>
              </div>
              <div style={{ height: '20px' }}>
                {percentageError && (
                  <p className="error_occured_left">{percentageError}</p>
                )}
              </div>
              <div
                className={classNames(
                  'item',
                  requestedByList.length > 0 ? '' : 'draft-hidden',
                )}
              >
                <div
                  className={selectedThird ? 'title no-border' : 'title'}
                  onClick={() => setSelectedThird(!selectedThird)}
                >
                  <h2>{t('draft requests')}</h2>
                  {selectedThird ? <ArrowUp /> : <ArrowDown />}
                </div>
                <div className={selectedThird ? 'content show' : 'content'}>
                  {requestedByList?.length > 0 ? (
                    <>
                      {isAlreadyDrafted() ? (
                        <div className="input-label fg-primary-color text-center">
                          {t('you are already drafted by')}{' '}
                          {
                            getPlayerDraftsData?.drafted_by[
                              getPlayerDraftsData?.drafted_by?.length - 1
                            ]?.name
                          }
                        </div>
                      ) : (
                        requestedByList.map((item: any, index: number) => (
                          <div className="nft-item" key={index}>
                            <div
                              className="nft-image-section"
                              onClick={() =>
                                navigate(`/app/player/${item?.detailpageurl}`)
                              }
                            >
                              <div className="image-border">
                                <ImageComponent
                                  loading="lazy"
                                  src={
                                    item.playerpicturethumb ||
                                    item.playerpicture
                                  }
                                  alt=""
                                  className="nft-image"
                                />
                              </div>
                              <div className="nft-name">
                                {item.name}
                                <TooltipLabel
                                  title={getCountryName(
                                    getCountryCodeNew(item.country_id),
                                    countriesData,
                                  )}
                                >
                                  <span
                                    className={`fi fis fi-${getCountryCodeNew(
                                      item.country_id,
                                    ).toLowerCase()}`}
                                  ></span>
                                </TooltipLabel>
                              </div>
                            </div>
                            <div
                              className={classNames(
                                'price-button-section',
                                !item?.isacceptable ? 'cursor-default' : '',
                              )}
                            >
                              <div className="nft-price-section">
                                <div className="text-primary-color"></div>
                              </div>
                              <a
                                className={classNames(
                                  'tx-link button-box accept-box',
                                  !item?.isacceptable ||
                                    selectedPlayer?.playerstatusid?.id > 4
                                    ? 'btn-disabled-gray cursor-default'
                                    : '',
                                )}
                                onClick={() => handleAcceptDraftee(item)}
                              >
                                {t('accept')}
                              </a>
                            </div>
                          </div>
                        ))
                      )}
                    </>
                  ) : (
                    <div className="drafts-no-action-container">
                      <div>{t('no action yet')}</div>
                    </div>
                  )}
                </div>
              </div>
              <div
                className={classNames(
                  'item',
                  getPlayerDraftsData?.drafted_by?.length === 0 ? 'hidden' : '',
                )}
              >
                <div
                  className={selectedFourth ? 'title no-border' : 'title'}
                  onClick={() => setSelectedFourth(!selectedFourth)}
                >
                  <h2>{t('drafted by')}</h2>
                  {selectedFourth ? <ArrowUp /> : <ArrowDown />}
                </div>
                <div className={selectedFourth ? 'content show' : 'content'}>
                  {getPlayerDraftsData?.drafted_by?.length > 0 ? (
                    getPlayerDraftsData?.drafted_by.map(
                      (item: any, index: number) => (
                        <div className="nft-item" key={index}>
                          <div
                            className="nft-image-section"
                            onClick={() =>
                              navigate(`/app/player/${item?.detailpageurl}`)
                            }
                          >
                            <div
                              className="image-border"
                              style={{
                                background: getCircleColor(item?.playerlevelid),
                              }}
                            >
                              <ImageComponent
                                loading="lazy"
                                src={
                                  item.playerpicturethumb || item.playerpicture
                                }
                                alt=""
                                className="nft-image"
                              />
                            </div>
                            <div className="nft-name">
                              {item.name}
                              <TooltipLabel
                                title={getCountryName(
                                  getCountryCodeNew(item.country_id),
                                  countriesData,
                                )}
                              >
                                <span
                                  className={`fi fis fi-${getCountryCodeNew(
                                    item.country_id,
                                  ).toLowerCase()}`}
                                ></span>
                              </TooltipLabel>
                            </div>
                          </div>
                          <div className="price-button-section">
                            <div className="nft-price-section">
                              <div className="text-primary-color"></div>
                            </div>
                          </div>
                        </div>
                      ),
                    )
                  ) : (
                    <div className="drafts-no-action-container">
                      <div>{t('no action yet')}</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="item" key={1}>
                <div
                  className={selectedFirst ? 'title no-border' : 'title'}
                  onClick={() => setSelectedFirst(!selectedFirst)}
                >
                  <h2>
                    {t('active drafted')} (
                    {getPlayerDraftsData?.active_draft_player.length}/5)
                  </h2>
                  {selectedFirst ? <ArrowUp /> : <ArrowDown />}
                </div>
                <div className={selectedFirst ? 'content show' : 'content'}>
                  {getPlayerDraftsData?.active_draft_player.length > 0 ? (
                    <div className="list-header">
                      <div>{t('address')}</div>
                    </div>
                  ) : null}
                  {getPlayerDraftsData?.active_draft_player.length > 0 ? (
                    getPlayerDraftsData?.active_draft_player.map(
                      (item: any, index: number) => (
                        <div className="nft-item" key={index}>
                          <div
                            className="nft-image-section"
                            onClick={() =>
                              navigate(`/app/player/${item?.detailpageurl}`)
                            }
                          >
                            <div
                              className="image-border"
                              style={{
                                background: getCircleColor(item?.playerlevelid),
                              }}
                            >
                              <ImageComponent
                                loading="lazy"
                                src={
                                  item.playerpicturethumb || item.playerpicture
                                }
                                alt=""
                                className="nft-image"
                              />
                            </div>
                            <div className="nft-name">
                              {item.name}
                              <TooltipLabel
                                title={getCountryName(
                                  getCountryCodeNew(item.country_id),
                                  countriesData,
                                )}
                              >
                                <span
                                  className={`fi fis fi-${getCountryCodeNew(
                                    item.country_id,
                                  ).toLowerCase()}`}
                                ></span>
                              </TooltipLabel>
                            </div>
                          </div>
                          <div className="price-button-section">
                            <div className="nft-price-section">
                              <div className="text-primary-color"></div>
                            </div>
                            <CloseIcon
                              className="red-color"
                              onClick={() => handleDeleteDraftee(item)}
                            />
                          </div>
                        </div>
                      ),
                    )
                  ) : (
                    <div className="drafts-no-action-container">
                      <div>{t('no action yet')}</div>
                    </div>
                  )}
                  <div className="mb-20"></div>
                </div>
              </div>
              <div className="item" key={2}>
                <div
                  className="title"
                  onClick={() => setSelectedSecond(!selectedSecond)}
                >
                  <h2>{t('drafted in the past')}</h2>
                  {selectedSecond ? <ArrowUp /> : <ArrowDown />}
                </div>
                <div className={selectedSecond ? 'content show' : 'content'}>
                  {getPlayerDraftsData?.all_drafted_player?.length > 0 ? (
                    getPlayerDraftsData?.all_drafted_player?.map(
                      (item: any, index: number) => (
                        <div className="nft-item" key={index}>
                          <div
                            className="nft-image-section"
                            onClick={() =>
                              navigate(`/app/player/${item?.detailpageurl}`)
                            }
                          >
                            <div
                              className="image-border"
                              style={{
                                background: getCircleColor(item?.playerlevelid),
                              }}
                            >
                              <ImageComponent
                                loading="lazy"
                                src={
                                  item.playerpicturethumb || item.playerpicture
                                }
                                alt=""
                                className="nft-image"
                              />
                            </div>
                            <div className="nft-name">
                              {item.name}
                              <TooltipLabel
                                title={getCountryName(
                                  getCountryCodeNew(item.country_id),
                                  countriesData,
                                )}
                              >
                                <span
                                  className={`fi fis fi-${getCountryCodeNew(
                                    item.country_id,
                                  ).toLowerCase()}`}
                                ></span>
                              </TooltipLabel>
                            </div>
                          </div>
                          <div className="nft-price-section">
                            <div className="text-primary-color">
                              {getHumanDate(item?.lastdraftdate)}
                            </div>
                          </div>
                        </div>
                      ),
                    )
                  ) : (
                    <div className="drafts-no-action-container">
                      <div>{t('no action yet')}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mb-20"></div>
          </>
        ) : (
          <div className="checkout-loader-wrapper">
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          </div>
        )}
      </>
    </div>
  )
}

export default Drafts
