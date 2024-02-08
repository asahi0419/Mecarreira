import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import classNames from 'classnames'
import CoinsList from './CoinsList'

const Supporters: React.FC = () => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const playerCoinData = useSelector((state: RootState) => state.playercoins)

  const { getPlayerDetailsSuccessData, getDetailsLoading } = playerCoinData

  useEffect(() => {
    if (getPlayerDetailsSuccessData) {
      setIsLoading(false)
    }
  }, [getPlayerDetailsSuccessData])

  return (
    <div className="coin-table-container">
      <div
        className={classNames('supporter-loading', isLoading ? '' : 'hidden')}
      >
        <div className="spinner"></div>
      </div>
      {!isLoading ? (
        <>
          {getDetailsLoading ? (
            <div className="supporter-loading">
              <div className="spinner"></div>
            </div>
          ) : getPlayerDetailsSuccessData?.playerstatusid?.id < 4 ? (
            <div className="flex-middle">
              <div className="fixed-content">
                <div className="alert-wrapper">
                  <div className="heading-title unverified-alert">
                    {t('coin_not_launched_yet')}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <CoinsList />
          )}
        </>
      ) : null}
    </div>
  )
}

export default Supporters
