import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  potentialItem: any
  classname?: string
}

const PotentialItem: React.FC<Props> = ({ potentialItem, classname }) => {
  const { t } = useTranslation()

  return (
    <div className={`new-landing-potentialitem-root ${classname}`}>
      <div className="new-landing-potentialitem-title-content">
        <div className="new-landing-potentialitem-title-img">
          <img src={`/img/${potentialItem.img}`} />
        </div>
        <div className="new-landing-potentialitem-title">
          {potentialItem.title}
        </div>
      </div>
      <div className="new-landing-potentialitem-content">
        {potentialItem.child.map((potentialchild, index) => (
          <div className="new-landing-potentialitem-text" key={index}>
            {potentialchild}
          </div>
        ))}
      </div>
    </div>
  )
}

export default PotentialItem
