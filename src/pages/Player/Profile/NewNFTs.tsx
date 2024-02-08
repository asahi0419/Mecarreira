import React, { useState } from 'react'

import { useTranslation } from 'react-i18next'
import CircleCarousel from '@components/Carousel/CircleCarousel'
import { isMobile } from '@utils/helpers'
import NftCardMobile from '@components/Card/NftCardMobile'
import NftCard from '@components/Card/NftCard'
import classnames from 'classnames'

interface Props {
  items?: any
}

const NewNFTs: React.FC<Props> = ({ items }) => {
  const { t } = useTranslation()
  const [itemIndex, setItemIndex] = useState(0)

  return (
    <>
      {items.length > 0 ? (
        <section className="profile-nft-section">
          <div className="blog-title">{t('my NFTs')}</div>
          <div className="fullwidth flex-center">
            <div
              className={classnames(
                'nft-line-ex mb-30',
                isMobile() ? 'nft-list-grid-mob' : 'nft-list-grid',
              )}
            >
              <CircleCarousel
                items={items
                  .map((item: any, index: number, items: any) => {
                    return isMobile() ? (
                      (index === items.length - 1 && index % 2 === 0) ||
                      window.innerWidth < 360 ? (
                        <NftCardMobile
                          nft={item}
                          key={index}
                          isNavigate={true}
                        />
                      ) : index % 2 === 0 ? (
                        <div className="two-nft-cards">
                          <NftCardMobile
                            nft={item}
                            key={index}
                            isNavigate={true}
                          />
                          <NftCardMobile
                            nft={items[index + 1]}
                            key={index + items.length}
                            isNavigate={true}
                          />
                        </div>
                      ) : null
                    ) : (
                      <NftCard nft={item} key={index} isNavigate={true} />
                    )
                  })
                  .filter(item => item)}
                activeIndex={itemIndex}
                setActiveIndex={setItemIndex}
              />
            </div>
          </div>
        </section>
      ) : (
        ''
      )}
    </>
  )
}
export default NewNFTs
