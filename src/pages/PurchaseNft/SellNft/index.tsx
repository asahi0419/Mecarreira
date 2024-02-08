import React, { useEffect } from 'react'
import { AppLayout } from '@components/index'
import SellNftForm from './SellNftForm'
import TabGroup from '@components/Page/TabGroup'
import { setPurchaseMode } from '@root/apis/purchase/purchaseSlice'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import '@assets/css/pages/PurchaseNft.css'
import { useTranslation } from 'react-i18next'
import { RootState } from '@root/store/rootReducers'
import NewSellForm from './NewSellForm'

const SellNft: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
    window.history.replaceState(null, 'Buy', '/')
  }, [])
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location: any = useLocation()

  const authenticationData: any = useSelector(
    (state: RootState) => state.authentication,
  )
  const { newBuySellForm } = authenticationData

  const handleGetPurchaseTab = (tab: string) => {
    dispatch(setPurchaseMode(tab))
  }

  return (
    <AppLayout
      headerStatus="header-status"
      headerClass="home"
      footerStatus="footer-status"
      noPageFooter={true}
    >
      <section className="players-buy">
        <TabGroup
          defaultTab={'SELL'}
          tabSet={[t('buy').toUpperCase(), t('sell').toUpperCase()]}
          getSwitchedTab={handleGetPurchaseTab}
        />
        {newBuySellForm ? (
          <NewSellForm
            playerData={location?.state?.profileData}
            onClosePopup={() => navigate(-1)}
          />
        ) : (
          <SellNftForm
            playerData={location?.state?.profileData}
            onClosePopup={() => navigate(-1)}
          />
        )}
      </section>
    </AppLayout>
  )
}

export default SellNft
