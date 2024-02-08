import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '@assets/css/components/NftCard.css'
import '@assets/css/components/Kiosk.css'
import {
  getCheckPlayerCoinBal,
  postKioskItemTempOrder,
  togglePayForItem,
} from '@root/apis/onboarding/authenticationSlice'
import { useDispatch, useSelector } from 'react-redux'
import BidButton from '@components/Button/BidButton'
import classNames from 'classnames'
import { getCircleColor, isMobile } from '@utils/helpers'
import { RootState } from '@root/store/rootReducers'
import PlayerImage from '@components/PlayerImage'
import { useNavigate } from 'react-router-dom'
import ImageComponent from '@components/ImageComponent'
import AliceCarousel from 'react-alice-carousel'
import leftArrow from '@assets/images/left_angle_bracket.webp'
import rightArrow from '@assets/images/right_angle_bracket.webp'
import 'react-alice-carousel/lib/alice-carousel.css'
import '@assets/css/components/Carousel.css'

const KioskItemDetail: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    KioskItemDetailLoader,
    KioskItemDetail,
    showKioskItemDetailsBuy,
    CheckPlayerCoinBalLoader,
    CheckPlayerCoinBal,
  } = authenticationData
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const { getPlayerDetailsSuccessData, allPlayersData } = playerCoinData
  const [buyBalance, setBuyBalance] = useState(false)

  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')

  const handleBid = () => {
    if (showKioskItemDetailsBuy) {
      dispatch(postKioskItemTempOrder({ itemId: KioskItemDetail?.itemId }))
      dispatch(
        togglePayForItem({
          visible: true,
          price: KioskItemDetail?.itemPrice,
          name: KioskItemDetail?.itemName,
          kioskItem: true,
          kioskItemInfo: {
            itemid: KioskItemDetail?.itemId,
            playercontract: KioskItemDetail?.playerContract,
            playercontractabi: KioskItemDetail?.playerContractAbi,
            playerlevelid: KioskItemDetail?.playerLevelId,
            playerpicturethumb: KioskItemDetail?.playerPictureThumb,
            name: KioskItemDetail?.name,
            ticker: KioskItemDetail?.ticker,
            buyerInstructions: KioskItemDetail?.buyerInstructions,
          },
          deliveryModeRedux: KioskItemDetail?.delivery_mode,
        }),
      )
    }
  }
  useEffect(() => {
    if (KioskItemDetail?.playerContract && (loginInfo || loginId)) {
      dispatch(getCheckPlayerCoinBal(KioskItemDetail?.playerContract))
    }
  }, [KioskItemDetail?.playerContract])

  useEffect(() => {
    if (CheckPlayerCoinBal > KioskItemDetail?.itemPrice) {
      setBuyBalance(false)
    } else {
      setBuyBalance(true)
    }
  }, [CheckPlayerCoinBal, KioskItemDetail])

  const gotoPlayer = (event: any) => {
    event.stopPropagation()
    const player = KioskItemDetail.detailpageurl
    navigate(`/app/player/${player}`)
  }
  const responsiveItemDefault = {
    0: {
      items: 1,
    },
  }

  const [items, setItems] = useState([])
  const minLength = 1
  const [hovered, setHovered] = useState(false)
  useEffect(() => {
    if (KioskItemDetail?.additionalImages?.length > 0) {
      setItems(
        KioskItemDetail?.additionalImages.map((image, index) => (
          <img
            src={image}
            alt={`Selected ${index + 1}`}
            style={{
              width: '100%',
              height: '400px',
              objectFit: 'cover',
              borderRadius: isMobile() ? '0px' : '20px 20px 0px 0px',
            }}
          />
        )),
      )
    }
  }, [KioskItemDetail?.additionalImages])

  return (
    <div
      className={classNames(
        'main_kiosk_wrapper_Buy',
        isMobile() ? 'kiosk-main-mobile' : '',
      )}
    >
      <div className="kiosk-scroll-wrapper">
        {KioskItemDetailLoader ? (
          <div
            className="loading-spinner"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: 'auto',
              height: '100%',
            }}
          >
            <div className="spinner">
              <div className="spinner"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="nft">
              <div className="nft-image-cover" style={{ position: 'relative' }}>
                {/* <ImageComponent
                  loading="lazy"
                  src={KioskItemDetail?.itemPicture}
                  alt=""
                  className="nft-image"
                  style={{
                    borderTopLeftRadius: isMobile() ? '' : '20px',
                    borderTopRightRadius: isMobile() ? '' : '20px',
                    height: isMobile() ? '100vw' : '400px',
                  }}
                /> */}
                {KioskItemDetail?.additionalImages?.length > 0 && (
                  <div
                    className={classNames(
                      'circle-carousel kiosk',
                      items.length <= 3 ? 'center-carousel' : 'carousel',
                    )}
                    onMouseOver={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                  >
                    <AliceCarousel
                      infinite={items.length > minLength}
                      mouseTracking
                      items={items}
                      disableButtonsControls={false}
                      keyboardNavigation={true}
                      responsive={responsiveItemDefault}
                      // autoPlayInterval={5000}
                      // infinite
                      // autoPlay={items.length > minLength}
                      // activeIndex={activeIndex}
                      renderPrevButton={() => {
                        return items.length > minLength &&
                          (isMobile() || hovered) ? (
                          <div style={{ opacity: 0.6, transition: '0.5s' }}>
                            <ImageComponent
                              src={leftArrow}
                              alt=""
                              className="img-radius carousel-arrow"
                              style={{ margin: '2px 5px 2px 0' }}
                            />
                          </div>
                        ) : (
                          <div style={{ opacity: 0, transition: '0.5s' }}>
                            <ImageComponent
                              src={leftArrow}
                              alt=""
                              className="img-radius carousel-arrow"
                              style={{ margin: '2px 5px 2px 0' }}
                            />
                          </div>
                        )
                      }}
                      renderNextButton={() => {
                        return items.length > minLength &&
                          (isMobile() || hovered) ? (
                          <div style={{ opacity: 0.6, transition: '0.5s' }}>
                            <ImageComponent
                              src={rightArrow}
                              alt=""
                              className="img-radius carousel-arrow"
                              style={{ margin: '2px 3px 2px 2px' }}
                            />
                          </div>
                        ) : (
                          <div style={{ opacity: 0, transition: '0.5s' }}>
                            <ImageComponent
                              src={rightArrow}
                              alt=""
                              className="img-radius carousel-arrow"
                              style={{ margin: '2px 3px 2px 2px' }}
                            />
                          </div>
                        )
                      }}
                      // onSlideChanged={handleSlideChange}
                    />
                  </div>
                )}

                <div className="currency_mark_wrapper kiosk-item-flag-buyItem w-none mb-5">
                  <div
                    className="currency_mark_img"
                    style={{
                      background: getCircleColor(
                        KioskItemDetail?.playerLevelId ||
                          getPlayerDetailsSuccessData?.playerlevelid,
                      ),
                    }}
                  >
                    <PlayerImage
                      src={
                        KioskItemDetail?.playerPictureThumb ||
                        getPlayerDetailsSuccessData?.playerpicturethumb ||
                        getPlayerDetailsSuccessData?.playerpicture ||
                        getPlayerDetailsSuccessData?.img
                      }
                      className="img-radius_kiosk currency_mark"
                    />
                  </div>
                  <div>
                    {KioskItemDetail?.itemPrice}
                    <span>
                      {' '}
                      {KioskItemDetail?.ticker ||
                        getPlayerDetailsSuccessData?.ticker ||
                        allPlayersData[0]?.ticker}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="createnft-input-container"
              style={{
                padding: isMobile() ? '20px 30px 30px' : '30px',
              }}
            >
              <div className="kiosk_player_name" onClick={gotoPlayer}>
                {KioskItemDetail?.name ||
                  allPlayersData[0]?.name ||
                  getPlayerDetailsSuccessData?.name}
              </div>
              <div className={classNames('kiosk_name_wrapper mb-0')}>
                <h2 className="nft-title mb-10">{KioskItemDetail?.itemName}</h2>
              </div>
              <div className={classNames('item-description buy_item_desc')}>
                {KioskItemDetail?.itemDescription}
              </div>
              <div
                className={classNames('textinput-wrapper')}
                style={{
                  width: 'unset',
                  height: '100px',
                  overflowY: 'auto',
                  padding: '10px 0px 10px 10px',
                  justifyContent: 'flex-start',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                <div className={classNames('item-description buy_item_desc')}>
                  {KioskItemDetail?.additionalDescription}
                </div>
              </div>
              <div
                className={classNames(
                  'player_reward_percentage_wrapper kiosk-item-available',
                  KioskItemDetail?.itemAvailable > 0 ? '' : 'grey-color',
                )}
              >
                <div className="input-label">{t('available')}</div>
                <div className="percentage_value_wrapper">
                  <p className="">{KioskItemDetail?.itemAvailable}</p> /{' '}
                  <span style={{ color: 'orange' }}>
                    {KioskItemDetail?.temporders !== undefined
                      ? KioskItemDetail?.temporders
                      : 0}
                  </span>
                </div>
              </div>
              <BidButton
                isDisabled={buyBalance || KioskItemDetail?.itemAvailable < 1}
                isLoading={CheckPlayerCoinBalLoader}
                title={t('buy')}
                className={classNames(
                  'createnft-createbtn margin_fix_btn caps',
                )}
                onPress={() => handleBid()}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default KioskItemDetail
