import DialogBox from '@components/Dialog/DialogBox'
import SubmitButton from '@components/Button/SubmitButton'
import NftGalleryForm from '@pages/NftGallery/NftGalleryForm'
import {
  showGalleryDetail,
  showGalleryForm,
} from '@root/apis/gallery/gallerySlice'
import { PLAYER_STATUS } from '@root/constants'
import { RootState } from '@root/store/rootReducers'
import { isMobile } from '@utils/helpers'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import CreateNft from './CreateNft'
import NftList from './NftList'

const Nfts = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [status, setStatus] = useState('list')
  const [isLaunch, setIsLaunch] = useState(false)
  const [forceLaunch, setForceLaunch] = useState(false)
  const [nftImg, setNftImg] = useState('')
  const [nftId, setNftId] = useState('')
  const isGalleryFormVisible = useSelector(
    (state: RootState) => state.gallery.isGalleryFormVisible,
  )
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { selectedThemeRedux } = authenticationData
  const selectedPlayer = useSelector(
    (state: RootState) => state.playercoins.selectedPlayer,
  )

  const handleNewCreate = () => {
    setNftImg('')
    setStatus('create')
  }
  const handleMyGallery = () => {
    setIsLaunch(false)
    dispatch(showGalleryDetail(false))
    dispatch(showGalleryForm(true))
  }

  useEffect(() => {
    if (isGalleryFormVisible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isGalleryFormVisible])

  const handleOpenGallery = () => {
    setIsLaunch(true)
    setForceLaunch(true)
    dispatch(showGalleryForm(true))
  }

  const handleSetNftImg = (img: string, id: string) => {
    setNftImg(img)
    setNftId(id)
    dispatch(showGalleryForm(false))
    setStatus('create')
  }

  return (
    <>
      {isGalleryFormVisible && (
        <DialogBox
          isOpen={!isMobile()}
          onClose={() => dispatch(showGalleryForm(false))}
        >
          <NftGalleryForm
            isLaunch={isLaunch}
            isForceLaunched={forceLaunch}
            onSetNftImg={handleSetNftImg}
          />
        </DialogBox>
      )}
      {isGalleryFormVisible && isMobile() ? (
        <NftGalleryForm
          isLaunch={isLaunch}
          isForceLaunched={forceLaunch}
          onSetNftImg={handleSetNftImg}
        />
      ) : (
        <div
          className={
            status !== 'create'
              ? 'mb-30 width-content'
              : 'mb-30 nft-tab-container'
          }
        >
          <div className="nft-tab-title mt-30">{t('create your own nft')}</div>
          {status !== 'create' ? (
            <div className="nft-button-box">
              <SubmitButton
                title={t('new nft')}
                className="nft-create-btn"
                onPress={handleNewCreate}
              />
              <SubmitButton
                title={t('my gallery')}
                className="nft-gallery-btn"
                onPress={handleMyGallery}
              />
            </div>
          ) : (
            <></>
          )}
          {status === 'list' ? (
            <NftList />
          ) : status === 'create' ? (
            <CreateNft
              nftImg={nftImg}
              nftId={nftId}
              onOpenGallery={handleOpenGallery}
              onSuccess={() => setStatus('list')}
            />
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  )
}

export default Nfts
