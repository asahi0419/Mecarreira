import { DummyCardData } from '@root/constants'
import React, { useRef } from 'react'
import ImageComponent from './ImageComponent'

interface Props {
  src: string
  className?: string
  hasDefault?: boolean
}

const PlayerImage: React.FC<Props> = props => {
  const { src, className = '', hasDefault } = props
  const imageRef = useRef<any>(null)
  return (
    <>
      {(hasDefault || src) && (
        <ImageComponent
          src={hasDefault ? src ?? DummyCardData.img.default : src}
          // onError={() => {
          //   imageRef.current.src = DummyCardData.img.default
          // }}
          innercustomref={imageRef}
          alt=""
          className={className}
          loading="lazy"
        />
      )}
    </>
  )
}

export default PlayerImage
