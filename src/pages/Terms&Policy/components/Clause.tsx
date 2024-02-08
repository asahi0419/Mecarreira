import React, { memo } from 'react'
import classNames from 'classnames'

interface Props {
  title: string
  isMainTitle?: boolean
  children: React.ReactNode
  containerClass?: string
  fontStyle?: string
}

const Clause: React.FC<Props> = ({
  title,
  children,
  isMainTitle = false,
  containerClass = '',
  fontStyle = '',
}) => {
  return (
    <div className={classNames('terms-content-wrapper', containerClass)}>
      <div
        className={classNames(
          'new-nft-title',
          `${fontStyle ? fontStyle : 'ct-h1'}`,
          'text-center',
          isMainTitle ? 'terms-title' : 'terms-subtitle mt-40',
        )}
      >
        {title}
      </div>
      {children}
    </div>
  )
}

export default memo(Clause)
