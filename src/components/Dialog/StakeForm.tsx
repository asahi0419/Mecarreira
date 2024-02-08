import React, { useEffect } from 'react'
import SubmitButton from '@components/Button/SubmitButton'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getPlayerDetailsImplicit } from '@root/apis/playerCoins/playerCoinsSlice'
import {
  showPurchaseForm,
  showStakingForm,
} from '@root/apis/onboarding/authenticationSlice'
import Spinner from '../Spinner'
import { RootState } from '@root/store/rootReducers'

interface Props {
  detailpageurl: string
  onClose: () => void
}

const StakeForm: React.FC<Props> = ({ detailpageurl, onClose }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  useEffect(() => {
    if (detailpageurl) {
      dispatch(getPlayerDetailsImplicit(detailpageurl))
    }
  }, [])

  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const { isLoading, getPlayerDetailsImplicitSuccessData } = playerCoinData

  const stopPropagation = (event: any) => {
    event.stopPropagation()
  }

  const handleStake = () => {
    onClose()
    dispatch(
      showStakingForm({
        playerData: getPlayerDetailsImplicitSuccessData,
      }),
    )
  }

  const handlePurchase = () => {
    onClose()
    dispatch(
      showPurchaseForm({
        mode: 'BUY',
        playerData: getPlayerDetailsImplicitSuccessData,
      }),
    )
  }

  return (
    <div className="bid-container" onClick={stopPropagation}>
      <div className="bid-title">{t('stake coins to bid')}</div>
      <div className="bid-desc">{t('no player coins staked to buy this')}</div>
      <div className="bid-submit">
        {isLoading ? (
          <Spinner title={''} spinnerStatus={isLoading} />
        ) : (
          <>
            <SubmitButton
              isDisabled={false}
              title={t('stake coins')}
              className="m-0auto stake-mode"
              onPress={handleStake}
            />
            <SubmitButton
              isDisabled={false}
              title={t('buy player coins')}
              className="stake-buy-btn"
              onPress={handlePurchase}
            />
          </>
        )}
        <div className="nft-close-link" onClick={onClose}>
          {t('close')}
        </div>
      </div>
    </div>
  )
}

export default StakeForm
