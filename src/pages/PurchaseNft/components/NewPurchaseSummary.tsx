import React, { useState, useEffect } from 'react'
import { ItemProps } from '@root/types'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { useTranslation } from 'react-i18next'
import {
  getFlooredAnyFixed,
  getFlooredFixed,
  getRoundedFixed,
  isMobile,
} from '@utils/helpers'
import approxIcon from '@assets/images/approximation.webp'
import dollarIcon from '@assets/images/dollar_mecarreira.webp'
import dollarIconGold from '@assets/images/dollar_mecarreiraGold.webp'
import dollarIconLadies from '@assets/images/dollar_mecarreiraLadies.webp'
import maticIcon from '@assets/images/matic-token-icon.webp'
import TooltipLabel from '@components/TooltipLabel'
import approxIconBlack from '@assets/images/approximation_black.webp'
import ImageComponent from '@components/ImageComponent'
import CautionIcon from '@assets/icons/icon/caution.svg'
import InfoIcon from '../../../assets/icons/icon/infoIcon.svg'
import CircleCarousel from '@components/Carousel/CircleCarousel'
import DummyNftImage from '@assets/images/dummyNft.webp'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import CloseIcon from '../../../assets/icons/icon/closeIcon.svg'
import ArrowDown from '@components/Svg/ArrowDown'
import ArrowUp from '@components/Svg/ArrowUp'
import { BLOCK_TIME, THEME_COLORS } from '@root/constants'
import { useNavigate } from 'react-router-dom'
import FormCheckbox from '@components/Form/FormCheckbox'
import { getUserEarlyAccessNft } from '@root/apis/playerCoins/playerCoinsSlice'
import classnames from 'classnames'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

interface Props {
  estimatedValue: string
  coinIssued?: string
  totalValue: string
  inProgress?: boolean
  usdRate: any
  containerClass?: string
  valueLeftIcon?: any
  initCallback?: any
  stopCalculating: boolean
  usdTotalCallback?: any
  priceImpact?: any
  isPercentage?: boolean
  customClass?: string
  priceImpactStyle?: string
  isSelling?: boolean
  isEarlyAccess?: boolean
  maxCoins?: string
  activeIndex?: number
  setActiveIndex?: any
  handleClosePopup?: any
  showEarlyAccessNft?: boolean
  blockDiff?: number
  setTokenId?: any
  setEarlyCheckBox?: any
  isLoadingEarlyAccessNft?: boolean
}

export const PriceItem: React.FC<ItemProps> = props => {
  const {
    label,
    value,
    isLoading,
    valueLeftIcon = null,
    isPercentage,
    customClass,
    priceImpactStyle,
    bold,
    isPayout,
    currency,
    setCurrency,
  } = props

  return (
    <li
      className={classnames(
        'pricing-list-item',
        customClass,
        isPayout ? 'payout-list-item' : '',
      )}
    >
      <div
        className="ms-2 me-auto"
        style={bold ? { fontSize: '20px', fontWeight: 'bolder' } : {}}
      >
        {label}
        {isPayout ? (
          <Select
            className="payout-currency-select"
            value={currency}
            onChange={evt => setCurrency(evt.target.value)}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value={'USD'}>
              <div className="currency-item-symbol">USD</div>
            </MenuItem>
            <MenuItem value={'EUR'}>
              <div className="currency-item-symbol">EUR</div>
            </MenuItem>
            <MenuItem value={'MATIC'}>
              <div className="currency-item-symbol">MATIC</div>
            </MenuItem>
          </Select>
        ) : null}
      </div>
      <div
        className={classNames('spinner size-small', isLoading ? '' : 'hidden')}
      ></div>
      <div className={classNames('value-container', isLoading ? 'hidden' : '')}>
        {valueLeftIcon ? <ImageComponent src={valueLeftIcon} alt="" /> : null}
        <span
          className={classNames(
            'pricing-value-text',
            isLoading ? 'hidden' : '',
            isPercentage ? priceImpactStyle : '',
          )}
          style={bold ? { fontSize: '20px', fontWeight: 'bolder' } : {}}
        >
          {parseFloat(value).toLocaleString() || '0.00'}
          {isPercentage ? '%' : ''}
        </span>
      </div>
    </li>
  )
}

