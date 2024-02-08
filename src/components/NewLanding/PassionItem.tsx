import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  passionItem: any
}

const PassionItem: React.FC<Props> = ({ passionItem }) => {
  const { t } = useTranslation()

  return (
    <div className="new-landing-passionitem-root">
      <div className="new-landing-passionitem">
        <div className="new-landing-passionitem-image">
          <img src={`/img/${passionItem.img}`} alt="passion" />
        </div>
        <ul className="new-landing-passionitem-right-content">
          <div className="new-landing-passionitem-title">
            {passionItem.title}
          </div>
          {passionItem.child.map((item: string, index: number) => (
            <li className="new-landing-passionitem-text" key={index}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default PassionItem
