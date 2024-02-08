import React from 'react'
import '@assets/css/components/ClaimCard.css'
import classNames from 'classnames'

const NftSkeletonMobile: React.FC = () => {
  return (
    <div
      className="nft-card"
      style={{
        alignItems: 'center',
        width: '164px',
        height: '226px',
        border: '1px solid hsla(199, 20%, 70%, 0.516)',
        padding: '5px',
        borderRadius: '12px',
      }}
    >
      <div className={classNames('nft_skeleton nft_image_mobile')}></div>
      <div>
        <div
          className={classNames('nft_skeleton nft_name_skeleton_mobile')}
        ></div>
        <div
          className={classNames('nft_skeleton nft_title_skeleton_mobile')}
        ></div>
      </div>
    </div>
  )
}

export default NftSkeletonMobile
