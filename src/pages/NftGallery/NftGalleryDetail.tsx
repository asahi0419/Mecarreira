import { useTranslation } from 'react-i18next'
import SubmitButton from '@components/Button/SubmitButton'
import TraitCard from '@components/Card/TraitCard'
import ClaimCard from '@components/Card/ClaimCard'
import { Grid } from '@mui/material'
import CreateTrait from './CreateTrait'
import BottomPopup from '@components/Dialog/BottomPopup'
import { useEffect, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import {
  createTrait,
  deleteTrait,
  fetchNFTData,
  resetNftData,
  updateNftStatus,
  updateTrait,
  uploadNFT,
  deleteNFT,
  fetchGalleryData,
} from '@root/apis/gallery/gallerySlice'
import { NFT_STATUS, PLAYER_STATUS } from '@root/constants'
import toast from 'react-hot-toast'
import HotToaster from '@components/HotToaster'
import classNames from 'classnames'
import { isMobile } from '@utils/helpers'
import FormInput from '../../components/Form/FormInput'
import { Formik } from 'formik'
import Spinner from '@components/Spinner'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import ImageComponent from '@components/ImageComponent'
interface Props {
  item: any
  onBack: () => any
  onLaunch: any
}

const initTraitData = {
  id: '0',
  type: 'trait',
  title: '',
  content: '',
}

const initialValues = {
  name: '',
  description: '',
  claim: '',
}

const NftGalleryDetail: React.FC<Props> = ({ item, onBack, onLaunch }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [showPopup, setShowPopup] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [preData, setPreData] = useState<any>(null)
  const [nftStatus, setNftStatus] = useState(item.statusid.id)
  const [traitData, setTraitData] = useState<any>(initTraitData)
  const [nftName, setNftName] = useState('')
  const selectedPlayer = useSelector(
    (state: RootState) => state.playercoins.selectedPlayer,
  )

  const { player1contract } = useSelector(
    (state: RootState) => state.playercoins,
  )

  const galleryData = useSelector((state: RootState) => state.gallery)
  const {
    isLoading,
    isUpdateNftStatus,
    nftData,
    traitsData,
    isUpdateNftStatusSuccess,
    isUpdateNftStatusFailure,
    isCreateTraitSuccess,
    isCreateTraitFailure,
    isUpdateTraitSuccess,
    isUpdateTraitFailure,
    isUploadNFTSuccess,
    isUploadNFTFailure,
    isDeleteTraitSuccess,
    isDeleteTraitFailure,
    isDeleteNFTSuccess,
    isDeleteNFTFailure,
  } = galleryData

  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const { selectedThemeRedux } = authenticationData
  useEffect(() => {
    dispatch(fetchNFTData({ id: item.id }))
    return () => {
      dispatch(resetNftData())
    }
  }, [])

  useEffect(() => {
    if (nftData) {
      setPreData({
        name: nftData?.name || '',
        description: nftData?.description || '',
        claim: nftData?.claim || '',
      })
      setNftName(nftData?.name || '')
    }
  }, [nftData])

  const handleMakePublic = (values: any) => {
    if (values.name === '') {
      toast.error(t('name required'))
      return
    }
    if (values.name.length < 3) {
      toast.error(t('name should be 3 characters at least'))
      return
    }
    if (values.description === '') {
      toast.error(t('description required'))
      return
    }
    if (values.description.length < 10) {
      toast.error(t('description should be 10 characters at least'))
      return
    }
    const reqParams = {
      name: values.name,
      description: values.description,
      id: item.id,
      nft_status: NFT_STATUS.PUBLIC,
    }
    dispatch(updateNftStatus(reqParams))
  }

  const handleLaunch = () => {
    if (nftName !== preData?.name) {
      const reqParams = {
        id: item.id,
        name: nftName,
      }
      dispatch(uploadNFT(reqParams))
    }
    // if (
    //   selectedPlayer?.playerstatusid?.id !== PLAYER_STATUS.PRO &&
    //   nftStatus === NFT_STATUS.PUBLIC
    // ) {
    //   toast.error(t('only pro player can launch'))
    //   return
    // }
    onLaunch(item)
  }

  useEffect(() => {
    if (isUpdateNftStatusSuccess) {
      setNftStatus(NFT_STATUS.PUBLIC)
      dispatch(
        fetchGalleryData('status_id=1,2,3,4,5&contract=' + player1contract),
      )
    }
    if (isUpdateNftStatusFailure) {
      toast.error(t('unknown exception'))
    }
  }, [isUpdateNftStatusSuccess, isUpdateNftStatusFailure])

  useEffect(() => {
    setNftStatus(item.statusid.id)
  }, [item])

  useEffect(() => {
    if (isCreateTraitSuccess) {
      setIsSuccess(true)
    }
    if (isCreateTraitFailure) {
      toast.error(t('unknown exception'))
    }
  }, [isCreateTraitSuccess, isCreateTraitFailure])

  useEffect(() => {
    if (isUpdateTraitSuccess) {
      setIsSuccess(true)
    }
    if (isUpdateTraitFailure) {
      toast.error(t('unknown exception'))
    }
  }, [isUpdateTraitSuccess, isUpdateTraitFailure])

  useEffect(() => {
    if (isUploadNFTSuccess) {
      setIsSuccess(true)
    }
    if (isUploadNFTFailure) {
      toast.error(t('unknown exception'))
    }
  }, [isUploadNFTSuccess, isUploadNFTFailure])

  useEffect(() => {
    if (isDeleteTraitSuccess) {
      dispatch(fetchNFTData({ id: item.id }))
    }
    if (isDeleteTraitFailure) {
      toast.error(t('unknown exception'))
    }
  }, [isDeleteTraitSuccess, isDeleteTraitFailure])

  const handleSubmitDescription = (submitData: any) => {
    if (submitData.type === 'trait') {
      if (submitData.id === '0') {
        const reqParams = {
          id: item.id,
          trait: {
            trait_type: submitData.title,
            value: submitData.content,
            display_type: 'string',
          },
        }
        dispatch(createTrait(reqParams))
      } else {
        const reqParams = {
          trait_id: submitData.id,
          trait_type: submitData.title,
          value: submitData.content,
        }
        dispatch(updateTrait(reqParams))
      }
    } else {
      let reqParams
      if (submitData.type === 'claim') {
        reqParams = {
          id: item.id,
          claim: submitData.content,
          claimtitle: submitData.title,
        }
      } else {
        reqParams = {
          id: item.id,
          name: nftName,
          description: submitData.content,
        }
      }
      dispatch(uploadNFT(reqParams))
    }
  }

  const handleTraitEdit = (id: string, title: string, content: string) => {
    setTraitData({
      id,
      type: 'trait',
      title,
      content,
    })
    setIsSuccess(false)
    setShowPopup(true)
  }

  const handleTraitDelete = (id: string) => {
    const reqParams = {
      id,
    }
    dispatch(deleteTrait(reqParams))
  }

  const handleClaimEdit = (
    id: string,
    title: string,
    content: string,
    isClaim: boolean,
  ) => {
    setTraitData({
      id,
      type: isClaim ? 'claim' : 'description',
      title,
      content,
    })
    setIsSuccess(false)
    setShowPopup(true)
  }

  const handleClaimDelete = (id: string, isClaim: boolean) => {
    let reqParams
    if (isClaim) {
      reqParams = {
        id: item.id,
        claim: '',
        claimtitle: '',
      }
    } else {
      reqParams = {
        id: item.id,
        name: nftName,
        description: '',
      }
    }
    dispatch(uploadNFT(reqParams))
  }

  const handleDelete = () => {
    dispatch(deleteNFT(item.id))
  }

  useEffect(() => {
    if (isDeleteNFTSuccess) {
      toast.error(t('successfully removed'))
      dispatch(
        fetchGalleryData('status_id=1,2,3,4,5&contract=' + player1contract),
      )
      onBack()
    }
    if (isDeleteNFTFailure) {
      toast.error(t('unknown exception'))
    }
  }, [isDeleteNFTSuccess, isDeleteNFTFailure])

  const handleBack = () => {
    if (nftName !== preData?.name) {
      const reqParams = {
        id: item.id,
        name: nftName,
      }
      dispatch(uploadNFT(reqParams))
    }
    onBack()
  }

  const [currentNumber, setCurrentNumber] = useState(-1)

  return (
    <div className="nft-gallerydetail">
      <HotToaster />
      <BottomPopup
        contentClass="gallery-alert-popup"
        isOpen={isUpdateNftStatus}
      >
        <div className="gallery-alert-title">
          {t('we are uploading your NFT')}
        </div>
        <Spinner title={''} spinnerStatus={true} />
      </BottomPopup>
      {!isMobile() && (
        <div className="nft-gallerydetail-title" onClick={handleBack}>
          <ArrowBackIcon className="icon-color" />
          <div className="h-3">{t('back to Gallery')}</div>
        </div>
      )}
      <div className="nft-gallerydetail-content">
        <ImageComponent
          src={
            item.artwork
              ? 'data:image/png;base64, ' + item.artwork
              : item.artwork_thumb
          }
          className="nft-gallerydetail-img"
        />
        {nftStatus === NFT_STATUS.INITIAL ? (
          <div className="nft-gallerdetail-itemDescription h-5">
            {t('this Nft has status Draft')}
          </div>
        ) : nftStatus === NFT_STATUS.PUBLIC ? (
          <div className="nft-gallerdetail-itemDescription h-5 fg-primary-color">
            {t('this Nft is publicly visible')}
          </div>
        ) : nftStatus === NFT_STATUS.AUCTION ? (
          <div className="nft-gallerdetail-itemDescription h-5 fg-primary-color">
            {t('This Nft is used for the auction')}
          </div>
        ) : nftStatus === NFT_STATUS.RAFFLE ? (
          <div className="nft-gallerdetail-itemDescription h-5 fg-primary-color">
            {t('This Nft is used for the raffle')}
          </div>
        ) : (
          <div className="nft-gallerdetail-itemDescription h-5 fg-primary-color">
            {t('This Nft is minted')}
          </div>
        )}
        <Formik
          enableReinitialize={true}
          initialValues={preData || initialValues}
          onSubmit={async values => {
            if (nftStatus === NFT_STATUS.INITIAL) {
              handleMakePublic(values)
            } else if (nftStatus === NFT_STATUS.PUBLIC) {
              handleLaunch()
            }
          }}
        >
          {props => {
            const {
              values,
              touched,
              errors,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
            } = props
            return (
              <form autoComplete="off" onSubmit={handleSubmit}>
                <div
                  className="login-form-container mb-0"
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  {console.log({ selectedPlayer, nftStatus, NFT_STATUS })}
                  {nftStatus <= NFT_STATUS.PUBLIC && (
                    <SubmitButton
                      // isDisabled={
                      //   selectedPlayer?.playerstatusid?.id !==
                      //     PLAYER_STATUS.PRO && nftStatus === NFT_STATUS.PUBLIC
                      // }
                      className="nft-gallerydetail-btn"
                      title={
                        nftStatus === NFT_STATUS.INITIAL
                          ? t('make Public Visible')
                          : nftStatus === NFT_STATUS.PUBLIC
                          ? t('launch NFT')
                          : ''
                      }
                      onPress={handleSubmit}
                    />
                  )}
                  <div className="field-wrapper" style={{ width: '328px' }}>
                    <div className="input-field-wrapper">
                      <label>
                        <b>{t('name')}</b>
                      </label>
                      {currentNumber <= 45 && currentNumber >= 0 && (
                        <div className="gallery-current-number">
                          {t('characters left')}: {currentNumber}
                        </div>
                      )}
                    </div>
                    <FormInput
                      id="name"
                      type="text"
                      placeholder={t('enter Name')}
                      disabled={nftStatus >= NFT_STATUS.PUBLIC}
                      name="name"
                      maxLength={45}
                      value={values.name}
                      handleChange={evt => {
                        const length = evt.target.value.length
                        setCurrentNumber(45 - length)
                        setNftName(evt.target.value)
                        handleChange(evt)
                      }}
                      onBlur={handleBlur}
                    />
                    {errors.name && touched.name && (
                      <div className="input-feedback">{errors.name}</div>
                    )}
                  </div>
                  {!isLoading && (
                    <div className="nft-detail-claim">
                      <div className="nft-detail-claim-title">
                        {t('description')}
                      </div>
                      {!nftData?.description &&
                      nftStatus > NFT_STATUS.INITIAL ? (
                        <div className="nft-detail-attr-no mt-20">
                          {t('no description for this nft')}
                        </div>
                      ) : (
                        <ClaimCard
                          id={nftData?.id}
                          isClaim={false}
                          title={''}
                          desc={nftData?.description}
                          editable={nftStatus === NFT_STATUS.INITIAL}
                          onEdit={handleClaimEdit}
                          onDelete={handleClaimDelete}
                        />
                      )}
                    </div>
                  )}
                  {errors.description && (
                    <div className="input-feedback" style={{ width: '334px' }}>
                      {errors.description}
                    </div>
                  )}
                  <BottomPopup
                    isOpen={showPopup}
                    mode={isMobile() ? 'trait-popup' : ''}
                  >
                    {showPopup ? (
                      <CreateTrait
                        traitData={traitData}
                        isSuccess={isSuccess}
                        onSubmit={(submitData: any) => {
                          handleSubmitDescription(submitData)
                          if (submitData?.type === 'description') {
                            setFieldValue('description', submitData.content)
                          } else if (submitData?.type === 'claim') {
                            setFieldValue('claim', submitData.content)
                          }
                        }}
                        onClose={() => {
                          setShowPopup(false)
                        }}
                      />
                    ) : null}
                  </BottomPopup>
                </div>
              </form>
            )
          }}
        </Formik>
        {isLoading ? (
          <div
            className={classNames(
              'loading-spinner-container mb-40 mt-40',
              isLoading ? 'show' : '',
            )}
          >
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="nft-detail-attr">
              {(traitsData?.length > 0 || nftStatus === NFT_STATUS.INITIAL) && (
                <div className="nft-detail-attr-title">
                  {t('special attributes')}
                </div>
              )}
              <Grid
                container
                spacing={2}
                style={{
                  justifyContent: traitsData?.length > 0 ? 'unset' : 'center',
                }}
              >
                {traitsData &&
                  traitsData.map((data: any, index: number) => (
                    <Grid item xs={6} sm={6} key={index}>
                      <TraitCard
                        id={data.id}
                        title={data.traittype}
                        desc={data.traitvalue}
                        editable={nftStatus === NFT_STATUS.INITIAL}
                        onEdit={handleTraitEdit}
                        onDelete={handleTraitDelete}
                      />
                    </Grid>
                  ))}
                {nftStatus === NFT_STATUS.INITIAL && (
                  <Grid item xs={6} sm={6} key={traitsData?.length}>
                    <TraitCard
                      id={''}
                      title={''}
                      desc={''}
                      editable={nftStatus === NFT_STATUS.INITIAL}
                      onEdit={handleTraitEdit}
                      onDelete={handleTraitDelete}
                    />
                  </Grid>
                )}
              </Grid>
            </div>
            <div className="nft-detail-claim">
              {!nftData?.claimtitle &&
              !nftData?.claim &&
              nftStatus > NFT_STATUS.INITIAL ? (
                ''
              ) : (
                <>
                  <div className="nft-detail-claim-title">{t('claim')}</div>
                  <ClaimCard
                    id={nftData?.id}
                    title={nftData?.claimtitle}
                    desc={nftData?.claim}
                    isClaim={true}
                    editable={nftStatus === NFT_STATUS.INITIAL}
                    onEdit={handleClaimEdit}
                    onDelete={handleClaimDelete}
                  />
                </>
              )}
            </div>
            {nftStatus === NFT_STATUS.INITIAL && (
              <div className="nft-detail-delete-btn">
                <DeleteForeverOutlinedIcon onClick={handleDelete} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default NftGalleryDetail
