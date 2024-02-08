import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '@assets/css/components/NftCard.css'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  showSignupForm,
  showKioskItemDetail,
  getKioskOrderDetail,
  getCheckPlayerCoinBal,
  togglePayForItem,
  getKioskItemDetail,
} from '@root/apis/onboarding/authenticationSlice'
import { useDispatch, useSelector } from 'react-redux'
import BidButton from '@components/Button/BidButton'
import classNames from 'classnames'
import { getCircleColor, isMobile } from '@utils/helpers'
import { RootState } from '@root/store/rootReducers'
import PlayerImage from '@components/PlayerImage'
import EditIcon from '@assets/images/edit.webp'
import ImageComponent from '@components/ImageComponent'

interface Props {
  kioskItem?: any
  fullFilled?: boolean | null
  buyItem?: boolean | null
  className?: string
  isAdmin?: boolean
  disableBuy?: boolean
  onEditItem?: any
}

const KioskItem: React.FC<Props> = ({
  kioskItem,
  fullFilled,
  buyItem,
  className = '',
  onEditItem = () => console.log(),
  isAdmin = false,
  disableBuy = false,
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const myPlayerContract = localStorage.getItem('playercontract')
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const { getPlayerDetailsSuccessData, allPlayersData } = playerCoinData
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { selectedThemeRedux, CheckPlayerCoinBal } = authenticationData

  const location = useLocation()
  const [buyBalance, setBuyBalance] = useState(false)

  const handleClick = hash => {
    console.log({ buyItem })
    if (buyItem) {
      dispatch(showKioskItemDetail({ showKioskItemDetailsBuy: true }))
      dispatch(getKioskItemDetail(kioskItem?.itemid))
    } else {
      dispatch(getKioskOrderDetail({ hash, reload: true }))
      dispatch(showKioskItemDetail({ showKioskItemDetails: true }))
    }
  }

  // useEffect(() => {
  //   if (buyItem && (loginInfo || loginId)) {
  //     dispatch(
  //       getCheckPlayerCoinBal(
  //         kioskItem?.playercontract ||
  //           getPlayerDetailsSuccessData?.playercontract ||
  //           myPlayerContract,
  //       ),
  //     )
  //   }
  // }, [buyItem])

  useEffect(() => {
    if (CheckPlayerCoinBal > kioskItem?.itemprice) {
      setBuyBalance(false)
    } else {
      setBuyBalance(true)
    }
  }, [CheckPlayerCoinBal])

  const loginId = localStorage.getItem('loginId')
  const loginInfo = localStorage.getItem('loginInfo')

  const handleBid = (event: any) => {
    if (fullFilled) {
      dispatch(showKioskItemDetail({ showKioskItemDetails: true }))
    }
    if (buyItem) {
      event.stopPropagation()
      if (loginId || loginInfo) {
        // dispatch(
        //   togglePayForItem({
        //     visible: true,
        //     price: kioskItem?.itemprice,
        //     name: kioskItem?.itemname,
        //     kioskItem: true,
        //     kioskItemInfo: {
        //       itemid: kioskItem?.itemid,
        //       playercontract: kioskItem?.playercontract,
        //       playerlevelid: kioskItem?.playerlevelid,
        //       playerpicturethumb: kioskItem?.playerpicturethumb,
        //       name: kioskItem?.name,
        //       ticker: kioskItem?.ticker,
        //     },
        //     deliveryModeRedux: kioskItem?.delivery_mode,
        //   }),
        // )
        dispatch(showKioskItemDetail({ showKioskItemDetailsBuy: true }))
        dispatch(getKioskItemDetail(kioskItem?.itemid))
      } else {
        dispatch(showSignupForm())
      }
    }
  }

  const gotoPlayer = (event: any) => {
    event.stopPropagation()
    const player = kioskItem.detailpageurl
    navigate(`/app/player/${player}`)
  }

  return (
    <div
      className={classNames('nft-card', className)}
      onClick={(event: any) => {
        if (window.location.pathname.includes('/player-dashboard')) {
          if (isAdmin) {
            onEditItem(event, 'open')
            dispatch(getKioskItemDetail(kioskItem?.itemid))
          } else {
            handleClick(kioskItem?.hash)
          }
        } else {
          handleClick(kioskItem?.hash)
        }
      }}
    >
      <div className="nft">
        <div className="nft-image-cover" style={{ position: 'relative' }}>
          {isAdmin ? (
            <div
              className="edit-box"
              onClick={(event: any) => {
                onEditItem(event, 'edit')
                dispatch(getKioskItemDetail(kioskItem?.itemid))
              }}
            >
              <ImageComponent loading="lazy" src={EditIcon} alt="" />
            </div>
          ) : null}
          <ImageComponent
            loading="lazy"
            src={kioskItem?.itempicturethumb}
            alt=""
            className="nft-image"
          />
          {fullFilled ? (
            <div className="kiosk-item-flag-shipped">{t('shipped')}</div>
          ) : buyItem ? (
            <div className="currency_mark_wrapper kiosk-item-flag-buyItem w-none">
              <div
                className="currency_mark_img"
                style={{
                  background: getCircleColor(
                    kioskItem?.playerlevelid ||
                      getPlayerDetailsSuccessData?.playerlevelid,
                  ),
                }}
              >
                <PlayerImage
                  src={
                    isAdmin
                      ? kioskItem?.playerpicturethumb ||
                        allPlayersData[0]?.playerpicturethumb
                      : kioskItem?.playerpicturethumb ||
                        getPlayerDetailsSuccessData?.playerpicturethumb ||
                        getPlayerDetailsSuccessData?.playerpicture ||
                        getPlayerDetailsSuccessData?.img
                  }
                  className="img-radius_kiosk currency_mark"
                />
              </div>
              <div className={isMobile() ? 'item-price-container' : ''}>
                {!isMobile() ? (
                  <>
                    {kioskItem?.itemprice}
                    <span>
                      {' '}
                      {kioskItem?.ticker ||
                        getPlayerDetailsSuccessData?.ticker ||
                        allPlayersData[0]?.ticker}
                    </span>
                  </>
                ) : (
                  <> &nbsp;{kioskItem?.itemprice}</>
                )}
              </div>
            </div>
          ) : (
            <div className="kiosk-item-flag">{t('paid')}</div>
          )}
        </div>
      </div>
      <div className={classNames('second-part', 'kiosk-item-details-wrapper')}>
        <div>
          <div className="kiosk_player_name" onClick={gotoPlayer}>
            {kioskItem?.name ||
              allPlayersData[0]?.name ||
              getPlayerDetailsSuccessData?.name}
          </div>
          <div
            className={classNames(
              'nft-title',
              isMobile() ? '' : 'clamped-text',
            )}
            // style={{ color: '#fff', height: '50px', whiteSpace: 'nowrap' }}
          >
            {kioskItem?.itemname}
          </div>
          {buyItem ? null : (
            // <div
            //       className={classNames(
            //         isMobile()
            //           ? ''
            //           : 'nft-bid-info-header quantity-wrapper mt-10',
            //       )}
            //     >
            //       <div>
            //         {t('available')}: {kioskItem?.actualinventory}
            //       </div>
            //     </div>
            <div
              className={classNames(
                isMobile() ? '' : 'nft-bid-info-header quantity-wrapper mt-10',
              )}
            >
              <div>
                {t('quantity')}:{' '}
                {kioskItem?.quantity || kioskItem?.actualinventory}
              </div>
            </div>
          )}
        </div>
        {!isMobile() &&
          (fullFilled ? (
            <div className={classNames('completed_title')}>
              {t('completed')}
            </div>
          ) : buyItem ? (
            <>
              {/* <BidButton
                isDisabled={false}
                isLoading={false}
                title={t('details')}
                className={classNames('nft-bid-button')}
                onPress={(event: any) => handleBid(event)}
                kiosk={true}
              /> */}
              <div
                className={classNames(
                  isMobile() ? '' : 'available_center_on_items',
                  kioskItem?.actualinventory > 0 ? '' : 'grey-color',
                )}
                style={{ textAlign: 'center' }}
              >
                <div>
                  {t('available')}: {kioskItem?.actualinventory} /{' '}
                  <span style={{ color: 'orange' }}>
                    {kioskItem?.temporders}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <BidButton
              isDisabled={false}
              isLoading={false}
              title={t('fulfill')}
              className={classNames('nft-bid-button')}
              onPress={(event: any) => handleBid(event)}
            />
          ))}
      </div>
    </div>
  )
}

export default KioskItem
