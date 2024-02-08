import React, { useState } from 'react'
import '@assets/css/components/FlipCard.css'
import { isMobile } from '@utils/helpers'
interface Props {
  title: string
  desc: string
  index: number
}

const LandingFlipCard: React.FC<Props> = ({ title, desc, index }) => {
  const [flip, setFlip] = useState(false)
  const handleHover = state => {
    if (isMobile()) {
      setFlip(false)
    } else {
      setFlip(state)
    }
  }

  const handleClick = () => {
    if (isMobile()) {
      setFlip(!flip)
    }
  }

  return (
    <div
      className="flip-card"
      onMouseOver={() => handleHover(true)}
      onMouseOut={() => handleHover(false)}
      onClick={handleClick}
    >
      <div className={flip ? 'flip-card-inner show' : 'flip-card-inner'}>
        <div className="flip-card-front">
          <div className={`bg-benefits${index}`}>
            <div className="flip-card-title">{title}</div>
          </div>
        </div>
        <div className="flip-card-back">
          <div className={`bg-benefits${index}`}>
            <div className="flip-card-desc">{desc}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingFlipCard
