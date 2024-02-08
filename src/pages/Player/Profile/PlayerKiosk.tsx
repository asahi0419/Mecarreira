import React, { useState, useEffect } from 'react'
import { RootState } from '@root/store/rootReducers'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getPlayerKioskData } from '@root/apis/playerCoins/playerCoinsSlice'
import classnames from 'classnames'
import CircleCarousel from '@components/Carousel/CircleCarousel'
import KioskItem from '@components/Card/KioskItem'
import NftSkeletonMobile from '@components/Card/NftSkeletonMobile'
import KioskSkeleton from '@components/Card/KioskSkeleton'
import { isMobile } from '@utils/helpers'

interface Props {
  playerId: any
}

const PlayerKiosk: React.FC<Props> = ({ playerId }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [itemIndex, setItemIndex] = useState(0)
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const { playerKioskData, isLoadingKiosk } = playerCoinData

  useEffect(() => {
    console.log({ playerKioskData, playerId })
    if (playerKioskData.length === 0 && playerId) {
      dispatch(getPlayerKioskData(playerId))
    }
  }, [playerId])

  return (
    <>
      {playerKioskData.length > 0 || isLoadingKiosk ? (
        <section className="profile-kiosk-section">
          <div className="blog-title">{t('players kiosk')}</div>
          <div className="fullwidth flex-center">
            <div
              className={classnames(
                'nft-line-ex mb-30',
                isMobile() ? 'nft-list-grid-mob' : 'nft-list-grid',
              )}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: isMobile() ? 0 : '30px',
              }}
            >
              {playerKioskData?.length > 0 ? (
                <CircleCarousel
                  items={playerKioskData
                    .map((item: any, index: number, items: any) => {
                      return isMobile() ? (
                        (index === items.length - 1 && index % 2 === 0) ||
                        window.innerWidth < 360 ? (
                          <KioskItem
                            kioskItem={item}
                            fullFilled={false}
                            buyItem={true}
                            key={index}
                            className={'kiosk-item-mobile'}
                          />
                        ) : index % 2 === 0 ? (
                          <div className="two-nft-cards">
                            <KioskItem
                              kioskItem={item}
                              fullFilled={false}
                              buyItem={true}
                              key={index}
                              className={'kiosk-item-mobile'}
                            />
                            <KioskItem
                              kioskItem={items[index + 1]}
                              fullFilled={false}
                              buyItem={true}
                              key={index + items.length}
                              className={'kiosk-item-mobile'}
                            />
                          </div>
                        ) : null
                      ) : (
                        <KioskItem
                          kioskItem={item}
                          fullFilled={false}
                          buyItem={true}
                          key={index}
                        />
                      )
                    })
                    .filter(item => item)}
                  activeIndex={itemIndex}
                  setActiveIndex={setItemIndex}
                  isFixedWidth={true}
                />
              ) : (
                <>
                  {new Array(isMobile() ? (window.innerWidth < 360 ? 1 : 2) : 4)
                    .fill(1)
                    .map((_: any, index: number) => {
                      return isMobile() ? (
                        <NftSkeletonMobile key={index} />
                      ) : (
                        <KioskSkeleton key={index} />
                      )
                    })}
                </>
              )}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}

// export default React.memo(PlayerKiosk)
export default PlayerKiosk
