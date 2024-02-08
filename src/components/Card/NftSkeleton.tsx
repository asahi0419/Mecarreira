import React from 'react'
import '@assets/css/components/ClaimCard.css'
import classNames from 'classnames'

interface Props {
  customClass?: string
}

const NftSkeleton: React.FC<Props> = props => {
  const { customClass = '' } = props
  return (
    <div
      className={classNames('nft-card', customClass)}
      style={{
        alignItems: 'center',
        height: '490px',
        border: '1px solid hsla(199, 20%, 70%, 0.516)',
        borderRadius: '12px',
      }}
    >
      <div className={classNames('nft_skeleton nft_image')}></div>
      <div>
        <div className={classNames('nft_skeleton nft_name_skeleton')}></div>
        <div className={classNames('nft_skeleton nft_title_skeleton')}></div>
        <div className="nft_skeleton nft_description_skeleton"></div>
      </div>
    </div>
  )
}

export default NftSkeleton
