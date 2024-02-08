import React from 'react'
import classNames from 'classnames'
// import '@assets/css/components/Spinner.css'
import maticIcon from '@assets/images/matic-token-icon.webp'
import approxIcon from '@assets/images/approximation.webp'
import ImageComponent from '@components/ImageComponent'

interface Props {
  valueBottom: string
  isInsufficientMatics?: boolean
  onSelect?: () => void
}

const PaymentOptionMatic: React.FC<Props> = props => {
  const { onSelect, valueBottom, isInsufficientMatics = false } = props
  return (
    <div
      className={classNames(
        'proxy_method_wrapper',
        isInsufficientMatics ? 'proxy_method_wrapper_disable' : '',
      )}
      style={{ border: '1px solid #abacb5' }}
      onClick={onSelect}
    >
      <div className="proxy_method">
        <div className="proxy_icon">
          <ImageComponent className="proxy_icon" src={maticIcon} alt="" />
        </div>
        <div>
          <div className="h-4">Polygon</div>
          <div className="pay-detail">MATIC</div>
        </div>
      </div>
      {/* <div className="pay-detail">
        <ImageComponent src={approxIcon} className="approx-icon" alt="" />
        <span>{valueBottom}</span>
        {isInsufficientMatics ? (
          <div className="danger-funds">{'Not enough balance'}</div>
        ) : (
          ''
        )}
      </div> */}
      <div
        style={{
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div className="pay-detail">
          <ImageComponent src={approxIcon} className="approx-icon" alt="" />
          <span>{valueBottom}</span>
        </div>
        {isInsufficientMatics ? (
          <div className="input-feedback text-center w-none">
            {'Not enough balance'}
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  )
}

export default PaymentOptionMatic
