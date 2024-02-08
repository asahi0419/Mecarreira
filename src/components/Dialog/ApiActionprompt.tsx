import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import SubmitButton from '@components/Button/SubmitButton'
import ApiBottomPopup from './ApiBottomPopup'
import ImageComponent from '@components/ImageComponent'
import maticIcon from '@assets/images/matic-token-icon.webp'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { launchCoin } from '@root/apis/playerCoins/playerCoinsSlice'
import { goLiveLoadingDis } from '@root/apis/onboarding/authenticationSlice'

interface Props {
  promptText: string
  onSuccess: any
  onClose: any
  operationMode?: string
  walletAddress?: string
  hideWalletAddress?: boolean
  customClass?: string
  myReferralClass?: string
  noPasswordForm?: boolean
  paddingClass?: string
}

const ApiActionPrompt: React.FC<Props> = ({
  onSuccess,
  onClose,
  promptText,
  operationMode = 'add',
  walletAddress,
  hideWalletAddress = false,
  customClass = '',
  myReferralClass = '',
  noPasswordForm,
  paddingClass = '',
}) => {
  const { t } = useTranslation()
  const [isLoading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const playerCoinData: any = useSelector(
    (state: RootState) => state.playercoins,
  )

  const { selectedPlayer } = playerCoinData
  const handleLaunchCoinApi = (user_secret: any) => {
    try {
      const formData = new FormData()
      formData.append('contract', selectedPlayer?.playercontract)
      formData.append('user_secret', user_secret)
      dispatch(launchCoin(formData))
      dispatch(goLiveLoadingDis({ goLiveLoading: true }))
      onClose()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section className="new-draft">
      <ApiBottomPopup
        showPopup={isLoading}
        onSubmit={onSuccess}
        onClose={onClose}
        customClass={customClass}
        myReferral={myReferralClass === '' ? false : true}
        noPasswordForm={noPasswordForm}
      />
      <div
        className={`remove-adminplayer-prompt-wrapper ${myReferralClass} ${paddingClass}`}
      >
        <div className="new-draft-title">{promptText}</div>
        {hideWalletAddress ? (
          <div
            className={classNames(
              'new-draft-title eth-address',
              operationMode === 'add' ? 'success' : 'error',
              myReferralClass === 'box_padding' ? 'displayFlex' : '',
            )}
          >
            <div>
              {myReferralClass === 'box_padding' ? (
                <ImageComponent
                  src={maticIcon}
                  alt=""
                  style={{ width: '25px', height: '25px' }}
                />
              ) : null}
            </div>
            <div>
              {walletAddress ?? localStorage.getItem('userWalletAddress')}
            </div>
          </div>
        ) : (
          ''
        )}
        {myReferralClass === 'box_padding' ? (
          <p className="mt-20">LRS (lifetime revenue token)</p>
        ) : null}
        <div className="mt-10">
          <SubmitButton
            title={t('yes')}
            className="m-0auto mt-20"
            onPress={() => {
              if (noPasswordForm) {
                handleLaunchCoinApi()
              } else {
                setLoading(true)
              }
            }}
          />
          <SubmitButton
            title={t('no')}
            className="m-0auto mt-20 btn-disabled"
            onPress={onClose}
          />
        </div>
      </div>
    </section>
  )
}

export default ApiActionPrompt
