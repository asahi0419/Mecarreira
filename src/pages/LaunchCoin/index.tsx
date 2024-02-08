/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect } from 'react'
import { AppLayout } from '@components/index'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  getWalletDetails,
  setActiveTab,
  showSignupForm,
  showWalletForm,
} from '@root/apis/onboarding/authenticationSlice'
import { useTranslation } from 'react-i18next'
import '@assets/css/pages/LaunchCoin.css'
import TagManager from 'react-gtm-module'
import { DummyCardData, tagManagerArgs } from '@root/constants'
import '@assets/css/components/PlayerCard.css'
import maticIcon from '@assets/images/matic-token-icon.webp'
import visaIcon from '@assets/images/visa-white.webp'
import visaIconLight from '@assets/images/visa-black.webp'
import masterCardIcon from '@assets/images/mastercard-large.webp'
import TooltipLabel from '@components/TooltipLabel'
import SubmitButton from '@components/Button/SubmitButton'
import { RootState } from '@root/store/rootReducers'
import classnames from 'classnames'
import ImageComponent from '@components/ImageComponent'
import {
  setShowNewDraftPopupRedux,
  resetPlayerDetails,
} from '@root/apis/playerCoins/playerCoinsSlice'
import { isMobile } from '@utils/helpers'
import { initTagManager } from '@utils/helpers'
import visaIconBlack from '@assets/images/visa.webp'

