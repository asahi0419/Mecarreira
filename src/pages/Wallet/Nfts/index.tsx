import NftCardMobile from '@components/Card/NftCardMobile'
import DialogBox from '@components/Dialog/DialogBox'
import SearchBar from '@components/SearchBar'
import NftView from '@pages/PlayerNft/NftView'
import {
  getNftsBalance,
  toggleStakingCoins,
  getEANftsBalance,
} from '@root/apis/playerCoins/playerCoinsSlice'
import { RootState } from '@root/store/rootReducers'
import classNames from 'classnames'
import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import debounce from 'lodash.debounce'
import { isMobile } from '@utils/helpers'
import {
  fetchGenesisNFTData,
  resetGenesisNFTData,
} from '@root/apis/gallery/gallerySlice'
import GenesisNftView from '@pages/PlayerNft/GenesisNftView'
import { getGeneralSettings } from '@root/apis/onboarding/authenticationSlice'

const Nfts = () => {
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const {
    isLoading,
    isLoadingNfts,
    nftsBalance,
    isGetNftsBalanceSuccess,
    isGetNftsBalanceError,
    isGetEANftsBalanceSuccess,
    isGetEANftsBalanceError,
    isStakingOnlySelected,
  } = playerCoinData
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const galleryData = useSelector((state: RootState) => state.gallery)
  const { isFetchGenesisNFTDataSuccess, isFetchGenesisNFTData } = galleryData
  const { selectedThemeRedux } = authenticationData
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [appliedFilters, setAppliedFilters] = useState<any>({})

  const currentURL = window.location.href
  const includesGenesis = currentURL.includes('/genesis')
  const includeLanding = !currentURL.includes('/app')

  useEffect(() => {
    dispatch(getEANftsBalance(''))

    return () => {
      if (includesGenesis) dispatch(toggleStakingCoins(true))
      else dispatch(toggleStakingCoins(false))
    }
  }, [])

  useEffect(() => {
    if (Object.keys(appliedFilters).length > 0) {
      dispatch(getEANftsBalance(appliedFilters))
    }
  }, [appliedFilters])

  const handleSearch = (value: string | undefined) => {
    let request: any = {}
    request = {
      search: value || '',
    }
    if (!value) {
      delete request.search
    }
    setAppliedFilters({ ...appliedFilters, ...request })
  }
  const optimizedHandleSearch = useCallback(debounce(handleSearch, 500), [])
  const handleReset = () => {
    setAppliedFilters({ search: '' })
    dispatch(getEANftsBalance(''))
  }

  const [showNftDetail, setShowNftDetail] = useState(false)
  const [nftData, setNftData] = useState<any>(null)

  const handleShowNftDetail = (nft: any) => {
    if (isGetEANftsBalanceSuccess) {
      /*
      GEN1: if Toggle switch is active & Genesis nft list is fetched, 
      call Genesis nft details api on click & show Genesis NFT popup
      (DESKTOP ONLY)
     */
      dispatch(fetchGenesisNFTData({ tokenId: nft?.tokenid }))
      dispatch(getGeneralSettings())
    } else {
      setNftData(nft)
      setShowNftDetail(true)
    }
  }

  const handleCloseNftDetail = () => {
    setShowNftDetail(false)
    /*
      GEN3: as the Genesis popup is closed on Desktop, genesis nft details are cleared
      & based on user's toggle selection, nft list is updated on wallet
    */
    if (isFetchGenesisNFTDataSuccess) {
      dispatch(resetGenesisNFTData())
    }
    dispatch(getEANftsBalance(''))
  }

  return (
    <>
      {showNftDetail && (
        <DialogBox isOpen={showNftDetail} onClose={handleCloseNftDetail}>
          <NftView nft={nftData} />
        </DialogBox>
      )}
      {/* GEN2: POPUP FOR GENESIS NFT ( DESKTOP ONLY; shows when Genesis nft
          data is fetched from tokenId ) */}
      {isFetchGenesisNFTDataSuccess && (
        <DialogBox
          isOpen={isFetchGenesisNFTDataSuccess}
          onClose={handleCloseNftDetail}
        >
          <GenesisNftView genesisNftDetails={isFetchGenesisNFTData} />
        </DialogBox>
      )}
      {!includeLanding && (
        <SearchBar
          onEdit={optimizedHandleSearch}
          onClose={handleReset}
          isFilterDisabled={true}
          isSwitchEnabled={true}
          mode="wallet_nft"
        />
      )}
      <div
        className={classNames(
          'wallet-nft-wrapper fixed-content dlg-content border-top',
          (isGetNftsBalanceError || isLoading || isLoadingNfts) && isMobile()
            ? 'wallet-nft-empty'
            : '',
        )}
      >
        {isLoading || isLoadingNfts ? (
          <div className={classNames('balance-progress')}>
            <div
              className={classNames(
                'loading-spinner-container mb-40 mt-40',
                'show',
              )}
            >
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {nftsBalance.length > 0 ? (
              <div className="nft-line-ex nft-list-grid-mob">
                <div
                  className={
                    nftsBalance.length > 1 ? 'nft-column' : 'nft-column'
                  }
                >
                  {nftsBalance.map((item: any, index: number) => (
                    <NftCardMobile
                      className="m-0 wallet-nft-item"
                      nft={item}
                      key={index}
                      isNavigate={true}
                      onNftDetailView={handleShowNftDetail}
                      walletNFT={true}
                    />
                  ))}
                </div>
              </div>
            ) : (
              (isGetEANftsBalanceSuccess || isGetEANftsBalanceError) && (
                <div className="alert-wrapper">
                  <div className="heading-title unverified-alert">
                    {t('no genesis found')}
                  </div>
                </div>
              )
            )}
          </>
        )}
      </div>
    </>
  )
}

export default Nfts
