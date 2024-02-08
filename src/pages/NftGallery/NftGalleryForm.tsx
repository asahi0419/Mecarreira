import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import NftGalleryCard from '@components/Card/NftGalleryCard'
import '@assets/css/pages/NftGallery.css'
import { Grid } from '@mui/material'
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined'
import { useDispatch, useSelector } from 'react-redux'
import NftGalleryDetail from './NftGalleryDetail'
import { RootState } from '@root/store/rootReducers'
import {
  fetchGalleryData,
  resetGalleryData,
  showGalleryDetail,
  updateNFT,
  updateNFTInit,
} from '@root/apis/gallery/gallerySlice'
import classNames from 'classnames'
import toast from 'react-hot-toast'
import HotToaster from '@components/HotToaster'
import { isMobile } from '@utils/helpers'
import { Switch } from '@components/Form'

interface Props {
  isLaunch?: boolean
  onSetNftImg?: any
  isForceLaunched?: boolean
}
const NftGalleryForm: React.FC<Props> = ({
  isLaunch,
  onSetNftImg,
  isForceLaunched,
}) => {
  const { t } = useTranslation()
  const inputFile = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()
  const [item, setItem] = useState(null)
  const [showDetail, setShowDetail] = useState(false)

  const {
    isGalleryLoading,
    isGalleryLoadingEnded,
    galleryData,
    isUpdateNFTSuccess,
    isUpdateNFTFailure,
  } = useSelector((state: RootState) => state.gallery)

  const isGalleryDetailVisible = useSelector(
    (state: RootState) => state.gallery.isGalleryDetailVisible,
  )

  const selectedPlayer = useSelector(
    (state: RootState) => state.playercoins.selectedPlayer,
  )

  const { player1contract } = useSelector(
    (state: RootState) => state.playercoins,
  )
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const { selectedThemeRedux } = authenticationData
  useEffect(() => {
    if (isUpdateNFTSuccess) {
      dispatch(
        fetchGalleryData('status_id=1,2,3,4,5&contract=' + player1contract),
      )
      dispatch(updateNFTInit())
    }
    if (isUpdateNFTFailure) {
      toast.error(t(isUpdateNFTFailure))
    }
  }, [isUpdateNFTSuccess, isUpdateNFTFailure])

  const handleUpload = () => {
    if (inputFile.current) {
      inputFile.current.click()
    }
  }

  const onUpload = (e: any) => {
    e.preventDefault()
    const files = e.target.files
    const reader = new FileReader()
    reader.readAsDataURL(files[0])
    if (files && files.length) {
      const formData = new FormData()
      formData.append('image', files[0])
      formData.append('playerid', selectedPlayer?.id)
      dispatch(updateNFT(formData))
    }
  }

  const handleClick = (item: any) => {
    if (isLaunch) {
      handleLaunch(item)
    } else {
      setItem(item)
      setShowDetail(true)
      dispatch(showGalleryDetail(true))
    }
  }

  const handleLaunch = (item: any) => {
    // onSetNftImg &&
    //   onSetNftImg(item.artwork ? item.artwork : item.artwork_thumb, item.id)
    onSetNftImg && onSetNftImg(item.artwork_thumb, item.id)
  }

  const [isLaunchable, setIsLaunchable] = useState(isLaunch)

  useEffect(() => {
    return () => {
      dispatch(resetGalleryData())
    }
  }, [])

  useEffect(() => {
    dispatch(resetGalleryData())
    if (isLaunchable) {
      dispatch(fetchGalleryData('status_id=2&contract=' + player1contract))
    } else {
      dispatch(
        fetchGalleryData('status_id=1,2,3,4,5&contract=' + player1contract),
      )
    }
  }, [isLaunchable])

  const handleJumpToPage = () => {
    if (isLaunchable) {
      dispatch(
        fetchGalleryData(
          'status_id=2&contract=' +
            player1contract +
            '&offset=' +
            galleryData.length,
        ),
      )
    } else {
      dispatch(
        fetchGalleryData(
          'status_id=1,2,3,4,5&contract=' +
            player1contract +
            '&offset=' +
            galleryData.length,
        ),
      )
    }
  }

  const handleScroll = e => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight
    if (bottom && !isGalleryLoadingEnded) {
      handleJumpToPage()
    }
  }

  return (
    <>
      <HotToaster />
      {!isGalleryDetailVisible || !showDetail || isLaunch ? (
        <div className="nft-gallery">
          {!isMobile() && (
            <div className="nft-gallery-title h-2">{t('my NFT Gallery')}</div>
          )}
          <div className="nft-gallery-selector">
            {isForceLaunched ? (
              <Switch
                label={t('can be launched')}
                isChecked={isForceLaunched}
                onSwitch={() => console.log('')}
              />
            ) : (
              <Switch
                label={t('can be launched')}
                onSwitch={() => setIsLaunchable(!isLaunchable)}
                isChecked={isLaunchable}
              />
            )}
          </div>
          {isGalleryLoading && galleryData.length === 0 ? (
            <div
              className={classNames(
                'loading-spinner-container gallery-spinner mb-40 mt-40',
                isGalleryLoading ? 'show' : '',
              )}
            >
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            </div>
          ) : (
            <>
              {!galleryData || galleryData.length < 1 ? (
                <div className="nft-tab-title yellow-color">
                  {t('no NFTs uploaded')}
                </div>
              ) : (
                <div className="nft-gallery-grid" onScroll={handleScroll}>
                  <Grid container>
                    {galleryData &&
                      galleryData.map((item: any, index: any) => {
                        return (
                          <Grid
                            item
                            md={6}
                            xs={6}
                            className={
                              index % 2 === 0
                                ? 'nft-gallery-leftline'
                                : 'nft-gallery-rightline'
                            }
                            key={index}
                          >
                            <NftGalleryCard
                              img={
                                item.artwork_thumb
                                  ? item.artwork_thumb
                                  : item.artwork
                              }
                              status={item.statusid.id}
                              playerstatus={selectedPlayer?.playerstatusid?.id}
                              onClick={() => handleClick(item)}
                              onLaunch={() => handleLaunch(item)}
                            />
                          </Grid>
                        )
                      })}
                  </Grid>
                  {isGalleryLoading ? (
                    <Grid container>
                      {new Array(8).fill(1).map((_: any, index: number) => (
                        <Grid
                          item
                          md={6}
                          xs={6}
                          className={
                            index % 2 === 0
                              ? 'nft-gallery-leftline'
                              : 'nft-gallery-rightline'
                          }
                          key={index}
                        >
                          <div className="nft-skeleton-gallery-card"></div>
                        </Grid>
                      ))}
                    </Grid>
                  ) : !isGalleryLoadingEnded ? (
                    <div style={{ height: '50px' }}></div>
                  ) : null}
                </div>
              )}
              {!isLaunch && (
                <div className="plus-icon" onClick={handleUpload}>
                  <AddCircleOutlinedIcon />
                  <input
                    id="media"
                    name="nftMedia"
                    accept="image/*"
                    type="file"
                    autoComplete="off"
                    tabIndex={-1}
                    style={{ display: 'none' }}
                    ref={inputFile}
                    onChange={onUpload}
                  />
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <NftGalleryDetail
          item={item}
          onBack={() => dispatch(showGalleryDetail(false))}
          onLaunch={handleLaunch}
        />
      )}
    </>
  )
}

export default NftGalleryForm
