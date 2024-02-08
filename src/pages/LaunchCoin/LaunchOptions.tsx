/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState, useCallback } from 'react'
import { AppLayout } from '@components/index'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  getFanClub,
  getWalletDetails,
  setActiveTab,
  showSignupForm,
  showWalletForm,
} from '@root/apis/onboarding/authenticationSlice'
import { useTranslation } from 'react-i18next'
import '@assets/css/pages/LaunchCoin.css'
import TagManager from 'react-gtm-module'
import { DummyCardData, HOMEROUTE, tagManagerArgs } from '@root/constants'
import '@assets/css/components/PlayerCard.css'
import maticIcon from '@assets/images/matic-token-icon.webp'
import visaIcon from '@assets/images/visa-white.webp'
import visaIconLight from '@assets/images/visa-black.webp'
import UserAvatar from '@assets/images/user_avatar.webp'
import masterCardIcon from '@assets/images/mastercard-large.webp'
import TooltipLabel from '@components/TooltipLabel'
import SubmitButton from '@components/Button/SubmitButton'
import { RootState } from '@root/store/rootReducers'
import classnames from 'classnames'
import ImageComponent from '@components/ImageComponent'
import {
  setShowNewDraftPopupRedux,
  resetPlayerDetails,
  searchTickerPlayers,
  setPlayerIdRedux,
  getPlayerDetails,
} from '@root/apis/playerCoins/playerCoinsSlice'
import { isMobile } from '@utils/helpers'
import SearchInput from '@components/Form/SearchInput'
import debounce from 'lodash.debounce'
import {
  getCircleColor,
  getCountryCode,
  getCountryNameNew,
} from '@utils/helpers'
import PlayerImage from '@components/PlayerImage'
import Profile from '../../assets/icons/icon/profileIcon.svg'
import classNames from 'classnames'
import CloseIcon from '@mui/icons-material/Close'

interface DraftFiltersData {
  limit?: any
  offset?: any
  sorted_by?: string
  search?: string
  reverse?: string
  status_id?: number[]
}

