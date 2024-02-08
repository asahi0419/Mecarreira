import React, { useState } from 'react'
import classnames from 'classnames'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { isMobile } from '@utils/helpers'
import DialogBox from '@components/Dialog/DialogBox'
import ChangePasswordForm from '@pages/Onboarding/ChangePassword/ChangePasswordForm'
import { useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import FireIcon from '@assets/images/fire_icon.webp'
import ImageComponent from '@components/ImageComponent'

interface Props {
  item: any
  index: number
  isMenu: boolean
  className?: string
}

const NotificationItem: React.FC<Props> = ({
  item,
  index,
  isMenu,
  className,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [showFormPopup, setShowFormPopup] = useState(false)
  const [itemHovered, setItemHovered] = useState(false)
  let selectedLanguage = localStorage.getItem('languageName')
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')
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
    if (isMenu) {
      if (index === 1) {
        if ((loginId || loginInfo) && selectedPlayer?.playerstatusid?.id >= 4) {
          navigate('/player-dashboard', { state: { from: '/' } })
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
      if (
        isMobile() ||
        url === 'language' ||
        url === 'all-players' ||
        url === 'launch-your-coin' ||
        url === 'nfts' ||
        url === 'how-it-works' ||
        index === 4
      ) {
        navigate('/app/' + url, { state: { from: '/' } })
      } else {
        // if (index === 7) {
        //   navigate('/app/notifications_settings')
        // }
        if (url === 'notifications_settings') {
          navigate('/app/notifications_settings')
        }
        setShowFormPopup(true)
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

  return (
    <div
      className="notification"
      onClick={() => {
        if (window.location.pathname === '/app/notifications') {
          navigate(`/app/player/${item?.detailpageurl}`)
        }
      }}
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
            {index === 2 && <ChangePasswordForm />}
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
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              {t(item.title)}
              {item.new ? <p className="new_notification"></p> : ''}
            </div>
            {item.title === 'hot players' || item.title === 'hot nfts' ? (
              <ImageComponent
                src={FireIcon}
                alt=""
                style={{
                  width: '20px',
                  marginLeft: '2px',
                  marginBottom: '-4px',
                }}
              />
            ) : null}
          </div>
        </>
        <div className="selected-value-row">
          {!Boolean(index) && isMenu && (
            <div className="selected-value active">{selectedLanguage}</div>
          )}
          <div
            className={`grey-color ${!Boolean(index) && 'fg-primary-color'}`}
          >
            <ArrowForwardIosIcon
              className="arrow"
              style={{ fontSize: '12px' }}
            />
          </div>
        </div>
      </div>

      <div
        className={classnames(
          !index
            ? 'notification-item-content selected'
            : 'notification-item-content selected',
          `${selectedThemeRedux}`,
        )}
        style={{ marginTop: item.new ? '-12px' : '' }}
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
        className={classnames(
          !index ? 'notification-date selected' : 'notification-date selected',
          `${selectedThemeRedux}`,
        )}
      >
        {item.timestamp && item.timestamp.substring(0, 19).replace('T', ' ')}
      </div>
    </div>
  )
}

export default NotificationItem
