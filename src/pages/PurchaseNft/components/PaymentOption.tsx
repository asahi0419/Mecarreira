import React from 'react'
import classNames from 'classnames'
// import '@assets/css/components/Spinner.css'
import { RootState } from '@root/store/rootReducers'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import usdc from '@assets/images/usdc.webp'
import bitcoin from '@assets/images/wrapped-bitcoin.webp'
import tether from '@assets/images/tether.webp'
import ethereum from '@assets/images/ethereum-eth.webp'
import maticIcon from '@assets/images/matic-token-icon.webp'
import approxIcon from '@assets/images/approximation.webp'
import ImageComponent from '@components/ImageComponent'

interface Props {
  element: any
  optionIndex: any
  handleBuyWithPaymentMethod: () => void
  handleApproveMethod: () => void
  WETHTotalSum: any
  USDTTotalSum: any
  USDCTotalSum: any
  WBTCTotalSum: any
  isMatic?: boolean
  payItem: any
}

const PaymentOption: React.FC<Props> = props => {
  const { t } = useTranslation()
  const {
    element,
    optionIndex,
    handleBuyWithPaymentMethod,
    handleApproveMethod,
    WETHTotalSum,
    USDTTotalSum,
    USDCTotalSum,
    WBTCTotalSum,
    payItem,
  } = props

  // console.log({ element })

  const playerStatsData = useSelector((state: RootState) => state.playerstats)
  const { fetchSinglePlayerStatsBuy } = playerStatsData
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { loadingBuy, selectedThemeRedux } = authenticationData
  const getCurrencyEquivalent = payOption => {
    return fetchSinglePlayerStatsBuy[0][payOption?.ticker]
  }

  const getStyles = () => {
    if (
      payItem?.availableBalance <= getCurrencyEquivalent(payItem) &&
      payItem?.isMethodApproved
    ) {
      return {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '13px',
      }
    }
    return null
  }

  return (
    <div style={{ width: '100%' }}>
      <div
        key={optionIndex}
        className={classNames(
          'proxy_method_wrapper',
          payItem?.availableBalance <= getCurrencyEquivalent(payItem) &&
            payItem?.isMethodApproved
            ? 'proxy_method_wrapper_disable'
            : '',
        )}
        onClick={handleBuyWithPaymentMethod}
      >
        <div className="proxy_method">
          <div className="proxy_icon">
            {element ? (
              <ImageComponent
                className="proxy_icon"
                src={
                  element?.ticker === 'WETH'
                    ? ethereum
                    : element?.ticker === 'USDT'
                    ? tether
                    : element?.ticker === 'USDC'
                    ? usdc
                    : element?.ticker === 'WBTC'
                    ? bitcoin
                    : maticIcon
                }
                alt=""
              />
            ) : (
              <div className="skeleton proxy_icon_skeleton">
                <div className="skeleton proxy_icon_skeleton" />
              </div>
            )}
          </div>
          {element ? (
            <div>
              <div className="h-4">{element?.name}</div>
              <div className="pay-detail">{element?.ticker}</div>
            </div>
          ) : (
            <div>
              <div className="skeleton h-4 pay-title-skeleton"></div>
              <div className="skeleton pay-detail-skeleton"></div>
            </div>
          )}
        </div>
        {payItem ? (
          <div style={getStyles()}>
            {payItem?.ticker === 'WETH' && payItem?.isMethodApproved ? (
              <div className="pay-detail">
                <ImageComponent
                  src={approxIcon}
                  className="approx-icon"
                  alt=""
                />
                <span>{WETHTotalSum ? WETHTotalSum : '0.00000'}</span>
              </div>
            ) : payItem?.ticker === 'USDT' && payItem?.isMethodApproved ? (
              <div className="pay-detail">
                <ImageComponent
                  src={approxIcon}
                  className="approx-icon"
                  alt=""
                />
                <span>{USDTTotalSum ? USDTTotalSum : '0.00000'}</span>
              </div>
            ) : payItem?.ticker === 'USDC' && payItem?.isMethodApproved ? (
              <div className="pay-detail">
                <ImageComponent
                  src={approxIcon}
                  className="approx-icon"
                  alt=""
                />
                <span>{USDCTotalSum ? USDCTotalSum : '0.00000'}</span>
              </div>
            ) : payItem?.ticker === 'WBTC' && payItem?.isMethodApproved ? (
              <div className="pay-detail">
                <ImageComponent
                  src={approxIcon}
                  className="approx-icon"
                  alt=""
                />
                <span>{WBTCTotalSum ? WBTCTotalSum : '0.00000'}</span>
              </div>
            ) : (
              <div onClick={handleApproveMethod}>
                <button
                  className="purchase-btn"
                  style={{
                    width: '80px',
                    height: '40px',
                    margin: '0px',
                    padding: '0px',
                  }}
                >
                  {t('approve')}
                </button>
              </div>
            )}
            {payItem?.availableBalance <= getCurrencyEquivalent(payItem) &&
            payItem?.isMethodApproved ? (
              <div className="input-feedback text-center w-none">
                {t('not enough balance')}
              </div>
            ) : null}
          </div>
        ) : (
          <div className={classNames('spinner size-small')}></div>
        )}
      </div>
    </div>
  )
}

export default PaymentOption
