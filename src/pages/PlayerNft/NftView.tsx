/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect } from 'react'
import NftForm from './NftForm'
import NftDetail from './NftDetail'
import '@assets/css/pages/PlayerNft.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { fetchNFTData, resetNftData } from '@root/apis/gallery/gallerySlice'
import classNames from 'classnames'

interface Props {
  nft: any
  isBid?: boolean
  isEndable?: boolean
}

const NftView: React.FC<Props> = ({ nft, isBid, isEndable }) => {
  const dispatch = useDispatch()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { userWalletData, selectedThemeRedux } = authenticationData
  const loginInfo = localStorage.getItem('loginInfo')
  const { isLoading, nftData } = useSelector(
    (state: RootState) => state.gallery,
  )
  const loginId = localStorage.getItem('loginId')

  useEffect(() => {
    if (nft?.nfttype === 'raffle') {
      if (loginInfo || userWalletData?.address) {
        if (loginInfo) {
          dispatch(
            fetchNFTData({ id: nft.id || nft?.address, wallet: loginInfo }),
          )
        } else if (loginId) {
          dispatch(
            fetchNFTData({
              id: nft.id || nft?.address,
              wallet: userWalletData?.address,
            }),
          )
        }
      } else {
        dispatch(fetchNFTData({ id: nft.id || nft?.address }))
      }
    } else {
      dispatch(fetchNFTData({ id: nft.id || nft?.address }))
    }
    return () => {
      dispatch(resetNftData())
    }
  }, [])

  return (
    <section className="nft-view-container">
      {isLoading ? (
        <div className="loading-spinner m-auto flex-center">
          <div className="spinner"></div>
        </div>
      ) : nftData ? (
        <div>
          <div className={classNames('tab-bar-container')}></div>
          <NftForm nft={nftData} isBid={isBid} isEndable={isEndable} />
          <NftDetail nft={nftData} />
        </div>
      ) : (
        ''
      )}
    </section>
  )
}

export default NftView
