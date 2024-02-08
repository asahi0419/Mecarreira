import React from 'react'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import Logo from '@assets/images/logo-min.webp'
import ImageComponent from '@components/ImageComponent'

interface Props {
  className?: string
  noLink?: boolean
}

const AppLogo: React.FC<Props> = ({ className, noLink = false }) => {
  return (
    <div className={classnames('logo', className)}>
      {!window.location.href.includes('/app') || noLink ? (
        <ImageComponent loading="lazy" src={Logo} alt="" className="logo-img" />
      ) : (
        <Link to={'/'}>
          <ImageComponent src={Logo} alt="" className="logo-img" />
        </Link>
      )}
    </div>
  )
}

export default AppLogo
