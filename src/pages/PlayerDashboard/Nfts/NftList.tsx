import { useEffect, useState } from 'react'
import NftCard from '../../../components/Card/NftCard'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { isMobile } from '@utils/helpers'
import { getMyCoinNftsData } from '@root/apis/playerCoins/playerCoinsSlice'
import { NFT_STATUS } from '@root/constants'
import NftCardMobile from '@components/Card/NftCardMobile'

const NftList = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const {
    player1contract,
    mycoinNftsData,
    isLoadingNfts,
    isGetMyCoinNftsDataSuccess,
  } = playerCoinData

  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const { selectedThemeRedux } = authenticationData

  useEffect(() => {
    if (player1contract) {
      dispatch(getMyCoinNftsData(player1contract))
    }
  }, [player1contract])

  const [finishedList, setFinishedList] = useState<any>([])
  const [ongoingList, setOngoingList] = useState<any>([])
  const [upcomingList, setUpcomingList] = useState<any>([])
  const [launchedList, setLaunchedList] = useState<any>([])

  useEffect(() => {
    if (isGetMyCoinNftsDataSuccess) {
      setFinishedList(
        mycoinNftsData.filter((nft: any) => {
          const countDownDate = new Date(nft?.blockdeadline).getTime()
          const now = new Date().getTime()
          const distance = countDownDate < now ? 0 : countDownDate - now
          const hours = Math.floor(distance / (1000 * 60 * 60))
          return (
            hours <= 6 &&
            (nft.statusid === NFT_STATUS.AUCTION ||
              nft.statusid === NFT_STATUS.RAFFLE)
          )
        }),
      )
      setOngoingList(
        mycoinNftsData.filter((nft: any) => {
          const countDownDate = new Date(nft?.blockdeadline).getTime()
          const now = new Date().getTime()
          const distance = countDownDate < now ? 0 : countDownDate - now
          const hours = Math.floor(distance / (1000 * 60 * 60))
          return (
            hours > 6 &&
            (nft.statusid === NFT_STATUS.AUCTION ||
              nft.statusid === NFT_STATUS.RAFFLE)
          )
        }),
      )
      setUpcomingList(
        mycoinNftsData.filter((nft: any) => {
          return nft.statusid === NFT_STATUS.PUBLIC
        }),
      )
      setLaunchedList(
        mycoinNftsData.filter((nft: any) => {
          return nft.statusid === NFT_STATUS.MINTED
        }),
      )
    }
  }, [isGetMyCoinNftsDataSuccess])

  return (
    <>
      {isLoadingNfts ? (
        <div className="loading-spinner-container mb-40 mt-40 show">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
      ) : (
        <>
          {finishedList?.length > 0 ? (
            <div>
              <div className="nft-tab-title mt-30 mb-30">
                {t('finished Auctions & Raffles')}
              </div>
              <div
                className={classNames(
                  'nft-line-ex',
                  isMobile() ? 'nft-list-grid-mob' : 'nft-list-grid',
                )}
              >
                <div
                  className={classNames(
                    'nft-column pt-0',
                    finishedList.length === 1 ? 'no-gap one-grid' : '',
                    finishedList.length === 2 ? 'two-grid' : '',
                  )}
                >
                  {finishedList.map((item: any, index: any) =>
                    isMobile() ? (
                      <NftCardMobile
                        nft={item}
                        key={index}
                        isNavigate={true}
                        isEndable={true}
                      />
                    ) : (
                      <NftCard
                        nft={item}
                        isNavigate={true}
                        key={index}
                        isEndable={true}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-40"></div>
          )}
          {ongoingList?.length > 0 ? (
            <div>
              <div className="nft-tab-title mt-30 mb-30">
                {t('ongoing Auctions & Raffles')}
              </div>
              <div
                className={classNames(
                  'nft-line-ex',
                  isMobile() ? 'nft-list-grid-mob' : 'nft-list-grid',
                )}
              >
                <div
                  className={classNames(
                    'nft-column pt-0',
                    ongoingList.length === 1 ? 'no-gap one-grid' : '',
                    ongoingList.length === 2 ? 'two-grid' : '',
                  )}
                >
                  {ongoingList.map((item: any, index: any) =>
                    isMobile() ? (
                      <NftCardMobile
                        nft={item}
                        key={index}
                        isNavigate={true}
                        isEndable={true}
                      />
                    ) : (
                      <NftCard
                        nft={item}
                        isNavigate={true}
                        key={index}
                        isEndable={true}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-40"></div>
          )}
          {upcomingList?.length > 0 ? (
            <div>
              <div
                className="nft-tab-title mt-30 mb-30"
                style={{ textTransform: 'capitalize' }}
              >
                {t('coming soon').toLowerCase()}
              </div>
              <div
                className={classNames(
                  'nft-line-ex',
                  isMobile() ? 'nft-list-grid-mob' : 'nft-list-grid',
                )}
              >
                <div
                  className={classNames(
                    'nft-column pt-0',
                    upcomingList.length === 1 ? 'no-gap one-grid' : '',
                    upcomingList.length === 2 ? 'two-grid' : '',
                  )}
                >
                  {upcomingList.map((item: any, index: any) =>
                    isMobile() ? (
                      <NftCardMobile
                        nft={item}
                        key={index}
                        isNavigate={true}
                        isEndable={true}
                      />
                    ) : (
                      <NftCard
                        nft={item}
                        isNavigate={true}
                        key={index}
                        isEndable={true}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-40"></div>
          )}
          {launchedList.length > 0 ? (
            <div>
              <div className="nft-tab-title mt-10 mb-30">
                {t('launched NFTs')}
              </div>
              <div
                className={classNames(
                  'nft-line-ex',
                  isMobile() ? 'nft-list-grid-mob' : 'nft-list-grid',
                )}
              >
                <div
                  className={classNames(
                    'nft-column pt-0',
                    launchedList.length === 1 ? 'no-gap one-grid' : '',
                    launchedList.length === 2 ? 'two-grid' : '',
                  )}
                >
                  {launchedList.map((item: any, index: any) =>
                    isMobile() ? (
                      <NftCardMobile nft={item} key={index} isNavigate={true} />
                    ) : (
                      <NftCard nft={item} key={index} isNavigate={true} />
                    ),
                  )}
                </div>
              </div>
            </div>
          ) : (
            mycoinNftsData.length === 0 && (
              <div className="nft-tab-title yellow-color">
                {t('no NFTs found')}
              </div>
            )
          )}
        </>
      )}
    </>
  )
}

export default NftList
