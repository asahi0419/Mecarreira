import React from 'react'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import PlayerImage from './PlayerImage'
import { isMobile } from '@utils/helpers'
import classNames from 'classnames'

interface Props {
  customClass?: string
  playerImg?: string
  chipLabel?: string
  chipValue?: string
  chipBgColor?: string
}

const ChipBox: React.FC<Props> = props => {
  const {
    customClass = '',
    playerImg,
    chipLabel = '',
    chipValue = '',
    chipBgColor,
  } = props
  return (
    <div
      className={classNames(
        'currency_mark_wrapper kiosk-item-flag-buyItem',
        customClass,
      )}
    >
      {playerImg ? (
        <div
          className="currency_mark_img"
          style={{
            background: chipBgColor,
          }}
        >
          <PlayerImage
            src={playerImg}
            className="img-radius_kiosk currency_mark"
          />
        </div>
      ) : null}

      <div className={isMobile() ? 'item-price-container' : ''}>
        {!isMobile() ? (
          <>
            {chipLabel}
            <span> {chipValue}</span>
          </>
        ) : (
          <> &nbsp;{chipLabel}</>
        )}
      </div>
    </div>
  )
}

export default ChipBox
