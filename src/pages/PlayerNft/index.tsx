/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from 'react'
import { AppLayout } from '@components/index'
import { useLocation } from 'react-router-dom'
import '@assets/css/pages/PlayerNft.css'
import TagManager from 'react-gtm-module'
import { tagManagerArgs } from '@root/constants'
import NftView from './NftView'
import { fetchNFTData } from '@root/apis/gallery/gallerySlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { initTagManager } from '@utils/helpers'

const PlayerNft: React.FC = () => {
  const location: any = useLocation()
  const dispatch = useDispatch()
  const galleryData = useSelector((state: RootState) => state.gallery)
  const { isFetchNFTDataSuccess, nftData } = galleryData
  const [nft, setNft] = useState<any>(null)

  useEffect(() => {
    // TagManager.initialize(tagManagerArgs)
    initTagManager()
    document.querySelector('title')!.innerText = 'Nft of meCarreira'
    window.scrollTo(0, 0)
    const locationUrl = window.location.href
    const urlPlayer = locationUrl.split('/')
    if (!location?.state?.nft) {
      dispatch(
        fetchNFTData({ nftdetailpageurl: urlPlayer[urlPlayer.length - 1] }),
      )
    } else {
      setNft(location?.state?.nft)
    }
  }, [])

  useEffect(() => {
    if (isFetchNFTDataSuccess) {
      setNft(nftData)
    }
  }, [isFetchNFTDataSuccess])

  useEffect(() => {
    if (nft) {
      document.querySelector('title')!.innerText =
        nft?.name + ' NFT  by ' + nft?.playername
      document
        .querySelector("meta[name='description']")!
        .setAttribute('content', nft?.description)
    }
  }, [nft])

  return (
    <AppLayout
      headerStatus="header-status"
      headerClass="home"
      footerStatus="footer-status"
      noPageFooter={true}
    >
      {nft ? (
        <NftView
          nft={nft}
          isBid={location?.state?.isBid}
          isEndable={location?.state?.isEndable}
        />
      ) : (
        location?.state?.nft && (
          <NftView
            nft={location?.state?.nft}
            isBid={location?.state?.isBid}
            isEndable={location?.state?.isEndable}
          />
        )
      )}
    </AppLayout>
  )
}

export default PlayerNft
