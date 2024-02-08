import React from 'react'
import classNames from 'classnames'

const KioskSkeleton: React.FC = () => {
  return (
    <div
      className="nft-card kiosk-card"
      style={{
        alignItems: 'center',
        height: '490px',
        border: '1px solid hsla(199, 20%, 70%, 0.516)',
        borderRadius: '12px',
      }}
    >
      <div className={classNames('nft_skeleton nft_image')}></div>
      <div>
        <div className={classNames('nft_skeleton kiosk_name_skeleton')}></div>
        <div className={classNames('nft_skeleton kiosk_desc_skeleton')}></div>
      </div>
    </div>
  )
}

export default KioskSkeleton
