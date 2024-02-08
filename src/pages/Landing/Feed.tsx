import React, { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import {
  clearLiveFeeds,
  getFeedPlayers,
  updateFeedPlayers,
} from '@root/apis/playerCoins/playerCoinsSlice'
import { useInView } from 'react-intersection-observer'
import FeedCard from '@components/Card/FeedCard'
import UserCardSkeleton from '@components/Card/UserCardSkeleton'
import { sleep } from '@utils/helpers'

const Feed: React.FC = () => {
  const { t } = useTranslation()
  const scrollRef = useRef(null)
  const dispatch = useDispatch()
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const { feedPlayers, loadingFeedPlayers, initialFeedsFetched, newFeeds } =
    playerCoinData
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loadingIndex, setLoadingIndex] = useState(0)
  const [feedsQueue, setFeedsQueue] = useState([])
  const rowsPerBatch = 8
  const batchDelay = 11000 // 12 seconds in milliseconds

  useEffect(() => {
    // const timer = setInterval(async () => {
    //   setLoadingIndex(1)
    //   await sleep(1000)
    //   setCurrentIndex(prevIndex =>
    //     prevIndex + rowsPerBatch >= feedPlayers.length
    //       ? 0
    //       : (prevIndex + 1) % feedPlayers.length,
    //   )
    //   setLoadingIndex(2)
    //   await sleep(1000)
    //   setLoadingIndex(0)
    // }, batchDelay)

    console.log({ feedPlayers })

    return () => {
      // clearInterval(timer)
    }
  }, [feedPlayers.length])

  useEffect(() => {
    if (initialFeedsFetched && feedPlayers.length > 0) {
      console.log({ initialFeedsFetched, feedPlayers })
      const feedsTimer = setInterval(async () => {
        dispatch(
          getFeedPlayers({
            params: { tradetimestamp: feedPlayers[0]?.tradetimestamp },
          }),
        )
      }, batchDelay)

      console.log({ feedPlayers })
      return () => {
        dispatch(clearLiveFeeds())
        clearInterval(feedsTimer)
      }
    }
  }, [initialFeedsFetched])

  async function updateList() {
    const newElement = 'New Element' // Replace with the actual element you want to add
    const feedsTemp = [...feedsQueue]
    for (let i = 0; i < newFeeds.length; i++) {
      feedsTemp.unshift(newFeeds[i])
    }

    // Removing one from the bottom if the list exceeds a certain length (e.g., 10)
    const maxLength = 8
    if (feedsTemp.length > maxLength) {
      feedsTemp.pop()
    }

    // Display the updated list (you can replace this with your own logic)
    console.log(feedsTemp)
    setFeedsQueue(feedsTemp)
    const span = scrollRef.current // corresponding DOM node
    span.className = 'animate-move user-list-column'
    await sleep(1000)
    span.className = 'user-list-column'
  }

  useEffect(() => {
    if (feedPlayers.length > 0) {
      console.log('fpps--', feedPlayers)
      // setFeedsQueue([...feedPlayers.slice(0, 8), ...feedsQueue])
      setFeedsQueue(prevFeeds => [...feedPlayers.slice(0, 8), ...prevFeeds])
    }
  }, [feedPlayers])

  useEffect(() => {
    dispatch(getFeedPlayers({ params: {}, isFirstLoad: true }))
  }, [])

  useEffect(() => {
    console.log({ newFeeds })
    if (newFeeds.length > 0) {
      updateList()
    }
    // dispatch(getFeedPlayers({ params: {}, isFirstLoad: true }))
  }, [newFeeds])

  return (
    <div className="section-wrapper">
      <div className="section-title-container">
        <div className="section-title">{t('feed')}</div>
      </div>
      <div>
        <>
          {loadingFeedPlayers ? (
            <div className="user-list-wrapper">
              <div className="user-list-column">
                {new Array(8).fill(1).map((_: any, index: number) => (
                  <UserCardSkeleton key={index} />
                ))}
              </div>
            </div>
          ) : feedsQueue.length === 0 ? (
            <div className="no-data-msg">{t('no data found')}</div>
          ) : (
            <div className="user-list-wrapper">
              <div
                ref={scrollRef}
                className={`${
                  loadingIndex === 2 ? 'animate-move' : ''
                } user-list-column`}
              >
                {feedsQueue
                  // .slice(currentIndex, currentIndex + rowsPerBatch)
                  // .reverse()
                  .map((item: any, index: number) => (
                    <FeedCard
                      user={item}
                      index={window.innerWidth <= 700 ? 0 : index + 1}
                      key={index}
                    />
                  ))}
              </div>
            </div>
          )}
        </>
      </div>
    </div>
  )
}

export default Feed