let intervalId: any = null
const NewPurchaseSummary: React.FC<Props> = props => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const {
    estimatedValue,
    totalValue,
    coinIssued,
    inProgress,
    usdRate,
    containerClass = '',
    initCallback = null,
    stopCalculating,
    usdTotalCallback,
    priceImpact,
    maxCoins,
    priceImpactStyle,
    isSelling = false,
    activeIndex,
    setActiveIndex,
    handleClosePopup,
    showEarlyAccessNft,
    blockDiff = 0,
    setTokenId,
    setEarlyCheckBox,
    isLoadingEarlyAccessNft = false,
  } = props
  const dispatch = useDispatch()
  const [timeLeft, setTimeLeft] = useState<number>(30)
  const [countDownTime, setCountDownTime] = useState<number>(0)
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const { isEULocale, euroRate, selectedThemeRedux, showGenesisRequired } =
    authenticationData
  const { earlyAccessNfts } = useSelector(
    (state: RootState) => state.playercoins,
  )

  const [currencySymbol, setCurrencySymbol] = useState(
    isEULocale ? 'EUR' : 'USD',
  )

  const playerStatsData = useSelector((state: RootState) => state.playerstats)
  const { isProgress, fetchSinglePlayerStatsBuy } = playerStatsData

  useEffect(() => {
    setTimeLeft(30)
  }, [estimatedValue])

  useEffect(() => {
    if (timeLeft === 0) {
      setTimeLeft(0)
      if (initCallback) {
        initCallback('timeup')
        setTimeLeft(30)
      }
    }

    if (!timeLeft) return

    intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [timeLeft])

  useEffect(() => {
    if (stopCalculating) {
      clearInterval(intervalId)
    } else {
      initCallback('timeup')
      setTimeLeft(30)
    }
  }, [stopCalculating])

  const getOwnership = () => {
    const balanceCoins: any =
      parseFloat(totalValue) / parseFloat(estimatedValue) + parseFloat(maxCoins)
    const totalCoins: any =
      parseFloat(totalValue) / parseFloat(estimatedValue) +
      parseFloat(coinIssued)
    return getFlooredFixed((balanceCoins / totalCoins) * 100, 3)
  }

  const getPayoutAmount = () => {
    let baseTotal: any = parseFloat(totalValue)

    if (currencySymbol !== 'MATIC') {
      baseTotal = baseTotal * usdRate
      if (currencySymbol === 'EUR') {
        baseTotal = baseTotal * euroRate
      }
    }

    const absTotal: any = getFlooredFixed(parseFloat(baseTotal), 2)

    return absTotal
  }

  const getSellPercentage = () => {
    const baseTotal: any = parseFloat(totalValue) / parseFloat(estimatedValue)
    const absTotal: any = getRoundedFixed(
      (baseTotal / parseFloat(maxCoins)) * 100,
      2,
    )
    return absTotal
  }

  useEffect(() => {
    if (blockDiff && blockDiff > 0) {
      setCountDownTime(new Date().getTime() + blockDiff * BLOCK_TIME)
    }
  }, [blockDiff])

  useEffect(() => {
    if (countDownTime > 0) {
      initCountDown()
    }
  }, [countDownTime])

  let countDown: any = null
  const [state, setState] = useState({
    day: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [endable, setEndable] = useState(false)

  const updateState = (data: any) => {
    setState(state => ({ ...state, ...data }))
  }

  const initCountDown = () => {
    clearInterval(countDown)
    countDown = setInterval(function () {
      const countDownDate = new Date(countDownTime).getTime()
      const now = new Date().getTime()
      const distance = countDownDate < now ? 0 : countDownDate - now
      if (distance < 0) {
        setEndable(true)
      }
      const day = ~~(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      )
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)
      if (distance < 0) {
        clearInterval(countDown)
        updateState({
          day: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        })
      } else {
        updateState({
          day,
          hours,
          minutes,
          seconds,
        })
      }
    }, 1000)
  }

  const [nftIndex, setNftIndex] = useState(-1)
  const [isEarlyAccess, setIsEarlyAccess] = useState(false)

  const [infoPop, setInfoPop] = useState(false)

  const handleClosePop = () => {
    setInfoPop(false)
  }
  // Prevent modal from closing when clicking outside
  const preventCloseOnClickOutside = event => {
    event.stopPropagation()
  }
  const handleGetEarlyAccess = async () => {
    if (!isMobile()) {
      await handleClosePopup()
    }
    navigate('/app/get-early-access')
  }

  const handleNftClick = (tokenId, index) => {
    setNftIndex(index)
    setTokenId(tokenId)
  }
  const [earlyNftAccepted, setEarlyNftAccepted] = useState(false)
  const handleEarlyAccessNft = (isChecked: boolean) => {
    setEarlyNftAccepted(isChecked)
    setEarlyCheckBox(isChecked)
  }
  useEffect(() => {
    if (earlyNftAccepted) {
      dispatch(getUserEarlyAccessNft())
    }
  }, [earlyNftAccepted])

  useEffect(() => {
    if (showEarlyAccessNft && earlyAccessNfts.length > 0) {
      setIsEarlyAccess(true)
    }
  }, [showEarlyAccessNft, earlyAccessNfts])

  return (
    <div className={classNames('pricing-summary-wrapper m-0', containerClass)}>
      {infoPop ? (
        <Modal
          open={infoPop}
          onClose={handleClosePop}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          BackdropProps={{ onClick: preventCloseOnClickOutside }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: isMobile() ? '90%' : '350px',
              bgcolor: THEME_COLORS[selectedThemeRedux]['PrimaryBackground'],
              border: 'none',
              outline: 'none',
              p: 4,
              borderRadius: '20px',
            }}
          >
            <ImageComponent
              onClick={handleClosePop}
              className="close_icon"
              src={CloseIcon}
              alt=""
            />
            <p
              style={{
                fontFamily: 'Rajdhani-regular',
                fontWeight: '400',
                fontSize: '20px',
              }}
            >
              Text in a modal
            </p>
            <p
              style={{
                fontFamily: 'Rajdhani-regular',
                fontWeight: '400',
              }}
            >
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </p>
          </Box>
        </Modal>
      ) : null}
      {isSelling ? (
        <ol className="pricing-list-group">
          <React.Fragment>
            <PriceItem
              label={t('payout in ')}
              value={getPayoutAmount()}
              isLoading={isProgress && !stopCalculating}
              isPayout
              currency={currencySymbol}
              setCurrency={setCurrencySymbol}
            />
            <div className="divide pricing-list-divider"></div>
          </React.Fragment>
          <React.Fragment>
            <PriceItem
              label={t('percent you sell')}
              value={getSellPercentage()}
              isLoading={isProgress && !stopCalculating}
              isPercentage
            />
            <div className="divide pricing-list-divider"></div>
          </React.Fragment>
          <React.Fragment>
            <PriceItem
              label={t('your trade decreases price by')}
              value={priceImpact}
              isLoading={isProgress && !stopCalculating}
              isPercentage
              priceImpactStyle={priceImpactStyle}
            />
            <div className="divide pricing-list-divider"></div>
          </React.Fragment>
          {priceImpact < -9.99 && parseFloat(maxCoins) > 0 ? (
            <div className="input-feedback purchase-error price-impact">
              <ImageComponent loading="lazy" src={CautionIcon} alt="caution" />
              {t('high negative impact')}
            </div>
          ) : null}
          {!stopCalculating ? (
            <React.Fragment>
              <div className="purchase-counter-container">
                <span>{t('next price evaluation')}</span>
                <div className="timer-sec">{timeLeft}s</div>
              </div>
            </React.Fragment>
          ) : (
            <div style={{ height: '84.44px' }}></div>
          )}
        </ol>
      ) : (
        <ol className="pricing-list-group">
          <React.Fragment>
            <PriceItem
              label={t('estimated tokens you buy')}
              value={getFlooredFixed(
                parseFloat(totalValue) / parseFloat(estimatedValue),
                4,
              )}
              isLoading={isProgress && !stopCalculating}
            />
            <div className="divide pricing-list-divider"></div>
          </React.Fragment>
          <React.Fragment>
            <PriceItem
              label={t('ownership of fanclub after trade')}
              value={getOwnership()}
              isLoading={isProgress && !stopCalculating}
              isPercentage
            />
            <div className="divide pricing-list-divider"></div>
          </React.Fragment>
          <React.Fragment>
            <PriceItem
              label={t('your trade increases price by')}
              value={priceImpact}
              isLoading={isProgress && !stopCalculating}
              isPercentage
              customClass="profit"
              priceImpactStyle={priceImpactStyle}
            />
            <div className="divide pricing-list-divider"></div>
          </React.Fragment>
          {showEarlyAccessNft ||
          isLoadingEarlyAccessNft ||
          showGenesisRequired === false ? null : (
            <div className="checkbox_genesis">
              <div className="terms-conditions-check">
                <FormCheckbox
                  onChange={handleEarlyAccessNft}
                  defaultChecked={earlyNftAccepted ? true : false}
                />
              </div>
              <label className="h-5 mt-5" style={{ marginLeft: '-10px' }}>
                <b>{t('add_genesis_nft')}</b>
              </label>
            </div>
          )}
          {showEarlyAccessNft || earlyNftAccepted ? (
            <div
              className={classNames(
                'purchase-submit-wrapper',
                'early-access-container',
              )}
            >
              <div className="accordion">
                <div className="item">
                  <div
                    className="title"
                    onClick={() => setIsEarlyAccess(!isEarlyAccess)}
                  >
                    <div className="early-access-title">
                      {t('genesis NFT Required')}
                    </div>
                    <div
                      className="early-access-info-icon"
                      onClick={() => setInfoPop(true)}
                    >
                      <ImageComponent src={InfoIcon} alt="" />
                    </div>
                    <div className="early-access-desc">
                      {t('Select which NFT you want to use')}
                    </div>
                    {isEarlyAccess ? <ArrowUp /> : <ArrowDown />}
                  </div>
                  <div className={isEarlyAccess ? 'content show' : 'content'}>
                    {earlyAccessNfts.length > 0 ? (
                      <div className="early-access-nft-carousel">
                        <div
                          className={classNames('nft-line-ex', 'nft-list-grid')}
                        >
                          <CircleCarousel
                            items={earlyAccessNfts
                              .map((item: any, index: number, items: any) => (
                                <div
                                  className={classNames(
                                    'nft-card',
                                    nftIndex === index ? 'green-border' : '',
                                  )}
                                  onClick={() =>
                                    handleNftClick(item?.tokenid, index)
                                  }
                                >
                                  <div className="nft">
                                    <div className="nft-image-cover">
                                      {item?.artwork_thumb ? (
                                        <ImageComponent
                                          loading="lazy"
                                          src={item?.artwork_thumb}
                                          alt=""
                                          className="nft-image"
                                        />
                                      ) : (
                                        <ImageComponent
                                          loading="lazy"
                                          src={DummyNftImage}
                                          alt=""
                                          className="nft-image"
                                        />
                                      )}
                                    </div>
                                    <div
                                      className="nft-unlocks"
                                      style={{
                                        fontSize: item?.isperpetual
                                          ? '22px'
                                          : 'unset',
                                      }}
                                    >
                                      {item?.isperpetual
                                        ? '∞'
                                        : item?.remainingunlocks}
                                    </div>
                                  </div>
                                </div>
                              ))
                              .filter(item => item)}
                            activeIndex={activeIndex}
                            setActiveIndex={setActiveIndex}
                            isEarlyAccess={isEarlyAccess}
                            minCardLength={3}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="early-access-desc-bg">
                          {t('you do not own any Early Access NFTs')}
                        </div>
                        <div
                          className={classNames(`purchase-btn`)}
                          onClick={handleGetEarlyAccess}
                        >
                          {t('GET ACCESS')}
                        </div>
                      </>
                    )}
                    {state.day > 0 ||
                    state.hours > 0 ||
                    state.minutes > 0 ||
                    state.seconds > 0 ? (
                      <div className="early-access-desc">
                        {t('early Access ends in ')}
                        {state.day}d {state.hours}h {state.minutes}m{' '}
                        {state.seconds}s
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ) : isLoadingEarlyAccessNft ? (
            <div className="spinner m-auto mt-20" />
          ) : null}
          {!stopCalculating ? (
            <React.Fragment>
              <div className={classNames(`purchase-counter-container`)}>
                <span>{t('next price evaluation')}</span>
                <div className="timer-sec">{timeLeft}s</div>
              </div>
            </React.Fragment>
          ) : (
            <div style={{ height: isEarlyAccess ? 0 : '84.44px' }}></div>
          )}
        </ol>
      )}
    </div>
  )
}

export default React.memo(NewPurchaseSummary)