const LaunchCoin: React.FC = () => {
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
  const accessToken = localStorage.getItem('accessToken')
  const {
    isNoWallet,
    userName,
    selectedThemeRedux,
    walletDetailAddress,
    userWalletData,
    isSignupFormVisible,
    invalidDevice,
  } = authenticationData
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const {
    showFanClubList,
    allFanPlayersDataCheckStatus,
    allPlayersDataCheckStatus,
  } = playerCoinData
  const handleDraftNewPlayer = async () => {
    localStorage.setItem('launchMode', 'Fan')
    dispatch(setShowNewDraftPopupRedux({ showFanClubList: true }))
  }

  useEffect(() => {
    if (
      allFanPlayersDataCheckStatus === 1 ||
      allFanPlayersDataCheckStatus === 2
    ) {
      // navigate('*')
    }
  }, [allFanPlayersDataCheckStatus])

  useEffect(() => {
    if (
      (loginId || loginInfo) &&
      (allPlayersDataCheckStatus[0]?.playerstatusid?.id >= 4 ||
        allFanPlayersDataCheckStatus === 1)
    ) {
      navigate('/player-dashboard')
    }
  }, [
    allPlayersDataCheckStatus,
    allFanPlayersDataCheckStatus,
    loginId,
    loginInfo,
  ])

  const authToken = localStorage.getItem('accessToken')
  useEffect(() => {
    if (!authToken) {
      // navigate('/')
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
  }, [])

  useEffect(() => {
    if (isNoWallet && !localStorage.getItem('loginInfo')) {
      dispatch(showWalletForm({ isMandatory: true }))
    }
  }, [isNoWallet])

  useEffect(() => {
    window.scrollTo(0, 0)
    // TagManager.initialize(tagManagerArgs)
    initTagManager()
    document.querySelector('title')!.innerText = 'Launch your own Member token'
    document
      .querySelector("meta[name='description']")!
      .setAttribute(
        'content',
        'Launch your football Member token now and become a meCarreira PRO',
      )
  }, [])

  // const handleStart = () => {
  //   navigate('/app/launch-options')
  // }
  const handleStart = () => {
    dispatch(setActiveTab('register'))
    if (!loginInfo && !loginId) {
      localStorage.setItem('routeAfterLogin', '/launch-your-coin')
      dispatch(showSignupForm())
      return
    }
    localStorage.setItem('previousPath', '/launch-your-coin')
    navigate('/app/launch-options')
  }

  return (
    <AppLayout headerClass="home" footerStatus="footer-status">
      <div className="launch-coin-container">
        <div className="heading-container">
          <div>
            <div className="heading-title">{t('be Seen')}</div>
            <div className="heading-title">{t('be Traded')}</div>
            <div className="heading-title">{t('be Valuable')}</div>
          </div>
          <div className="heading-desc">
            <div>{t('your_player_coin_is')}</div>
            <br />
            <div>{t('it_doesnt_matter')}</div>
            <br />
            <div>{t('you will')}</div>
            <br />
            <div> - {t('get Attention of Agents, Scouts & PROs')}</div>
            <div> - {t('be able to earn money with your hobby')}</div>
            <div> - {t('become a meCarreira PRO Player')}</div>
            <div> - {t('push your career and market value')}</div>
          </div>
        </div>
        <div className="card-container">
          <div className="my-card stroke-inactive">
            <div className="background-image background0" />
            <div className="avatar">
              <div className="player-image">
                <ImageComponent src={DummyCardData.img.default} alt="" />
                <div className="player-img-desc" style={{ color: 'white' }}>
                  {t('your Picture')}
                </div>
              </div>
            </div>
            <div className="player-givenname-wrapper">
              <div className="player-givenname">{t('your_first_name')}</div>|
              <div className="player-birthyear">{'1988'}</div>
            </div>
            <div className="player-surname">
              {t('your_surname')} <span>{`($TICKER)`}</span>
            </div>
            <div className="content-wrapper">
              <div className="characteristics">
                <div className="coin-issued">
                  <TooltipLabel title={t('coins Existing')}>
                    <div className="coin-issued-symbol" />
                  </TooltipLabel>
                  <div className="coin-issued-text">{'71,456'}</div>
                </div>
              </div>
              <div className="divider"></div>
              <div className="market-value-wrapper">
                <div className="market-value">
                  <div className="market-value-label">{t('market value')}</div>
                  <div
                    className={classnames(
                      'player-info-stats',
                      'number-color',
                      'matic-value',
                      'matic-figure',
                      'profit',
                    )}
                    style={{
                      fontSize: '24px',
                      color: 'white',
                    }}
                  >
                    $20,123
                  </div>
                </div>
                <div className="price-value">
                  <div
                    className={classnames(
                      'number-color',
                      'pt-5',
                      'usd-price',
                      'textSize',
                      'profit-style',
                      'white-color',
                    )}
                  >
                    $0.28
                  </div>
                  <div className="changed-price">
                    <div
                      className={classnames('number-color', 'profit')}
                      style={{ fontSize: '20px' }}
                    >
                      4.83%
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="purchase-button-wrapper">
              <div className={classnames('buy-button', 'purchase-active')}>
                {t('buy')}
              </div>
              <div className={classnames('sell-button', 'purchase-active')}>
                {t('sell')}
              </div>
            </div>
            <div className="bottom-decor" />
          </div>
        </div>
        <div className="heading-container">
          <div className="heading-desc">
            <div>{t('the_player_coin_is')}</div>
          </div>
          <div className="footer-icons">
            <ImageComponent
              className="card-logo"
              src={
                selectedThemeRedux === 'Light' ||
                selectedThemeRedux === 'Ladies' ||
                selectedThemeRedux === 'Black'
                  ? visaIconBlack
                  : visaIcon
              }
              style={{ height: '27px' }}
              alt=""
            />
            <ImageComponent
              className="card-logo"
              src={masterCardIcon}
              style={{ height: '43px' }}
              alt=""
            />
            <ImageComponent
              className="card-logo"
              src={maticIcon}
              style={{ height: '50px' }}
              alt=""
            />
          </div>
        </div>
        <div className="button-container">
          {/* {(externalWalletAddress || userWalletAddress) && !showFanClubList && (
            <div
              className={classnames(isMobile() ? '' : 'launch_button_wrapper')}
            >
              <SubmitButton
                isDisabled={false}
                noLoader
                title={t('i_want_to_launch_my_own_member_club')}
                onPress={handleStart}
                launch={true}
              />
              <SubmitButton
                isDisabled={false}
                title={t('i_want_to_claim_a_players_fan_club')}
                onPress={handleDraftNewPlayer}
                launch={true}
                noLoader
              />
            </div>
          )} */}
          {isSignupFormVisible || invalidDevice ? null : (
            <SubmitButton
              isDisabled={false}
              noLoader
              title={t('lets start')}
              onPress={() => handleStart()}
              // launch={true}
            />
          )}
        </div>
      </div>
    </AppLayout>
  )
}

export default LaunchCoin
