import React, { memo } from 'react'
import '@assets/css/components/NewsCard.css'
import classNames from 'classnames'
import ImageComponent from '@components/ImageComponent'

interface Props {
  img?: string
  content: string
  title: string
}

const NewsCard: React.FC<Props> = ({ img = '', content, title }) => {
  return (
    <div className="news-card">
      <div className="news-placeholder">
        <div className="nft-image-cover">
          <ImageComponent
            src={img}
            alt=""
            className={classNames('nft-image', img ? '' : 'hidden')}
          />
        </div>
      </div>
      <div className="news-content-wrapper">
        <div className="ct-h3">{title}</div>
        <p className="ct-p2">{content}</p>
      </div>
    </div>
  )
}

export default memo(NewsCard)
