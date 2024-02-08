import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import AppLayout from '@components/Page/AppLayout'
import '@assets/css/pages/Terms&Conditions.css'
import Clause from './components/Clause'
import { isMobile } from '@utils/helpers'
import { useNavigate } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import {
  getWalletDetails,
  showWalletForm,
} from '@root/apis/onboarding/authenticationSlice'
import { RootState } from '@root/store/rootReducers'

const ProtocolDisclaimerDe: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const accessToken = localStorage.getItem('accessToken')
  const { isNoWallet, userName, walletDetailAddress } = authenticationData

  useEffect(() => {
    if (userName) {
      if (accessToken && !walletDetailAddress) {
        dispatch(getWalletDetails()) // COMMENTED FOR PROD
      }
    }
  }, [userName])

  useEffect(() => {
    if (isNoWallet && !localStorage.getItem('loginInfo')) {
      dispatch(showWalletForm({ isMandatory: true }))
    }
  }, [isNoWallet])

  return (
    <div className="terms-container disclaimer-container">
      <div className="mt-20 mb-20 policy-wrapper">
        <Clause
          title={t('meCarreira Protocol Disclaimer (DE)')}
          isMainTitle
          fontStyle="text-left ct-h1"
        >
          <div className="terms-content">
            <p className="ct-p1">
              meCarreira is a decentralized protocol that people can use to
              trade ERC-20 tokens and NFTs, submit votes, win NFT and bid for
              NFTs. The meCarreira protocol is a set of smart contracts that are
              deployed on the public Polygon Blockchain and can be used by
              anyone without the need to use any other products developed and
              run by the meCarreira AG, including the website
              https://meCarreira.com. You can access the meCarreira protocol
              through other web or mobile interfaces. You are responsible for
              doing your own diligence on those interfaces to understand the
              fees and risks they present. The use of the meCarreira protocol
              involves various risks, including, but not limited to, losses
              while digital assets are being supplied to the meCarreira protocol
              and losses due to the fluctuation of prices of tokens including
              NFTs.
            </p>
            <p className="ct-p1">
              AS DESCRIBED IN THE MECARREIRA PROTOCOL LICENSES, THE MECARREIRA
              PROTOCOL IS PROVIDED "AS IS", AT YOUR OWN RISK, AND WITHOUT
              WARRANTIES OF ANY KIND. Although meCarreira AG (Switzerland)
              developed much of the initial code for the meCarreira protocol, it
              does not provide, own, or control the meCarreira protocol, which
              is run by smart contracts deployed on the public Polygon
              blockchain. No developer or entity involved in creating the
              meCarreira protocol will be liable for any claims or damages
              whatsoever associated with your use, inability to use, or your
              interaction with other users of, the meCarreira protocol,
              including any direct, indirect, incidental, special, exemplary,
              punitive or consequential damages, or loss of profits,
              cryptocurrencies, tokens, or anything else of value.
            </p>
          </div>
        </Clause>
      </div>
    </div>
  )
}

export default ProtocolDisclaimerDe
