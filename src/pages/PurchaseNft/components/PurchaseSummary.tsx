import React, { useState, useEffect } from 'react'
import { ItemProps } from '@root/types'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { useTranslation } from 'react-i18next'
import { getFlooredAnyFixed, getFlooredFixed, isMobile } from '@utils/helpers'
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
interface Props {
  estimatedValue: string
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
  toFixed?: boolean
}

export const PriceItem: React.FC<ItemProps> = props => {
  const {
    label,
    value,
    isLoading,
    valueLeftIcon = null,
    valueRightIcon = null,
    isPercentage,
    customClass,
    priceImpactStyle,
    bold,
    toFixed = false,
  } = props

  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const { selectedThemeRedux } = authenticationData
  return (
    <li className="pricing-list-item">
      <div
        className="ms-2 me-auto"
        style={bold ? { fontSize: '20px', fontWeight: 'bolder' } : {}}
      >
        {label}
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
          {toFixed ? value : parseFloat(value).toLocaleString() || '0.00'}
          {isPercentage ? '%' : ''}
        </span>
        {valueRightIcon ? (
          <TooltipLabel title={valueRightIcon === maticIcon ? 'MATIC' : 'USD'}>
            {/* <ImageComponent
              src={valueRightIcon}
              className="currency-icon"
              alt=""
            /> */}
            <img src={valueRightIcon} alt="" className="currency-icon" />
          </TooltipLabel>
        ) : null}
      </div>
    </li>
  )
}

let intervalId: any = null
const PurchaseSummary: React.FC<Props> = props => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const {
    estimatedValue,
    totalValue,
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

  const { loadingBuy, selectedThemeRedux, showGenesisRequired } =
    authenticationData
  const { earlyAccessNfts, isEarlyAccessNftSuccess, earlyAccessPeriod } =
    useSelector((state: RootState) => state.playercoins)

  const playerStatsData = useSelector((state: RootState) => state.playerstats)
  const { isProgress } = playerStatsData

  const getUsdPriceBase = () => {
    const baseTotal: any = parseFloat(estimatedValue) * usdRate

    // estimatedValue is the value against "matic" key received from API
    // usdRate is the value against "rate" key received in API response

    const absTotal: any = getFlooredFixed(parseFloat(baseTotal), 3)

    return absTotal
  }

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

  const getUsdTotal = () => {
    const usdTotal: any = parseFloat(totalValue) * usdRate
    const absTotal: any = getFlooredFixed(parseFloat(usdTotal), 3) //truncateDecimals(usdTotal, 3)
    // usdTotalCallback(absTotal)
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
    day: '0',
    hours: '0',
    minutes: '0',
    seconds: '0',
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
          day: '0',
          hours: '0',
          minutes: '0',
          seconds: '0',
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
    // console.log({ isChecked })
  }
  useEffect(() => {
    if (earlyNftAccepted) {
      dispatch(getUserEarlyAccessNft())
    }
  }, [earlyNftAccepted])

  useEffect(() => {
    if (showEarlyAccessNft && earlyAccessNfts.length > 0) {
      // console.log('showEarlyAccessNft')
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
      <ol className="pricing-list-group">
        {/* <React.Fragment>
          <PriceItem
            valueLeftIcon={
              selectedThemeRedux === 'Light' ? approxIconBlack : approxIcon
            }
            valueRightIcon={maticIcon}
            label={t('estimated price per coin')}
            value={parseFloat(estimatedValue).toFixed(5)}
            isLoading={(loadingBuy || inProgress) && !stopCalculating}
          />
          <div className="divide pricing-list-divider"></div>
        </React.Fragment> */}
        <React.Fragment>
          <PriceItem
            label={t('estimated price per coin in usd')}
            value={getUsdPriceBase()}
            valueLeftIcon={
              selectedThemeRedux === 'Light' ? approxIconBlack : approxIcon
            }
            valueRightIcon={
              selectedThemeRedux === 'Gold'
                ? dollarIconGold
                : selectedThemeRedux === 'Ladies'
                ? dollarIconLadies
                : dollarIcon
            }
            isLoading={isProgress && !stopCalculating}
          />
          <div className="divide pricing-list-divider"></div>
        </React.Fragment>
        {/* <React.Fragment>
          <PriceItem
            label={t('total estimated')}
            valueLeftIcon={
              selectedThemeRedux === 'Light' ? approxIconBlack : approxIcon
            }
            valueRightIcon={maticIcon}
            value={totalValue}
            isLoading={(loadingBuy || inProgress) && !stopCalculating}
          />
          <div className="divide pricing-list-divider"></div>
        </React.Fragment> */}
        <React.Fragment>
          <PriceItem
            label={t('total estimated in USD')}
            valueLeftIcon={
              selectedThemeRedux === 'Light' ? approxIconBlack : approxIcon
            }
            valueRightIcon={
              selectedThemeRedux === 'Gold'
                ? dollarIconGold
                : selectedThemeRedux === 'Ladies'
                ? dollarIconLadies
                : dollarIcon
            }
            value={getUsdTotal()}
            isLoading={isProgress && !stopCalculating}
          />
          <div className="divide pricing-list-divider"></div>
        </React.Fragment>
        <React.Fragment>
          <PriceItem
            label={t('price impact of trade')}
            // valueLeftIcon={
            //   selectedThemeRedux === 'Light' ? approxIconBlack : approxIcon
            // }
            value={priceImpact}
            isLoading={isProgress && !stopCalculating}
            isPercentage
            customClass="profit"
            priceImpactStyle={priceImpactStyle}
          />
          <div className="divide pricing-list-divider"></div>
        </React.Fragment>
        {isSelling && priceImpact < -9.99 && parseFloat(maxCoins) > 0 ? (
          <div className="input-feedback purchase-error price-impact">
            <ImageComponent loading="lazy" src={CautionIcon} alt="caution" />
            {t('high negative impact')}
          </div>
        ) : null}
        {isSelling ||
        showEarlyAccessNft ||
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
        {(!isSelling && showEarlyAccessNft) ||
        (!isSelling && earlyNftAccepted) ? (
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
            <div
              className={classNames(
                `purchase-counter-container`,
                isSelling ? 'mt-60' : '',
              )}
            >
              <span>{t('next price evaluation')}</span>
              <div className="timer-sec">{timeLeft}s</div>
            </div>
          </React.Fragment>
        ) : (
          <div style={{ height: isEarlyAccess ? 0 : '84.44px' }}></div>
        )}
      </ol>
    </div>
  )
}

export default React.memo(PurchaseSummary)
