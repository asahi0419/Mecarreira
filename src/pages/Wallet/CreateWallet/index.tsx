import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'
import '@assets/css/pages/Wallet.css'
import { isMobile } from '@utils/helpers'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import HotToaster from '@components/HotToaster'
import { asyncLocalStorage } from '@utils/helpers'
import { resetPlayerData } from '@root/apis/playerCoins/playerCoinsSlice'
import {
  logout,
  resetWallet,
  showWalletForm,
} from '@root/apis/onboarding/authenticationSlice'
import classNames from 'classnames'

interface Props {
  onSubmit: any
}

const CreateWallet: React.FC<Props> = ({ onSubmit }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [isLoading, setLoading] = useState(false)
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    loader,
    isGetWalletError,
    isCreateWalletDisabled,
    isGetAddressWalletError,
    selectedThemeRedux,
  } = authenticationData

  const handleLogout = async () => {
    setLoading(true)
    asyncLocalStorage.getItem('refreshToken').then(token => {
      const reqParams = {
        refresh_token: token,
      }
      dispatch(resetPlayerData())
      dispatch(resetWallet())
      // dispatch(logout(reqParams))
      dispatch(logout({ reqParams, location: 'createWallet_line46' }))
      dispatch(showWalletForm({}))
      localStorage.removeItem('ISLAUNCHCLICKED')
      localStorage.removeItem('userWalletAddress')
      localStorage.removeItem('ISGOLIVECLICKED')
    })
  }

  return (
    <div
      className={classnames(
        'purchase-container wallet-wrapper',
        isMobile() ? 'mobile-wrapper' : '',
      )}
    >
      <HotToaster />
      <h2 className="wallet-heading mt-40">
        {t('first create a wallet to buy or receive crypto')}
      </h2>
      <p className="wallet-text">
        {t('your wallet is protected by a secret.')}
        <br />
        {t('only you have access')}
      </p>
      {isCreateWalletDisabled ? (
        <div className={classnames('loading-spinner', 'wallet-waiting')}></div>
      ) : (
        <>
          <div
            className={classnames('button-box', loader ? 'hidden' : '')}
            onClick={onSubmit} //Disable for UAT
          >
            {t('create wallet')}
          </div>
          <a
            href="#"
            className={classnames(
              'resend-link no-click no-create',
              loader ? 'hidden' : '',
            )}
          >
            {t('dont want create wallet')}
          </a>
          {!isLoading ? (
            <div className="logout-spinner-container">
              <div
                className={classnames(
                  'spinner size-small',
                  isLoading ? '' : 'hidden',
                )}
              ></div>
            </div>
          ) : (
            <div className="deposit-cancel log-out" onClick={handleLogout}>
              {t('log out')}
            </div>
          )}
        </>
      )}
      <div
        className={classnames(
          'loading-spinner',
          'wallet-waiting',
          !loader ? 'hidden' : '',
        )}
      >
        <div className="spinner"></div>
        <p>{t('fetching wallet status') + '...'}</p>
      </div>
      {isGetWalletError ||
        (isGetAddressWalletError && (
          <div className="input-feedback text-center">
            {isGetWalletError || isGetAddressWalletError}
          </div>
        ))}
    </div>
  )
}

export default CreateWallet
