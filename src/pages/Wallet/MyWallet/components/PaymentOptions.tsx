import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { useTranslation } from 'react-i18next'
import ImageComponent from '@components/ImageComponent'
import usdc from '@assets/images/usdc.webp'
import bitcoin from '@assets/images/wrapped-bitcoin.webp'
import tether from '@assets/images/tether.webp'
import ethereum from '@assets/images/ethereum-eth.webp'

interface balanceObj {
  WETH: string
  USDC: string
  USDT: string
  WBTC: string
}

interface Props {
  data?: any
  balances?: balanceObj
}

const WalletPaymentOptions: React.FC<Props> = ({ data, balances }) => {
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')
  const { t } = useTranslation()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const {
    balanceOfAllowanceData = null,
    currencyListData: { payment_options, contract_abi },
  } = authenticationData

  const checkIfNeedToShow = ticker => {
    if (loginId) {
      if (
        balanceOfAllowanceData &&
        Object.keys(balanceOfAllowanceData).length > 0 &&
        balanceOfAllowanceData[ticker] &&
        balanceOfAllowanceData[ticker]?.balanceof !== 0
      ) {
        return true
      } else {
        return false
      }
    } else if (loginInfo) {
      if (balances[ticker] !== '0.00000') {
        return true
      } else {
        return false
      }
    }
  }

  return (
    <>
      {payment_options?.map((element, index) => {
        return element?.ticker === 'WETH' &&
          checkIfNeedToShow(element.ticker) ? (
          <div key={index}>
            <div style={{ width: '100%' }}>
              <div key={index} className="options_balance">
                <div className="proxy_method">
                  <div className="proxy_icon">
                    <ImageComponent
                      className="proxy_icon"
                      style={
                        element?.ticker === 'WETH' || element?.ticker === 'USDC'
                          ? { width: '34px', height: '34px' }
                          : {}
                      }
                      src={ethereum}
                      alt=""
                    />
                  </div>
                  <div className="h-4" style={{ textDecoration: 'none' }}>
                    {element?.name}
                  </div>
                </div>
                <div>
                  <div className="pay-detail" style={{ cursor: 'default' }}>
                    <span>
                      {loginId
                        ? parseFloat(
                            balanceOfAllowanceData?.WETH?.balanceof,
                          ).toFixed(5)
                        : loginInfo
                        ? balances?.WETH
                        : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : element?.ticker === 'USDC' && checkIfNeedToShow(element.ticker) ? (
          <div key={index}>
            <div style={{ width: '100%' }}>
              <div key={index} className="options_balance">
                <div className="proxy_method">
                  <div className="proxy_icon">
                    <ImageComponent
                      className="proxy_icon"
                      style={
                        element?.ticker === 'WETH' || element?.ticker === 'USDC'
                          ? { width: '34px', height: '34px' }
                          : {}
                      }
                      src={usdc}
                      alt=""
                    />
                  </div>
                  <div className="h-4" style={{ textDecoration: 'none' }}>
                    {element?.name}
                  </div>
                </div>
                <div>
                  <div className="pay-detail" style={{ cursor: 'default' }}>
                    <span>
                      {/* {parseFloat(balanceOfAllowanceData?.USDC?.balanceof).toFixed(
                       5,
                     ) || balances?.USDC} */}
                      {loginId
                        ? parseFloat(
                            balanceOfAllowanceData?.USDC?.balanceof,
                          ).toFixed(5)
                        : loginInfo
                        ? balances?.USDC
                        : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : element?.ticker === 'USDT' && checkIfNeedToShow(element.ticker) ? (
          <div key={index}>
            <div style={{ width: '100%' }}>
              <div key={index} className="options_balance">
                <div className="proxy_method">
                  <div className="proxy_icon">
                    <ImageComponent
                      className="proxy_icon"
                      style={
                        element?.ticker === 'WETH' || element?.ticker === 'USDC'
                          ? { width: '34px', height: '34px' }
                          : {}
                      }
                      src={tether}
                      alt=""
                    />
                  </div>
                  <div className="h-4" style={{ textDecoration: 'none' }}>
                    {element?.name}
                  </div>
                </div>
                <div>
                  <div className="pay-detail" style={{ cursor: 'default' }}>
                    <span>
                      {/* {parseFloat(balanceOfAllowanceData?.USDT?.balanceof).toFixed(
                       5,
                     ) || balances?.USDT} */}
                      {loginId
                        ? parseFloat(
                            balanceOfAllowanceData?.USDT?.balanceof,
                          ).toFixed(5)
                        : loginInfo
                        ? balances?.USDT
                        : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : element?.ticker === 'WBTC' && checkIfNeedToShow(element.ticker) ? (
          <div key={index}>
            <div style={{ width: '100%' }}>
              <div key={index} className="options_balance">
                <div className="proxy_method">
                  <div className="proxy_icon">
                    <ImageComponent
                      className="proxy_icon"
                      style={
                        element?.ticker === 'WETH' || element?.ticker === 'USDC'
                          ? { width: '34px', height: '34px' }
                          : {}
                      }
                      src={bitcoin}
                      alt=""
                    />
                  </div>
                  <div className="h-4" style={{ textDecoration: 'none' }}>
                    {element?.name}
                  </div>
                </div>
                <div>
                  <div className="pay-detail" style={{ cursor: 'default' }}>
                    <span>
                      {/* {parseFloat(balanceOfAllowanceData?.WBTC?.balanceof).toFixed(
                       5,
                     ) || balances?.WBTC} */}
                      {loginId
                        ? parseFloat(
                            balanceOfAllowanceData?.WBTC?.balanceof,
                          ).toFixed(5)
                        : loginInfo
                        ? balances?.WBTC
                        : ''}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null
      })}
    </>
  )
}

export default React.memo(WalletPaymentOptions)
