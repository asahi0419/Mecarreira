import React, { memo, useMemo } from 'react'

interface Props {
  src: string
  alt: string
  innercustomref?: any
  className?: string
  loading?: 'eager' | 'lazy'
  style?: any
  onClick?: any
  title?: any
}

const ImageComponent: React.FC<Props> = memo(props => {
  const memoizedImage = useMemo(() => {
    const img = new Image()
    img.src = props.src
    img.alt = props.alt
    return img
  }, [props.src, props.alt])

  if (props?.innercustomref) {
    return (
      <img
        {...props}
        ref={props?.innercustomref}
        src={memoizedImage.src}
        alt={memoizedImage.alt}
      />
    )
  }

  return <img {...props} src={memoizedImage.src} alt={memoizedImage.alt} />
})

export default ImageComponent