const LaunchOptions: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')
  const externalWalletAddress = localStorage.getItem('externalWalletAddress')
  const userWalletAddress = localStorage.getItem('userWalletAddress')
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const [allPlayers, setAllPlayers] = useState<any>([])
  const [selectedClaimee, setSelectedClaimee] = useState<any>([])
  const [isDeadEnd, setIsDeadEnd] = useState(false)
  const [activePlayer, setActivePlayer] = useState(null)
  const [appliedFilters, setAppliedFilters] = useState<DraftFiltersData>({
    limit: 10,
    offset: 0,
    search: '',
  })
  const accessToken = localStorage.getItem('accessToken')
  const {
    isNoWallet,
    userName,
    selectedThemeRedux,
    walletDetailAddress,
    userWalletData,
    fanClubData,
    isFetchPlayerSuccess,
    nextFanClubUrl,
    fanClubLoader,
  } = authenticationData
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const {
    showFanClubList,
    allFanPlayersDataCheckStatus,
    playersListDataTP,
    isLoadingTP,
    isLoading,
    playerId,
    getPlayerDetailsSuccessData,
  } = playerCoinData
  const [loading, setLoading] = useState(false)
  const [isSearchEnabledHeader, setSearchEnabledHeader] = useState(false)

  useEffect(() => {
    if (
      allFanPlayersDataCheckStatus === 1 ||
      allFanPlayersDataCheckStatus === 2
    ) {
      // navigate('*')
    }
  }, [allFanPlayersDataCheckStatus])

  useEffect(() => {
    if (appliedFilters?.limit || appliedFilters?.offset) {
      dispatch(
        getFanClub({
          ...appliedFilters,
        }),
      )
    }
  }, [appliedFilters])

  useEffect(() => {
    if (appliedFilters.limit || appliedFilters.offset) {
      if (appliedFilters.search) {
        const url_string = nextFanClubUrl
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
          setAllPlayers(fanClubData)
        } else {
          setAllPlayers([...allPlayers, ...fanClubData])
        }
      } else {
        if (fanClubData.length > 0 && isFetchPlayerSuccess) {
          setAllPlayers([...allPlayers, ...fanClubData])
        } else if (fanClubData.length === 0 && isFetchPlayerSuccess) {
          setIsDeadEnd(true)
        }
      }
    } else {
      setAllPlayers(fanClubData)
    }
  }, [fanClubData])

  const authToken = localStorage.getItem('accessToken')
  useEffect(() => {
    if (!authToken) {
      navigate(HOMEROUTE)
    }
  }, [authToken])
  useEffect(() => {
    if (userName) {
      if (accessToken && !walletDetailAddress) {
        dispatch(getWalletDetails()) // COMMENTED FOR PROD
      }
    }
  }, [userName])

  useEffect(() => {
    dispatch(resetPlayerDetails())
    window.addEventListener('click', handleCloseList)
    return () => {
      window.removeEventListener('click', handleCloseList)
    }
  }, [])

  const handleCloseList = (evt: any) => {
    console.log('sss--', evt.target.type)

    if (evt.target.className !== 'nft-item' || evt.target.type !== 'text') {
      const request = {
        limit: 10,
        offset: 0,
        search: '',
      }
      setAppliedFilters({ ...appliedFilters, ...request })
    }
  }
  console.log({ playerId, allPlayers })
  useEffect(() => {
    if (isNoWallet && !localStorage.getItem('loginInfo')) {
      dispatch(showWalletForm({ isMandatory: true }))
    }
  }, [isNoWallet])
  useEffect(() => {
    if (getPlayerDetailsSuccessData?.detailpageurl) {
      navigate(
        `/app/fan-player-dashboard/${getPlayerDetailsSuccessData?.detailpageurl}/${getPlayerDetailsSuccessData?.id}`,
      )
      if (showFanClubList) {
        dispatch(setShowNewDraftPopupRedux({ showFanClubList: false }))
        return
      }
    }
  }, [getPlayerDetailsSuccessData])
  const [selectOption, setSelectOption] = useState('')
  const fanClubOption = () => {
    setSelectOption('fanClub')
    localStorage.setItem('launchMode', 'Fan')
  }
  const memberClubOption = () => {
    setSelectOption('memberClub')
    localStorage.removeItem('launchMode')
  }
  const fanClub = () => {
    console.log('fanClub')
    dispatch(getPlayerDetails(activePlayer?.detailpageurl))
  }
  const memberClub = () => {
    localStorage.removeItem('launchMode')
    dispatch(setActiveTab('register'))
    if (!loginInfo && !loginId) {
      localStorage.setItem('routeAfterLogin', '/launch-your-coin')
      dispatch(showSignupForm())
      return
    }
    localStorage.setItem('previousPath', '/launch-your-coin')
    console.log('test4')
    navigate('/app/player-dashboard')
  }
  const handleStart = () => {
    if (selectOption === 'fanClub') {
      fanClub()
    } else if (selectOption === 'memberClub') {
      memberClub()
    }
  }

  const handleSearchParams = (value: string | undefined) => {
    setLoading(true)
    if (value) {
      dispatch(searchTickerPlayers({ search: value }))
    } else {
      dispatch(searchTickerPlayers({ search: '' }))
    }
  }
  const optimisedHandleChange = useCallback(
    debounce(handleSearchParams, 500),
    [],
  )

  const handleCloseHeader = () => {
    setSearchEnabledHeader(false)
    setLoading(false)
    const request = {
      limit: 10,
      offset: 0,
      search: '',
    }
    setAppliedFilters({ ...appliedFilters, ...request })
  }

  const handleClaimPlayer = async (e, item) => {
    e.preventDefault()
    await setActivePlayer(item)
    dispatch(setPlayerIdRedux({ playerId: item?.id }))
    const temp = allPlayers.filter(player => player.id === item?.id)
    setSelectedClaimee(temp)
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

  const getIsDisabledNext = () => {
    if (selectOption) {
      if (selectOption === 'fanClub') {
        if (playerId) {
          return false
        } else {
          return true
        }
      } else {
        return false
      }
    } else {
      return true
    }
  }

  const optimizedHandleSearch = useCallback(debounce(handleSearch, 500), [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <AppLayout headerClass="home" footerStatus="footer-status">
      <div className="launch-coin-container" style={{ minHeight: '60vh' }}>
        <div className={classNames('new-draft-title launch-select')}>
          {t('select_options')}
        </div>
        <div className={classNames('launch-btn-wrapper')}>
          {(externalWalletAddress ||
            userWalletAddress ||
            loginId ||
            loginInfo) &&
            !showFanClubList && (
              <div
                className={classnames(
                  isMobile() ? '' : 'launch_button_wrapper',
                )}
              >
                {/* <SubmitButton
                isDisabled={false}
                noLoader
                title={t('i_want_to_launch_my_own_member_club')}
                onPress={memberClub}
                launch={true}
              />
              <SubmitButton
                isDisabled={false}
                title={t('i_want_to_claim_a_players_fan_club')}
                onPress={fanClub}
                launch={true}
                noLoader
              /> */}

                {/* member club button */}
                <div
                  className={classnames(
                    isMobile()
                      ? 'launch_option_button_mobile'
                      : 'launch_option_button',
                    selectOption === 'memberClub' ? 'active-btn-launch' : '',
                  )}
                  onClick={memberClubOption}
                >
                  <p>{t('i_want_to_launch_my_own_member_club')}</p>
                  <p className="sub_title">{t('i_dont_exist')}</p>
                </div>
                {/* fan club button */}
                <div
                  className={classnames(
                    isMobile()
                      ? 'launch_option_button_mobile'
                      : 'launch_option_button',
                    selectOption === 'fanClub' ? 'active-btn-launch' : '',
                  )}
                  onClick={fanClubOption}
                >
                  <p>{t('i_want_to_claim_a_players_fan_club')}</p>
                  <p className="sub_title">{t('i_exist')}</p>
                </div>
              </div>
            )}
          {/* <select className="user-select" style={{ margin: '50px auto' }}>
            <option value="1">{t('public')}</option>
            <option value="0">{t('private')}</option>
          </select> */}
          {selectOption === 'fanClub' ? (
            <>
              <div className="launch-menu-wrapper" style={{ zIndex: '1' }}>
                <SearchInput
                  type="text"
                  placeholder={t('Please enter player name')}
                  className={classnames(
                    isMobile()
                      ? 'in-menu-search-header_mobile m-0'
                      : 'in-menu-search-header dash-search',
                  )}
                  onChange={optimizedHandleSearch}
                  onClose={handleCloseHeader}
                />
                {appliedFilters?.search.length > 0 ? (
                  <div
                    id="claimList"
                    className={classNames('player_list_container h-100')}
                    // style={isMobile() ? { left: '5.5%', width: '89%' } : {}}
                  >
                    {allPlayers.length > 0 ? (
                      allPlayers.map((item: any, index: any) => (
                        <div
                          className="nft-item"
                          style={{
                            // width: '368px',
                            padding: '20px',
                          }}
                          key={index}
                          onClick={e => handleClaimPlayer(e, item)}
                        >
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
                            <div
                              className={classNames(
                                isMobile() ? 'claimee-name' : 'nft-name',
                              )}
                            >
                              {item.name} &nbsp;
                              {/* <TooltipLabel
                                title={getCountryNameNew(
                                  item?.country_id || item?.nationality_id,
                                )}
                              >
                                <span
                                  className={`fi fis fi-${getCountryCode(
                                    item?.country_id || item?.nationality_id,
                                  )}`}
                                ></span>
                              </TooltipLabel> */}
                            </div>
                          </div>
                          <div className="price-button-section">
                            <div className="nft-price-section">
                              <div className="white-color"></div>
                              <div className="nft-price"></div>
                              <TooltipLabel
                                title={getCountryNameNew(
                                  item?.country_id || item?.nationality_id,
                                )}
                              >
                                <span
                                  className={`fi fis fi-${getCountryCode(
                                    item?.country_id || item?.nationality_id,
                                  )}`}
                                ></span>
                              </TooltipLabel>
                            </div>
                            {/* <AddIcon
                            className="fg-primary-color"
                            onClick={() => handleDraftPlayer(item)}
                          /> */}
                            {/* {isLoading && playerId === item?.id ? (
                              <div
                                className={classNames(
                                  'spinner size-small_cartoon',
                                )}
                                style={{ margin: '0 30px' }}
                              >
                              </div>
                            ) : (
                              <button
                                onClick={e => handleClaimPlayer(e, item)}
                                className="form-submit-btn wallet-btn"
                                style={{
                                  width: isMobile() ? '90px' : '100px',
                                  height: '30px',
                                  fontSize: '14px',
                                  margin: '0px 4px',
                                }}
                              >
                                {t('claim')}
                              </button>
                            )} */}
                          </div>
                        </div>
                      ))
                    ) : fanClubLoader && allPlayers.length === 0 ? (
                      <div
                        className="loading-spinner"
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          margin: '100px auto',
                        }}
                      >
                        <div className="spinner two">
                          <div className="spinner"></div>
                        </div>
                      </div>
                    ) : (
                      <p style={{ textAlign: 'center' }}>
                        {t('No Player Found')}
                      </p>
                    )}
                  </div>
                ) : (
                  ''
                )}
              </div>
              {playerId &&
                selectedClaimee &&
                selectedClaimee.map((item: any, index: any) => (
                  <>
                    {/* <div className="h-4 selectedplayer-label">
                      Selected Player:
                    </div> */}
                    <div className="nft-item selected-claimee" key={index}>
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
                            ></span>
                          </TooltipLabel>
                        </div>
                      </div>
                      <div className="price-button-section">
                        <div className="nft-price-section">
                          <div className="white-color"></div>
                          <div className="nft-price"></div>
                          <CloseIcon
                            className="red-color close_claimee"
                            onClick={() => {
                              setSelectedClaimee([])
                              dispatch(setPlayerIdRedux({ playerId: '' }))
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ))}
            </>
          ) : (
            ''
          )}
          <SubmitButton
            isDisabled={getIsDisabledNext()}
            title={t('next')}
            onPress={handleStart}
            noLoader
            className={classNames(
              isMobile() ? 'launch-nxt-btn-mobile' : 'launch-nxt-btn',
            )}
          />
        </div>
      </div>
    </AppLayout>
  )
}

export default LaunchOptions
