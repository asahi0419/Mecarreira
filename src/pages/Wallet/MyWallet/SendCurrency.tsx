import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import { ethers } from 'ethers'
import Yup from '@components/YupExtended'
import classnames from 'classnames'
import SubmitButton from '@components/Button/SubmitButton'
import FormInput from '@components/Form/FormInput'
import { Input } from '@components/Form'
import { useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { useTranslation } from 'react-i18next'
import { ConnectContext } from '@root/WalletConnectProvider'
import { isMobile, truncateDecimals } from '@utils/helpers'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import classNames from 'classnames'
import ImageComponent from '@components/ImageComponent'
import { useWalletHelper } from '@utils/WalletHelper'

interface Props {
  onSubmit: any
  onClose: any
  onChangeCurrency?: any
  assetType?: string
  currenciesData?: string[]
  playerData?: any
  isNoScroll?: boolean
}

const initialValues = {
  matic: '',
  address: '',
}

const SendCurrency: React.FC<Props> = ({
  onSubmit,
  onClose,
  onChangeCurrency,
  currenciesData = [],
  playerData = null,
  assetType = 'MATIC',
  isNoScroll = false,
}) => {
  const loginInfo = localStorage.getItem('loginInfo')
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const [currencyIndex, setCurrencyIndex] = useState(0)
  const [availableBalance, setAvailableBalance] = useState<any>('0.00')
  const [inputAmount, setInputAmount] = useState<any>('')
  const [clear, setClear] = useState(false)
  const [maxTrue, setMaxTrue] = useState(false)
  const [isInvalidEthAddress, setInvalidEthAddress] = useState<boolean>(false)
  const { t } = useTranslation()
  const { getBalance } = useWalletHelper()
  const {
    passphraseLoader,
    userWalletData: { balance },
    userWalletCryptoData: { amount, gasprice },
    wethCurrencyBalance,
    usdtCurrencyBalance,
    usdcCurrencyBalance,
    wbtcCurrencyBalance,
    currencyListData: { payment_options },
    selectedThemeRedux,
  } = authenticationData
  useEffect(() => {
    if (assetType === 'MATIC') {
      setAvailableBalance(amount - gasprice)
    } else if (assetType === 'WETH') {
      setAvailableBalance(wethCurrencyBalance)
    } else if (assetType === 'USDT') {
      setAvailableBalance(usdtCurrencyBalance)
    } else if (assetType === 'USDC') {
      setAvailableBalance(usdcCurrencyBalance)
    } else if (assetType === 'WBTC') {
      setAvailableBalance(wbtcCurrencyBalance)
    }
  }, [amount, gasprice, balance, assetType])

  useEffect(() => {
    const _getBalance = async () => {
      if (loginInfo) {
        await getBalance()
      }
    }
    _getBalance()
  }, [])

  const submitForm = (values: any) => {
    const reqParams = {
      to_address: values.address,
      amount: maxTrue
        ? parseFloat(values.matic) - gasprice
        : assetType === 'playerCoin'
        ? parseFloat(values.matic)
        : parseFloat(values.matic),
      maxSelected: maxTrue,
      currencyIndex,
    }
    let isValidAddress = false
    try {
      const isAddress = ethers.utils.getAddress(values.address)
      if (isAddress) {
        isValidAddress = true
      }
    } catch (err: any) {
      if (err?.reason === 'invalid address') {
        isValidAddress = false
      }
    }
    if (isValidAddress) {
      onSubmit(reqParams)
    } else {
      setInvalidEthAddress(true)
    }
  }

  const handleChangeCurrency = (event: any) => {
    setCurrencyIndex(Number(event?.target?.value))
    if (onChangeCurrency) {
      onChangeCurrency(event)
    }
  }

  Yup.addMethod(Yup.string, 'isWalletAddressValid', function (errorMessage) {
    return this.test(`test-card-type`, errorMessage, function (value: any) {
      const { path, createError } = this
      return (
        ethers.utils.isAddress(value) ||
        createError({ path, message: errorMessage })
      )
    })
  })

  const isFundsInsufficient =
    parseFloat(availableBalance) < parseFloat(inputAmount) ||
    parseFloat(availableBalance) === 0

  const isTokensInsufficient = playerData
    ? parseFloat(playerData.balance) < parseFloat(inputAmount) ||
      parseFloat(playerData.balance) === 0
    : null

  return (
    <section
      className={classnames(
        'wallet-container',
        isNoScroll ? '' : 'wallet-flyer',
      )}
    >
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={(values, { resetForm }) => {
          submitForm(values)
          resetForm()
        }}
        validationSchema={Yup.object().shape({
          matic: Yup.string().required(
            assetType === 'playerCoin'
              ? 'player coin amount required'
              : `${assetType.toUpperCase()} amount required`,
          ),
          address: Yup.string()
            .required('receiver address required')
            .isWalletAddressValid('Invalid address'),
        })}
      >
        {props => {
          const {
            values,
            touched,
            errors,
            isValid,
            dirty,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
          } = props
          return (
            <form autoComplete="off" onSubmit={handleSubmit}>
              {playerData ? (
                <div
                  className={classnames(
                    'nft-item pointer',
                    'player-data',
                    isMobile() ? 'wallet-player-coin' : '',
                  )}
                >
                  <div className="nft-image-section">
                    <div className="image-border pc-avatar-container">
                      <ImageComponent
                        loading="lazy"
                        src={
                          playerData?.playerpicturethumb ||
                          playerData?.playerpicture
                        }
                        alt=""
                        className="nft-image"
                      />
                    </div>
                  </div>
                  <div className="nft-name-section pc-name-section">
                    <div className="nft-name">{playerData.name}</div>
                  </div>
                </div>
              ) : null}
              {currenciesData.includes(assetType) ? (
                <section
                  style={{
                    marginBottom: '10px',
                    textAlign: 'unset',
                  }}
                >
                  <div className="dark" style={{ textAlign: 'left' }}>
                    <label
                      style={{
                        textAlign: 'left',
                        color: '#abacb5',
                        fontFamily: 'Rajdhani-semibold',
                        fontSize: '16px',
                      }}
                      className="currency_label"
                    >
                      <b>{t('Select Currency') + ':'}</b>
                    </label>
                    <div className="textinput-wrapper currency-send">
                      <Select
                        value={currencyIndex.toString()}
                        onChange={handleChangeCurrency}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        sx={{
                          color: 'var(--primary-foreground-color)',
                          width: '100%',
                          borderRadius: '4px',
                        }}
                        id="currency-wallet-send"
                      >
                        <MenuItem value={0}>{t('MATIC')}</MenuItem>
                        {payment_options.map((el, ind) => {
                          return (
                            <MenuItem key={ind} value={ind + 1}>
                              {el?.ticker}
                            </MenuItem>
                          )
                        })}
                      </Select>
                    </div>
                  </div>
                </section>
              ) : null}
              <div className="dark m-0">
                {playerData ? (
                  <label style={{ textAlign: 'left', color: '#abacb5' }}>
                    <b>{t('amount')}</b>
                  </label>
                ) : (
                  <label style={{ textAlign: 'left', color: '#abacb5' }}>
                    <b>{`${assetType.toUpperCase()} ` + t('sending') + ':'}</b>
                  </label>
                )}
                <div className="textinput-wrapper">
                  <Input
                    id="matic"
                    name="matic"
                    type="text"
                    placeholder={t('amount')}
                    className=""
                    value={values.matic}
                    maxLength={12}
                    onChange={(event: any) => {
                      handleChange(event)
                      setInputAmount(event.target.value - gasprice)
                    }}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.matic && touched.matic && (
                  <div className="input-feedback">{errors.matic}</div>
                )}
              </div>
              <div className="text-wrapper send-max-coins">
                {assetType === 'playerCoin' ? (
                  <div>{playerData?.name + ' ' + t('coins')}:</div>
                ) : clear ? (
                  ''
                ) : (
                  <div>{t('maximum transferable amount')}:</div>
                )}
                {assetType === 'playerCoin' ? (
                  <div
                    className="coins-available"
                    onClick={() => setFieldValue('matic', playerData.balance)}
                  >
                    {!isNaN(playerData.balance) && playerData.balance !== null
                      ? ' ' + truncateDecimals(playerData.balance, 4)
                      : '0.00'}{' '}
                  </div>
                ) : clear ? (
                  <div
                    className="coins-available"
                    style={{ color: 'red' }}
                    onClick={() => {
                      setClear(false)
                      setMaxTrue(false)
                      values.matic = ''
                    }}
                  >
                    Clear
                  </div>
                ) : (
                  <div
                    className="coins-available"
                    onClick={() => {
                      setClear(true)
                      setFieldValue('matic', availableBalance)
                      setMaxTrue(true)
                    }}
                  >
                    {!isNaN(availableBalance) && availableBalance !== null
                      ? ' ' + parseFloat(availableBalance).toFixed(5)
                      : '0.00'}{' '}
                  </div>
                )}
              </div>
              <div className="dark mt-20">
                <label style={{ textAlign: 'left', color: '#abacb5' }}>
                  <b>{t('enter Receiver Address')}:</b>
                </label>
                <FormInput
                  id="address"
                  type="text"
                  placeholder={t('receiver Address')}
                  value={values.address}
                  name="address"
                  handleChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.address && touched.address && (
                  <div className="input-feedback">{errors.address}</div>
                )}
              </div>
              <div className="space-block mt-20">
                {playerData ? (
                  <>
                    {isTokensInsufficient && (
                      <div className="input-feedback text-center fullwidth mt-40">
                        {t('insufficient Balance to make transaction')}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {isFundsInsufficient && (
                      <div className="input-feedback text-center fullwidth mt-40">
                        {t('insufficient Balance to make transaction')}
                      </div>
                    )}
                  </>
                )}
                {isInvalidEthAddress && (
                  <div className="input-feedback text-center fullwidth mt-40">
                    {t('invalid etherium address')}
                  </div>
                )}
              </div>
              <div className="bottom-button-box">
                {!loginInfo ? (
                  <div className={isMobile() ? 'mb-40' : 'send-divider mb-40'}>
                    {playerData ? (
                      <SubmitButton
                        isDisabled={isTokensInsufficient}
                        title={t('confirm')}
                        className="m-0auto"
                        onPress={handleSubmit}
                      />
                    ) : (
                      <SubmitButton
                        isDisabled={isFundsInsufficient || !(isValid && dirty)}
                        title={t('confirm')}
                        className="m-0auto"
                        onPress={handleSubmit}
                      />
                    )}
                    <div
                      className="form-submit-btn btn-disabled mt-20 m-0auto"
                      onClick={onClose}
                    >
                      {t('cancel')}
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      className={classnames(
                        'mb-40',
                        passphraseLoader ? 'hidden' : '',
                      )}
                    >
                      <SubmitButton
                        isDisabled={!(isValid && dirty) || isTokensInsufficient}
                        title={t('confirm')}
                        className="m-0auto"
                        onPress={handleSubmit}
                      />
                      <div
                        className="form-submit-btn btn-disabled mt-20 m-0auto"
                        onClick={onClose}
                      >
                        {t('cancel')}
                      </div>
                    </div>
                    <div
                      className={classnames(
                        'passphrase-progress-wrapper mt-40',
                        passphraseLoader ? 'show' : 'hidden',
                      )}
                    >
                      <div className="spinner"></div>
                    </div>
                  </>
                )}
              </div>
            </form>
          )
        }}
      </Formik>
    </section>
  )
}

export default SendCurrency
