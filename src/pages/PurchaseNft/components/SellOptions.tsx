import classNames from 'classnames'
// import '@assets/css/components/Spinner.css'
import { useTranslation } from 'react-i18next'
import usdc from '@assets/images/usdc.webp'
import bitcoin from '@assets/images/wrapped-bitcoin.webp'
import tether from '@assets/images/tether.webp'
import ethereum from '@assets/images/ethereum-eth.webp'
import maticIcon from '@assets/images/matic-token-icon.webp'
import approxIcon from '@assets/images/approximation.webp'
import PaymentMethodCard from './PaymentMethodCard'
import { isMobile } from '@utils/helpers'
import PaymentOptionSkeleton from './PaymentOptionSkeleton'
import ImageComponent from '@components/ImageComponent'

const SellOptions = props => {
  const { t } = useTranslation()
  const {
    totalSum,
    paymentOptionsTest,
    fetchSinglePlayerStatsData,
    currencies,
    loginInfo,
    onCloseMenu,
    onMaticSell,
    onTradeSell,
    onApprove,
    onSellForInternal,
  } = props

  const handleSellWithPaymentMethod = (el: any) => {
    if (el?.isMethodApproved) {
      if (loginInfo) {
        onTradeSell(el)
      } else {
        onSellForInternal(el)
      }
    }
  }

  return (
    <div className="available-methods-container">
      <div
        className="terms-subtitle ct-h4 select-pay-title h-none"
        style={{ marginBottom: '10px !important' }}
      >
        {'How you want to be paid ?'}
      </div>
      <div
        className="methods-box"
        style={{ height: isMobile() ? '82%' : 'calc(min(490px, 59vh))' }}
      >
        <PaymentMethodCard
          title={t('cryptocurrency (matic)')}
          isCryptoLoading={false}
          logoSet={[{ id: 3, img: maticIcon, class: 'matic-method-logo' }]}
          labelBottom={'total estimated'}
          valueBottom={totalSum}
          unit="matic"
          onSelect={() => {
            onMaticSell()
          }}
        />
        {paymentOptionsTest.length > 0 &&
        fetchSinglePlayerStatsData.length > 0 &&
        paymentOptionsTest.indexOf(null) < 0 ? (
          paymentOptionsTest?.map((el, ind) => {
            return (
              <div
                key={ind}
                className={classNames('proxy_method_wrapper')}
                style={{ border: '1px solid #abacb5' }}
                onClick={() => handleSellWithPaymentMethod(el)}
              >
                <div className="proxy_method">
                  <div className="proxy_icon">
                    <ImageComponent
                      className="proxy_icon"
                      src={
                        el?.ticker === 'WETH'
                          ? ethereum
                          : el?.ticker === 'USDT'
                          ? tether
                          : el?.ticker === 'USDC'
                          ? usdc
                          : el?.ticker === 'WBTC'
                          ? bitcoin
                          : maticIcon
                      }
                      alt=""
                    />
                  </div>
                  <div>
                    <div className="h-4">{el?.name}</div>
                    <div className="pay-detail">{el?.ticker}</div>
                  </div>
                </div>
                {el?.ticker === 'WETH' && el?.isMethodApproved ? (
                  <div className="pay-detail">
                    <ImageComponent
                      src={approxIcon}
                      className="approx-icon"
                      alt=""
                    />
                    <span>
                      {currencies?.WETHTotalSum
                        ? currencies?.WETHTotalSum
                        : '0.00000'}
                    </span>
                  </div>
                ) : el?.ticker === 'USDT' && el?.isMethodApproved ? (
                  <div className="pay-detail">
                    <ImageComponent
                      src={approxIcon}
                      className="approx-icon"
                      alt=""
                    />
                    <span>
                      {currencies?.USDTTotalSum
                        ? currencies?.USDTTotalSum
                        : '0.00000'}
                    </span>
                  </div>
                ) : el?.ticker === 'USDC' && el?.isMethodApproved ? (
                  <div className="pay-detail">
                    <ImageComponent
                      src={approxIcon}
                      className="approx-icon"
                      alt=""
                    />
                    <span>
                      {currencies?.USDCTotalSum
                        ? currencies?.USDCTotalSum
                        : '0.00000'}
                    </span>
                  </div>
                ) : el?.ticker === 'WBTC' && el?.isMethodApproved ? (
                  <div className="pay-detail">
                    <ImageComponent
                      src={approxIcon}
                      className="approx-icon"
                      alt=""
                    />
                    <span>
                      {currencies?.WBTCTotalSum
                        ? currencies?.WBTCTotalSum
                        : '0.00000'}
                    </span>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      onApprove(el)
                    }}
                  >
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
              </div>
            )
          })
        ) : (
          <>
            {new Array(4).fill(1).map((_: any, index: number) => (
              <PaymentOptionSkeleton key={index} />
            ))}
            {/* <div
              className={classNames(
                'proxy_method_wrapper proxy_method_wrapper_disable',
              )}
              style={{ border: '1px solid #abacb5' }}
            >
              <div className="proxy_method">
                <div className="proxy_icon">
                  <ImageComponent
                    className="proxy_icon"
                    src={ethereum}
                    alt=""
                  />
                </div>
                <div>
                  <div className="h-4">{'Wrapped Ether'}</div>
                  <div className="pay-detail">{'WETH'}</div>
                </div>
              </div>
              <div>
                <div className={classNames('spinner size-small')}>
                </div>
              </div>
            </div>
            <div
              className={classNames(
                'proxy_method_wrapper proxy_method_wrapper_disable',
              )}
              style={{ border: '1px solid #abacb5' }}
            >
              <div className="proxy_method">
                <div className="proxy_icon">
                  <ImageComponent className="proxy_icon" src={tether} alt="" />
                </div>
                <div>
                  <div className="h-4">{'US Tether'}</div>
                  <div className="pay-detail">{'USDT'}</div>
                </div>
              </div>
              <div>
                <div className={classNames('spinner size-small')}>
                </div>
              </div>
            </div>
            <div
              className={classNames(
                'proxy_method_wrapper proxy_method_wrapper_disable',
              )}
              style={{ border: '1px solid #abacb5' }}
            >
              <div className="proxy_method">
                <div className="proxy_icon">
                  <ImageComponent className="proxy_icon" src={usdc} alt="" />
                </div>
                <div>
                  <div className="h-4">{'USDC'}</div>
                  <div className="pay-detail">{'USDC'}</div>
                </div>
              </div>
              <div>
                <div className={classNames('spinner size-small')}>
                </div>
              </div>
            </div>
            <div
              className={classNames(
                'proxy_method_wrapper proxy_method_wrapper_disable',
              )}
              style={{ border: '1px solid #abacb5' }}
            >
              <div className="proxy_method">
                <div className="proxy_icon">
                  <ImageComponent className="proxy_icon" src={bitcoin} alt="" />
                </div>
                <div>
                  <div className="h-4">{'Wrapped Bitcoin'}</div>
                  <div className="pay-detail">{'WBTC'}</div>
                </div>
              </div>
              <div>
                <div className={classNames('spinner size-small')}>
                </div>
              </div>
            </div> */}
          </>
        )}
      </div>
      <div
        className="deposit-cancel"
        style={{ marginTop: '10px !important' }}
        onClick={onCloseMenu}
      >
        {t('close')}
      </div>
    </div>
  )
}

export default SellOptions
