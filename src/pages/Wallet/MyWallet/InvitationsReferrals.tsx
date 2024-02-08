import React, { useState } from 'react'
import classnames from 'classnames'
import { useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import ImageComponent from '@components/ImageComponent'
import ShareIcon from '@assets/icons/icon/shareIcon.svg'
import ShareIconBlack from '@assets/icons/icon/ShareIconBlack.svg'
import LinkIcon from '@mui/icons-material/Link'
import TabGroup from '@components/Page/TabGroup'
import { Input } from '@components/Form'
import { isMobile } from '@utils/helpers'
import MyReferral from '../../Landing/UserSettings/MyReferral'
import PlayerReferral from '@pages/Landing/UserSettings/PlayerReferral'
import Earnings from './Earnings'
interface Props {
  title: string
  address?: string
  isMaticDeposit?: boolean
  containerClassName?: string
  onClose: () => void
}

const InvitationsReferrals: React.FC<Props> = ({
  containerClassName = '',
  title,
  address,
  isMaticDeposit = false,
  onClose,
}) => {
  const [isAddressCopied, setAddressCopied] = useState(false)
  const { t } = useTranslation()
  const handleCopy = () => {
    setAddressCopied(!isAddressCopied)
    navigator.clipboard.writeText(address ?? 's')
  }
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const {
    currencyListData: { payment_options },
    selectedThemeRedux,
    referralDataLoader,
    sharePopWallet,
    playerReferralDataLoader,
    playerReferralDataSuccess,
  } = authenticationData
  const [activeTab, setActiveTab] = useState('Invitations')
  const handleGetTab = (tab: string) => {
    // dispatch(getWalletDetails())
    setActiveTab(tab)
  }
  return (
    <div className="invitation_referrals">
      <TabGroup
        defaultTab={activeTab}
        tabSet={['Players', 'Invitations', 'Earnings']}
        tabClassName="wallet-tab"
        getSwitchedTab={handleGetTab}
      />
      <section
        className={classnames(
          'wallet-container deposit-address-container',
          isMobile() ? 'wallet-invite-referral-box' : '',
          containerClassName,
          activeTab === 'Invitations' ? 'p-16' : 'p-10',
        )}
      >
        {/* My Referral Codes */}
        {activeTab === 'Players' ? (
          <PlayerReferral />
        ) : activeTab === 'Invitations' ? (
          <MyReferral mode="wallet" />
        ) : activeTab === 'Earnings' ? (
          <Earnings />
        ) : null}
        {referralDataLoader || playerReferralDataLoader ? null : (
          <div
            className={classNames(
              'green-line-btn mb-40',
              sharePopWallet ? 'export-deposit-key' : '',
              !isMobile() &&
                activeTab === 'Players' &&
                (playerReferralDataSuccess?.used_code?.length > 0 ||
                  playerReferralDataSuccess?.one_time_code?.length > 0 ||
                  playerReferralDataSuccess?.permanent_codes?.length > 0)
                ? ''
                : isMobile() &&
                  activeTab === 'Players' &&
                  playerReferralDataSuccess?.used_code?.length > 0 &&
                  playerReferralDataSuccess?.one_time_code?.length > 0 &&
                  playerReferralDataSuccess?.permanent_codes?.length > 0
                ? ''
                : '',
            )}
            // style={{ bottom: '3%' }}
            onClick={onClose}
          >
            {t('close')}
          </div>
        )}
      </section>
    </div>
  )
}

export default InvitationsReferrals
