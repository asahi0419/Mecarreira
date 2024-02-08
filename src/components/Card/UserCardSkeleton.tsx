import React from 'react'
import '@assets/css/components/UserCard.css'
import { isMobile } from '@utils/helpers'

const UserCardSkeleton: React.FC = () => {
  return (
    <>
      {isMobile() ? (
        <div className="user-card skeleton-user-card">
          <div className="user-info-wrapper">
            <div className="nft_skeleton skeleton-user-image"></div>
            <div className="user-name-wrapper">
              <div className="nft_skeleton skeleton-user-name"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="user-card skeleton-user-card">
          <div className="user-info-wrapper">
            <div className="nft_skeleton skeleton-user-image"></div>
            <div className="user-name-wrapper">
              <div className="nft_skeleton skeleton-user-name"></div>
              <div className="nft_skeleton skeleton-user-vip"></div>
            </div>
          </div>
          <div className="nft_skeleton skeleton-user-level"></div>
        </div>
      )}
    </>
  )
}

export default UserCardSkeleton
