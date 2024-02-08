import React from 'react'
import '@assets/css/components/TradeCard.css'

const TopTradesCardSkeleton: React.FC = () => {
  return (
    <div className="box-item trade-card-skeleton">
      <div className="trade-info-wrapper">
        <div className="trade-name-wrapper nft_skeleton"></div>
        <div className="trade-value-group">
          <div className="trade-value-box nft_skeleton"></div>
          <div className="trade-value-box nft_skeleton"></div>
          <div className="trade-profit nft_skeleton"></div>
        </div>
      </div>
    </div>
  )
}

export default TopTradesCardSkeleton
