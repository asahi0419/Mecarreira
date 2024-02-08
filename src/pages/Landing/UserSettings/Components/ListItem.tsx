import React from 'react'
import classnames from 'classnames'

interface Props {
  title: any
  className?: string
  handleClick: any
}

const MenuItem: React.FC<Props> = ({ title, className, handleClick }) => {
  return (
    <div className="notification">
      <div
        className={classnames('notification-title', className)}
        onClick={handleClick}
      >
        <>
          <div className="title_change_secret">{title}</div>
        </>
        <div className="selected-value-row">
          {title !== 'theme' && <div className={`grey-color`}></div>}
        </div>
      </div>
    </div>
  )
}

export default React.memo(MenuItem)
