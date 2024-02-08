import React, { useEffect } from 'react'
import SubmitButton from '@components/Button/SubmitButton'
import { RootState } from '@root/store/rootReducers'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getPlayerDetailsImplicit } from '@root/apis/playerCoins/playerCoinsSlice'
import {
  showNftForm,
  showPurchaseForm,
  showStakingForm,
} from '@root/apis/onboarding/authenticationSlice'
import Spinner from '@components/Spinner'

interface Props {
  detailpageurl: string
  isPro: boolean
  onClose: () => void
}

const Stake: React.FC<Props> = ({ detailpageurl, isPro, onClose }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  useEffect(() => {
    if (detailpageurl) {
      dispatch(getPlayerDetailsImplicit(detailpageurl))
    }
  }, [])

  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const { isLoading, getPlayerDetailsImplicitSuccessData } = playerCoinData

  const handleStake = () => {
    onClose()
    dispatch(showNftForm({}))
    dispatch(
      showStakingForm({
        playerData: getPlayerDetailsImplicitSuccessData,
      }),
    )
  }

  const handlePurchase = () => {
    onClose()
    dispatch(showNftForm({}))
    dispatch(
      showPurchaseForm({
        mode: 'BUY',
        playerData: getPlayerDetailsImplicitSuccessData,
      }),
    )
  }

  return (
    <section className="wallet-container stake-bid-container">
      <div className="bid-title">{t('stake coins to bid')}</div>
      <div className="bid-desc mt-40 mb-40">
        {t('no player coins staked to buy this')}
      </div>
      <div className="bid-submit stake-bid-btn-wrapper">
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
    </section>
  )
}

export default Stake
