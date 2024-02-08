import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import '@assets/css/components/XPProgressBar.css'
import { useTranslation } from 'react-i18next'
import { RootState } from '@root/store/rootReducers'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import { ProgressBar } from 'react-progressbar-fancy'
import { toXPNumberFormat } from '@utils/helpers'

interface Props {
  level: number
  nextLevelXp: number
  currentXp: number
  levelIncrement: number
  index: number
}

const XPProgressBar: React.FC<Props> = props => {
  const { t } = useTranslation()
  const {
    level = 1,
    nextLevelXp = 0,
    currentXp = 0,
    levelIncrement,
    index,
  } = props
  useEffect(() => {
    const parentElement = document.getElementById(
      `progress_bar_container${index}`,
    )
    console.log({ parentElement })
    const childElement = parentElement.querySelector('.progressFill')
    console.log({ childElement })

    childElement.append(document.getElementById(`progress_bar_amount${index}`))
  }, [])

  return (
    <div
      className="progress-bar-container"
      id={`progress_bar_container${index}`}
    >
      <div className="progress-bar-wrapper">
        <div className="progress-bar-label-wrapper">
          <div className="progress-bar-label gold-color">
            LVL <b>{level ? level : 1}</b>
          </div>
          {nextLevelXp <= currentXp ? (
            <div className="progress-bar-label gold-color">
              LVL <b>{level ? level + 1 : 2}</b>
            </div>
          ) : (
            <div className="progress-bar-label-xp">
              <b>+</b>
              {toXPNumberFormat(nextLevelXp - currentXp)} <i>XP</i>
            </div>
          )}
        </div>
        <ProgressBar
          className="space"
          label={'Current Level'}
          primaryColor={'#f40bff'}
          secondaryColor={'#0bf4ff'}
          darkTheme
          score={
            nextLevelXp === 0
              ? 0
              : Math.min(
                  ((levelIncrement - (nextLevelXp - currentXp)) * 100) /
                    levelIncrement,
                  100,
                )
          }
        />
      </div>
      <div className="progress-bar-amount" id={`progress_bar_amount${index}`}>
        {/* {currentXp} XP */}
      </div>
    </div>
  )
}

export default XPProgressBar
