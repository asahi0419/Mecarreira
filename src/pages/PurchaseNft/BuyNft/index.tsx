import React, { useEffect, useState } from 'react'
import { AppLayout } from '@components/index'
import BuyNftForm from './BuyNftForm'
import TabGroup from '@components/Page/TabGroup'
import { useNavigate, useLocation } from 'react-router-dom'
import '@assets/css/pages/PurchaseNft.css'
import { useTranslation } from 'react-i18next'
import { RootState } from '@root/store/rootReducers'
import { useSelector } from 'react-redux'
import NewBuyForm from './NewBuyForm'

const BuyNft: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
    window.history.replaceState(null, 'Buy', '/')
  }, [])
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location: any = useLocation()
  const [isTabHidden, setTabHidden] = useState(false)

  const authenticationData: any = useSelector(
    (state: RootState) => state.authentication,
  )
  const { newBuySellForm } = authenticationData

  const handleCreditCardSelect = (value: string) => {
    if (value === 'hide') {
      setTabHidden(true)
    } else {
      setTabHidden(false)
    }
  }

  return (
    <AppLayout
      headerStatus="header-status"
      headerClass="home"
      footerStatus="footer-status"
      noPageFooter={true}
    >
      <section className="players-buy">
        {!isTabHidden && (
          <TabGroup
            defaultTab={'BUY'}
            tabSet={[t('buy').toUpperCase(), t('sell').toUpperCase()]}
          />
        )}
        {newBuySellForm ? (
          <NewBuyForm
            playerData={location?.state?.profileData}
            onClosePopup={() => navigate(-1)}
            onSelectCreditCard={handleCreditCardSelect}
          />
        ) : (
          <BuyNftForm
            playerData={location?.state?.profileData}
            onClosePopup={() => navigate(-1)}
            onSelectCreditCard={handleCreditCardSelect}
          />
        )}
      </section>
    </AppLayout>
  )
}

export default BuyNft
