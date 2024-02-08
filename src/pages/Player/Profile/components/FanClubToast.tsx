import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { toast } from 'react-hot-toast'
import { THEME_COLORS } from '@root/constants'
import { useTranslation } from 'react-i18next'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import { isMobile } from '@utils/helpers'
import ImageComponent from '@components/ImageComponent'
import VerifiedIcon from '@assets/icons/icon/verified.png'
interface Props {
  className?: string
  green?: boolean
}

const FanClubToast: React.FC<Props> = props => {
  const { className = '', green } = props
  const { t } = useTranslation()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { selectedThemeRedux, isVisibleModal } = authenticationData
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const { getPlayerDetailsSuccessData } = playerCoinData

  return (
    <>
      {green ? (
        <div className="fanClubNote claimed-club">
          <ImageComponent
            src={VerifiedIcon}
            alt=""
            loading="lazy"
            title={t('official')}
            style={{
              width: '20px',
              height: '20px',
              cursor: 'pointer',
            }}
          />
          {isMobile() ? (
            <p className="d-flex">
              {t('this_is_member_official')}
              &nbsp;
              <div>{getPlayerDetailsSuccessData?.name}</div>
            </p>
          ) : (
            <p>
              {`${t('this_is_member_official')} ${
                getPlayerDetailsSuccessData?.name
              }`}
            </p>
          )}
        </div>
      ) : (
        <div
          className="fanClubNote unclaimed-club"
          style={{ textAlign: isMobile() ? 'left' : 'center' }}
        >
          <InfoOutlinedIcon
            sx={{
              color: '#c9a009',
              width: '20px',
              height: '20px',
              cursor: 'pointer',
            }}
          />
          <span
          // style={{
          //   fontFamily: 'Rajdhani-semibold',
          //   fontSize: '18px',
          //   fontWeight: '600',
          //   lineHeight: '18px',
          //   color: '#c9a009', //THEME_COLORS[selectedThemeRedux]['PrimaryText'],
          //   margin: '0px',
          //   textAlign: 'left',
          // }}
          >
            {`${t('this_is_a_fanclub')} ${t('this_is_a_fanclub_for_name')}.`}
          </span>
          {/* <div className="okay_button_wrapper">
            <p
              className="okay_button"
              onClick={() => {
                toast.remove()
              }}
            >
              {t('I understand')}
            </p>
          </div> */}
          {/* <div className="linear-flex-end fullwidth mt-10">
        <a
          href="#"
          className="fg-primary-color"
          onClick={() => {
            toast.remove()
          }}
        >
          {t('I Understand')}
        </a>
      </div> */}
        </div>
      )}
    </>
  )
}

export default React.memo(FanClubToast)
