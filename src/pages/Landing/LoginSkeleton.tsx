import React from 'react'
import '@assets/css/components/ClaimCard.css'
import classNames from 'classnames'

const LoginSkeleton: React.FC = () => {
  return (
    <div className="seasons-rewards-section">
      <div className="login-wrapper">
        <div className={classNames('new-launch-title')}>
          <div className="login_title_skeleton">
            {/* {t('create your account now')} */}
          </div>
          <div className="login_sub_title_skeleton">
            {/* {t('it will also create a polygon')} */}
          </div>
        </div>
        <div className="button-line">
          <div className="login_button_skeleton"></div>
          <div className={classNames('login_button_skeleton')}></div>
        </div>
      </div>
    </div>
  )
}

export default LoginSkeleton
