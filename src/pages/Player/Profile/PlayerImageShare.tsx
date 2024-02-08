import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import 'flag-icons/css/flag-icons.min.css'
import AppLayout from '@components/Page/AppLayout'
import { ShareSocial } from 'react-share-social'
import ImageComponent from '@components/ImageComponent'
import CopyIcon from '@components/Svg/CopyIcon'
import DownloadIcon from '@components/Svg/DownloadIcon'
interface Props {
  jjs?: boolean
}

const styleShare = {
  root: {
    width: '40%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto',
    height: '60px',
    padding: '5px',
    background: 'transparent',
    borderRadius: 3,
    border: 0,
    color: 'white',
  },
  copyContainer: {
    display: 'none',
    border: '1px solid blue',
    background: 'rgb(0,0,0,0.7)',
  },
  title: {
    color: 'aquamarine',
    fontStyle: 'italic',
  },
}

const PlayerImageShare: React.FC<Props> = () => {
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const [isAddressCopied, setAddressCopied] = useState(false)

  const { tempCardImage } = authenticationData
  const { t } = useTranslation()

  const onButtonDownload = () => {
    setTimeout(() => {
      const link = document.createElement('a')
      link.download = `${tempCardImage?.playerName}.webp`
      link.href = tempCardImage?.playercard
      link.click()
    }, 2000)
  }

  const handleCopy = () => {
    setAddressCopied(!isAddressCopied)
    navigator.clipboard.writeText(tempCardImage?.playerLink)
  }

  useEffect(() => {
    if (tempCardImage?.playercard) {
      const img = new Image()
      img.src = tempCardImage?.playercard
      img.setAttribute('width', '200px')
      img.setAttribute('height', '300px')
    }
  }, [tempCardImage?.playercard])

  return (
    <AppLayout
      headerStatus="header-status"
      headerClass="home"
      footerStatus="footer-status"
      noPageFooter={true}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '100px',
        }}
      >
        <div id="card_container" style={{ marginTop: '50px' }}>
          <ImageComponent
            height="300"
            width="200"
            src={tempCardImage?.playercard}
          />
        </div>
        <p
          style={{
            fontFamily: 'Rajdhani-bold',
            fontWeight: '400',
            fontSize: '20px',
            textAlign: 'center',
            marginTop: '30px',
          }}
        >
          {t('share with your friends')}
        </p>
        <ShareSocial
          url={tempCardImage?.playerLink}
          socialTypes={['whatsapp', 'facebook', 'twitter', 'telegram']}
          style={styleShare}
          onSocialButtonClicked={data => console.log(data)}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '40px',
            marginTop: '10px',
            gap: '30px',
            paddingLeft: '20px',
          }}
          id="card_containers"
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer',
            }}
            onClick={onButtonDownload}
          >
            <DownloadIcon width="15px" height="15px" />
            <p
              style={{
                color: 'var(--primary-foreground-color)',
                textDecoration: 'underline',
              }}
            >
              {t('download')}
            </p>
          </div>
          <div
            className="copy-button-seed tooltip-seed"
            onClick={() => {
              handleCopy()
            }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer',
            }}
            onMouseLeave={() => setAddressCopied(false)}
          >
            <CopyIcon width="15px" height="15px" />
            <p
              style={{
                color: 'var(--primary-foreground-color)',
                textDecoration: 'underline',
              }}
            >
              {t('copy link')}
            </p>
            <span
              className={
                isAddressCopied ? 'tooltiptext tooltip-visible' : 'tooltiptext'
              }
              style={{ marginLeft: '32px', marginTop: '40px' }}
            >
              {t('copied')}
            </span>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default PlayerImageShare
