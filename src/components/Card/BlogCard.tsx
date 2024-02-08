import React from 'react'
import '@assets/css/components/NftCard.css'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import ImageComponent from '@components/ImageComponent'

interface Props {
  className?: string
  title?: string | null
  src: string
  updatedAt?: string
  slug?: string
  summary?: string
}

const BlogCard: React.FC<Props> = ({
  className = '',
  title,
  src,
  updatedAt,
  slug,
  summary,
}) => {
  const navigate = useNavigate()

  return (
    <div
      className={classNames('blog-card', className)}
      onClick={() => navigate(`/blog/${slug}`)}
    >
      <div className="image">
        <div className="image-cover">
          <ImageComponent
            loading="lazy"
            src={
              !src
                ? 'https://cdn.dropinblog.com/34246531/files/featured/meCarreira_1400x800.png'
                : src
            }
            alt=""
            className="blog-image"
          />
        </div>
      </div>
      <div className={classNames('second-part')}>
        <div className="blog-card-title">{title}</div>
        {className === 'full-width' ? (
          <div className="blog-card-summary">{summary}</div>
        ) : null}
        <div className="blog-update-time">Updated &nbsp; {updatedAt}</div>
      </div>
    </div>
  )
}

export default BlogCard
