import { isMobile } from '@utils/helpers'
import classNames from 'classnames'
import React from 'react'

const TitleSkeleton: React.FC = () => {
  return (
    <div
      className={classNames(
        'skeleton',
        isMobile() ? 'title_main_mobile' : 'title_main',
      )}
    ></div>
  )
}

export default TitleSkeleton
