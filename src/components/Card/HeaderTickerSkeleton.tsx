import React from 'react'
import '@assets/css/components/ClaimCard.css'
import classNames from 'classnames'

interface HeaderSkeletonProps {
  customClass: string
}

const HeaderTickerSkeleton: React.FC<HeaderSkeletonProps> = ({
  customClass = '',
}) => {
  return (
    <div
      className={classNames('header-ticker-container', customClass)}
      style={{ alignItems: 'center' }}
    >
      <div className="skeleton img-skeleton"></div>
      <div className="player-info">
        <div className="skeleton skeleton-player-name"></div>
        <div className="player-price-wrapper ticker-price-set">
          <div className="skeleton skeleton-player-price"></div>
          <div className="skeleton skeleton-player-price"></div>
        </div>
      </div>
    </div>
  )
}

export default HeaderTickerSkeleton
