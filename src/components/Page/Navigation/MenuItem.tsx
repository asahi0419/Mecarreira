import React, { useState } from 'react'
import classnames from 'classnames'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { isMobile } from '@utils/helpers'
import DialogBox from '@components/Dialog/DialogBox'
import ChangePasswordForm from '@pages/Onboarding/ChangePassword/ChangePasswordForm'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import FireIcon from '@assets/images/fire_icon.webp'
import ToggleSwitch from '@components/Form/ToggleSwitch'
import { selectedTheme } from '@root/apis/onboarding/authenticationSlice'
import ItemsIcon from '@assets/icons/icon/items.svg'
import New1Icon from '@assets/images/new1.webp'
import ProfitIcon from '@assets/icons/icon/profit.png'
import Ranking from '@assets/images/ranking.png'
import ImageComponent from '@components/ImageComponent'
import VisibilityIcon from '@mui/icons-material/Visibility'
import SelectItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Football from '@assets/icons/icon/footbal_icon.png'

interface Props {
  item: any
  index: number
  isMenu: boolean
  className?: string
  rootClass?: string
}

const MenuItem: React.FC<Props> = ({
  item,
  index,
  isMenu,
  className,
  rootClass,
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showFormPopup, setShowFormPopup] = useState(false)
  const [itemHovered, setItemHovered] = useState(false)
  let selectedLanguage = localStorage.getItem('languageName')
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')

  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const { allFanPlayersDataCheckStatus, allPlayersDataCheckStatus, season } =
    playerCoinData

  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { selectedThemeRedux } = authenticationData

  const selectedPlayer = useSelector(
    (state: RootState) => state.playercoins.selectedPlayer,
  )

  const factsheetUrl = useSelector(
    (state: RootState) => state.authentication.factsheetUrl,
  )
  if (selectedLanguage === null) {
    selectedLanguage = 'Português'
  }
  const newVote = `${item.playername} ${t('has a new vote that will end in')} ${
    item.hrs
  } ${t('hour')} `
  const newRaffle = `${item.playername} ${t(
    'has just launched a new raffle that ends in',
  )} ${item.hrs} ${t('hour')}. ${t('participate now!')}`
  const goLive = `${item.playername} ${t(
    'has gone live and is available for trading',
  )}`
  const goPro = `${item.playername} ${t(
    'is now PRO! Stake your coins and unlock your rewards',
  )}`
  const newAuction = `${item.playername} ${t(
    'has just launched a new auction that ends in',
  )} ${item.hrs} ${t('hour')}`
  const newNftMinted = `${item.playername} ${t(
    'has minted a new NFT with id',
  )} ${item.tokenid}`

  const handleClick = (url: string) => {
    // console.log(
    //   'selectedPlayer',
    //   allPlayersDataCheckStatus[0]?.playerstatusid?.id,
    // )
    if (isMenu) {
      if (url === 'launch-your-coin') {
        if (
          (loginId || loginInfo) &&
          (allPlayersDataCheckStatus[0]?.playerstatusid?.id >= 4 ||
            allFanPlayersDataCheckStatus === 1)
        ) {
          if (window.location.href.includes('/app')) {
            navigate('/app/player-dashboard', { state: { from: '/' } })
          } else {
            navigate('/player-dashboard', { state: { from: '/' } })
          }
        } else if (allFanPlayersDataCheckStatus === 2) {
          navigate('/app/fan-player-dashboard', { state: { from: '/' } })
        } else {
          navigate('/app/launch-your-coin', { state: { from: '/' } })
        }
        return
      } else if (url === 'factsheet') {
        fetch(factsheetUrl).then(response => {
          response.blob().then(blob => {
            // Creating new object of PDF file
            const fileURL = window.URL.createObjectURL(blob)
            // Setting various property values
            const alink = document.createElement('a')
            alink.href = fileURL
            alink.download = t('factsheet') + '.pdf'
            alink.click()
          })
        })
        return
      }
      // else if (index === 6) {
      //   navigate('/app/notifications_settings')
      // }
      if (url === 'season' && season?.season) {
        navigate('/app/' + url + '/' + season?.season, { state: { from: '/' } })
        return
      }
      if (
        (isMobile() && url !== 'theme') ||
        url === 'language' ||
        url === 'all-players' ||
        url === 'launch-your-coin' ||
        url === 'nfts' ||
        url === 'how-it-works' ||
        url === 'all-users' ||
        url === 'top-trades'
      ) {
        navigate('/app/' + url, { state: { from: '/' } })
      } else {
        if (url === 'notifications_settings') {
          navigate('/app/notifications_settings')
        }
        if (url === 'my_settings') {
          navigate('/app/my_settings')
        }
        if (url === 'my_items') {
          navigate('/app/my_items')
        }
        if (url === 'accounts/changePassword') {
          setShowFormPopup(true)
        }
        if (url === 'kiosk_category_items/6') {
          navigate('/app/kiosk_category_items/6')
        }
        if (url === 'my_watchlist') {
          navigate('/app/my_watchlist')
        }
      }
    }
  }

  const handleClose = (event: any) => {
    event.stopPropagation()
    setShowFormPopup(false)
  }

  const toggleItemFocused = (isHover: boolean) => {
    setItemHovered(isHover)
  }

  const handleThemeChange = e => {
    const value = e.target.value
    localStorage.setItem('theme', value)
    dispatch(selectedTheme({ selectedThemeRedux: value }))
  }

  return (
    <div
      className={classnames(
        !rootClass ? 'notification' : rootClass,
        item?.title !== 'language' && item?.title !== 'theme'
          ? 'notification_margin_more'
          : '',
      )}
    >
      <div
        className={classnames('notification-title', className)}
        onClick={() => handleClick(item.url)}
        onMouseEnter={() => toggleItemFocused(true)}
        onMouseLeave={() => toggleItemFocused(false)}
      >
        <>
          <DialogBox
            isOpen={showFormPopup}
            onClose={handleClose}
            contentClass="onboarding-popup"
          >
            {item?.url === 'accounts/changePassword' && <ChangePasswordForm />}
          </DialogBox>
          <div
            className={classnames(
              `link-title ${!Boolean(index) && 'notification-title-color'}`,
              itemHovered
                ? 'focussed'
                : window.location.pathname === '/app/notifications'
                ? 'focussed'
                : '',
            )}
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {t(item.title)}
            {item.title === 'hot players' || item.title === 'hot nfts' ? (
              <ImageComponent
                src={FireIcon}
                alt=""
                style={{
                  width: '20px',
                  marginLeft: '2px',
                  marginTop: '-2px',
                }}
              />
            ) : null}
            {item.title === 'new items' ? (
              <ImageComponent
                src={New1Icon}
                alt=""
                style={{
                  width: '20px',
                  marginLeft: '2px',
                  marginTop: '-2px',
                }}
              />
            ) : null}
            {item.title === 'top trades' ? (
              <ImageComponent
                src={ProfitIcon}
                alt=""
                style={{
                  width: '20px',
                  marginLeft: '2px',
                  marginTop: '-2px',
                }}
              />
            ) : null}
            {item.title === 'user ranking' ? (
              <ImageComponent
                src={Ranking}
                alt=""
                style={{
                  width: '20px',
                  marginLeft: '2px',
                  marginTop: '-2px',
                }}
              />
            ) : null}
            {item.url === 'my_watchlist' ? (
              // <ImageComponent
              //   src={New1Icon}
              //   alt=""
              //   style={{
              //     width: '20px',
              //     marginLeft: '2px',
              //     marginBottom: '-4px',
              //   }}
              // />
              <VisibilityIcon className="watch-icon" />
            ) : null}
            {item.url === 'season' ? (
              // <ImageComponent
              //   src={New1Icon}
              //   alt=""
              //   style={{
              //     width: '20px',
              //     marginLeft: '2px',
              //     marginBottom: '-4px',
              //   }}
              // />
              <ImageComponent
                src={Football}
                alt=""
                style={{
                  width: '20px',
                  marginLeft: '7px',
                  marginTop: '-2px',
                }}
              />
            ) : null}
          </div>
        </>
        <div className="selected-value-row">
          {!Boolean(index) && isMenu && (
            <div
              className="selected-value active"
              style={{ paddingRight: '8px' }}
            >
              {selectedLanguage}
            </div>
          )}
          {item.title === 'theme' && (
            <Select
              className="theme-select-box"
              value={selectedThemeRedux}
              onChange={handleThemeChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              sx={{
                width: '105px',
              }}
            >
              <SelectItem value={'Dark'}>
                <div className="theme-circle default">&nbsp;</div>
                {t('standard')}
              </SelectItem>
              <SelectItem value={'Gold'}>
                <div className="theme-circle gold">&nbsp;</div>
                {t('gold')}
              </SelectItem>
              <SelectItem value={'Light'}>
                <div className="theme-circle light">&nbsp;</div>
                {t('winter')}
              </SelectItem>
              <SelectItem value={'Ladies'}>
                <div className="theme-circle ladies">&nbsp;</div>
                {t('pink')}
              </SelectItem>
              <SelectItem value={'Black'}>
                <div className="theme-circle black">&nbsp;</div>
                {t('black')}
              </SelectItem>
            </Select>
          )}
          {item.title !== 'theme' && (
            <div
              className={`grey-color ${!Boolean(index) && 'fg-primary-color'}`}
            >
              <ArrowForwardIosIcon
                className="arrow"
                style={{ fontSize: '12px' }}
              />
            </div>
          )}
        </div>
      </div>

      <div
        className={
          !index
            ? 'notification-content selected'
            : 'notification-content selected'
        }
      >
        {item.title === 'New Vote'
          ? newVote
          : item.title === 'New Raffle'
          ? newRaffle
          : item.title === 'Go Live'
          ? goLive
          : item.title === 'Gone PRO!'
          ? goPro
          : item.title === 'New Auction'
          ? newAuction
          : item.title === 'New NFT minted'
          ? newNftMinted
          : item.body}
        {item.title === 'New Vote' ? <b>{item.question}</b> : ''}
      </div>
      <div
        className={
          !index ? 'notification-date selected' : 'notification-date selected'
        }
      >
        {item.timestamp && item.timestamp.substring(0, 19).replace('T', ' ')}
      </div>
    </div>
  )
}

export default MenuItem
