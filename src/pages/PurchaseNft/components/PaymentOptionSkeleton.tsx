import React from 'react'
import classNames from 'classnames'
// import '@assets/css/components/Spinner.css'

const SkeletonPayComponent = () => {
  return (
    <div style={{ width: '100%' }}>
      <div className={classNames('proxy_method_wrapper')}>
        <div className="proxy_method">
          <div className="skeleton proxy_icon_skeleton">
            <div className="skeleton proxy_icon_skeleton" />
          </div>
          <div>
            <div className="skeleton h-4 pay-title-skeleton"></div>
            <div className="skeleton pay-detail-skeleton"></div>
          </div>
        </div>
        <div className="skeleton purchase-btn-skeleton"></div>
      </div>
    </div>
  )
}

const PaymentOptionSkeleton = React.memo(SkeletonPayComponent)
export default PaymentOptionSkeleton
