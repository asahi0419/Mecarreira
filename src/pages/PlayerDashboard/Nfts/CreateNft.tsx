import SubmitButton from '@components/Button/SubmitButton'
import { useTranslation } from 'react-i18next'
import { useEffect, useRef, useState } from 'react'
import { monthSet } from '@root/constants'
import { getCircleColor, getDeliveryMode, isMobile } from '@utils/helpers'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Web3BottomPopup from '@components/Dialog/Web3BottomPopup'
import DialogBox from '@components/Dialog/DialogBox'
import { fetchNFTData } from '@root/apis/gallery/gallerySlice'
import classNames from 'classnames'
import toast from 'react-hot-toast'
import EditIcon from '@assets/images/edit.webp'
import {
  createAuction,
  createKioskItem,
  editKioskItem,
  createRaffle,
  getBlockdeadline,
  mintNft,
  resetBlockdeadline,
  switchItemToEdit,
  showCreteKioskItemForm,
} from '@root/apis/playerCoins/playerCoinsSlice'
import ApiBottomPopup from '@components/Dialog/ApiBottomPopup'
import FormInput from '@components/Form/FormInput'
import FormTextArea from '@components/Form/FormTextArea'
import ObjectPlaceHolder from '@assets/images/option.webp'
import { getPlayerKioskList } from '@root/apis/onboarding/authenticationSlice'
import PlayerImage from '@components/PlayerImage'
import { Radio } from '@mui/material'
import ImageComponent from '@components/ImageComponent'
import { useWalletHelper } from '@utils/WalletHelper'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AliceCarousel from 'react-alice-carousel'
import leftArrow from '@assets/images/left_angle_bracket.webp'
import rightArrow from '@assets/images/right_angle_bracket.webp'
import 'react-alice-carousel/lib/alice-carousel.css'
import '@assets/css/components/Carousel.css'

const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const NFT_TYPE = {
  AUCTION: '1',
  RAFFLE: '2',
  MINT: '3',
}
const today = new Date()
const targetDate = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate(),
)
interface Years {
  id: number
  value: number
  title: number
}

const initialValues = {
  daySelected: '',
  monthSelected: '',
  yearSelected: '',
  nftType: '',
}

const kioskItemInitialValues = {
  nftMedia: null,
  price: 1,
  item_name: '',
  item_description: '',
  available_qty: '0',
}

interface Props {
  nftImg: any
  nftId?: any
  onOpenGallery: () => any
  onSuccess: () => any
  customClass?: string
  usageMode?: string
  toEdit?: any
  selectShopCategories?: any
}

const maxNumber = 250
const CreateNft: React.FC<Props> = ({
  nftImg,
  nftId,
  onOpenGallery,
  onSuccess,
  customClass = '',
  usageMode = '',
  selectShopCategories,
  toEdit = null,
}) => {
  const myPlayerContract = localStorage.getItem('playercontract')
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const inputFile = useRef<HTMLInputElement>(null)
  const [nftMedia, setNFTMedia] = useState<any>()
  const [pictureFile, setPictureFile] = useState<any>()
  const [nftType, setNftType] = useState<any>()

  const [yearSet, setYearSet] = useState<Years[]>([])
  const [daysSet, setDaysSet] = useState<Years[]>([])
  const [txnError, setTxnError] = useState('')
  const [txnHash, setTxnHash] = useState('')
  const [isRaffleInitiated, setIsRaffleInitiated] = useState(false)
  const [showBottomPopup, setShowBottomPopup] = useState(false)
  const [selectedImages, setSelectedImages] = useState<any>([])
  const fileInputRef = useRef(null)

  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const {
    apiTxnHash = txnHash,
    selectedThemeRedux,
    itemCategoriesListData,
    KioskItemDetail,
  } = authenticationData

  const playerCoinData: any = useSelector(
    (state: RootState) => state.playercoins,
  )

  const {
    selectedPlayer,
    stakingcontract,
    stakingcontractabi,
    player1contract,
    player1contractabi,
    isGetBlockdeadlineSuccess,
    blockdeadline,
    createKioskLoading,
    createKioskSuccess,
    allPlayersData,
    getPlayerDetailsSuccessData,
    mycoinNftsData,
  } = playerCoinData

  const { nftData } = useSelector((state: RootState) => state.gallery)

  const [items, setItems] = useState([])

  const responsiveItemDefault = {
    0: {
      items: 1,
    },
  }

  const minLength = 1
  const [hovered, setHovered] = useState(false)

  const walletAddress = useSelector(
    (state: RootState) => state.authentication.walletAddress,
  )

  const { callWeb3Method } = useWalletHelper()

  const bidderList = [
    {
      id: NFT_TYPE.AUCTION,
      name: t('highest Bidder'),
    },
    {
      id: NFT_TYPE.RAFFLE,
      name: t('lucky Winner'),
    },
    {
      id: NFT_TYPE.MINT,
      name: t('myself'),
    },
  ]

  useEffect(() => {
    window.scrollTo(0, 0)
    setDate(targetDate)
    setYears(50)
  }, [])

  useEffect(() => {
    setPictureFile(nftImg)
  }, [nftImg])

  const handleKioskCreateSuccess = () => {
    toast.success(t('saved'))
    dispatch(getPlayerKioskList(myPlayerContract))
  }
  useEffect(() => {
    if (createKioskSuccess) {
      handleKioskCreateSuccess()
    }
    if (createKioskSuccess === 'success') {
      dispatch(showCreteKioskItemForm({ show: false }))
    }
  }, [createKioskSuccess])

  useEffect(() => {
    if (usageMode !== 'kiosk') {
      nftId && dispatch(fetchNFTData({ id: nftId }))
    }
  }, [nftId])

  function setDate(date: any) {
    setDays(date.getMonth())
  }

  function setDays(monthIndex: number) {
    const optionCount = 0
    const daysCount = daysInMonth[monthIndex]
    const daysArr: any[] = []
    if (optionCount < daysCount) {
      for (let i = optionCount; i < daysCount; i++) {
        daysArr.push({
          id: i + 1,
          value: i + 1,
          title: i + 1,
        })
      }
      setDaysSet(daysArr)
    }
  }

  function setYears(val: number) {
    const year = targetDate.getFullYear()
    const yearArr: any[] = []
    for (let i = 0; i < val; i++) {
      yearArr.push({
        id: i + 1,
        value: year + i,
        title: year + i,
      })
    }
    setYearSet(yearArr)
  }

  const validate = (values: any) => {
    const errors: any = {}
    if (
      new Date(
        values.yearSelected +
          '-' +
          (parseInt(values.monthSelected) + 1) +
          '-' +
          values.daySelected,
      ).getTime() < new Date().getTime()
    ) {
      errors.yearSelected = t('the closing bidding date')
    }
    if (
      new Date(
        values.yearSelected +
          '-' +
          (parseInt(values.monthSelected) + 1) +
          '-' +
          values.daySelected,
      ).getTime() > new Date(new Date().getTime() + 86400000 * 30).getTime()
    ) {
      errors.yearSelected = t('end date must be less')
    }
    if (nftData?.statusid.id !== 2 && usageMode !== 'kiosk') {
      errors.nftType = t('please select public nft picture.')
    }
    return errors
  }

  const handleMonthChange = (evt: any) => {
    setDays(evt.target.value)
  }

  const onSetNFTFile = ({
    currentTarget: { files, name },
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (files && files.length && name === 'nftMedia') setNFTMedia(files[0])
  }

  const handleSelect = (e: any) => {
    setNftType(e?.target?.value)
  }

  const handleClose = () => {
    setShowBottomPopup(false)
    setTxnError('')
    if (txnHash || apiTxnHash) {
      onSuccess()
    }
    setTxnHash('')
    onSuccess()
  }

  useEffect(() => {
    if (nftMedia) {
      const objectUrl = URL.createObjectURL(nftMedia)
      setPictureFile(objectUrl)
      return () => URL.revokeObjectURL(objectUrl)
    }
  }, [nftMedia])

  useEffect(() => {
    console.log({ mycoinNftsData })
    if (mycoinNftsData.length > 0) {
      const isRaffle = mycoinNftsData.findIndex(nft => nft.nfttype === 'raffle')
      console.log({ isRaffle })
      if (isRaffle > -1) {
        setIsRaffleInitiated(true)
      }
    }
  }, [mycoinNftsData])

  const handleNftCreate = (values: any) => {
    // if (!stakingcontract) {
    //   return
    // }
    if (values?.nftType === '2' && isRaffleInitiated) {
      toast.error(t('cannot create a raffle'))
    } else {
      if (nftType === NFT_TYPE.MINT) {
        setShowBottomPopup(true)
        if (localStorage.getItem('loginId')) {
          return
        }
        const promise = callWeb3Method(
          'mintToPlayer',
          player1contract,
          player1contractabi,
          [localStorage.getItem('loginInfo'), 1, nftData?.tokenurl],
        )
        promise
          .then((txn: any) => {
            setTxnHash(txn.hash)
          })
          .catch((err: any) => {
            const isErrorGasEstimation = `${err}`.includes(
              'cannot estimate gas',
            )
            if (err.message === '406') {
              setTxnError(
                t('this functionality unavailable for internal users'),
              )
            }
            if (isErrorGasEstimation) {
              setTxnError(
                t('not enough funds to pay for blockchain transaction'),
              )
            } else {
              setTxnError(err.reason || err.message)
            }
          })
      } else {
        dispatch(
          getBlockdeadline(
            values.yearSelected +
              '-' +
              (parseInt(values.monthSelected) + 1) +
              '-' +
              values.daySelected,
          ),
        )
      }
    }
  }

  const handleCreateNftApi = (user_secret: any) => {
    const formData = new FormData()
    formData.append('tokenuri', nftData?.tokenurl)
    formData.append('user_secret', user_secret)
    formData.append('contract', selectedPlayer?.playercontract)
    if (nftType === NFT_TYPE.AUCTION) {
      formData.append('token_amount', '1')
      formData.append('min_bid', '1')
      formData.append('endblock', blockdeadline)
      dispatch(createAuction(formData))
    } else if (nftType === NFT_TYPE.RAFFLE) {
      formData.append('token_amount', '1')
      formData.append('endblock', blockdeadline)
      dispatch(createRaffle(formData))
    } else {
      formData.append('address', walletAddress)
      formData.append('amount', '1')
      dispatch(mintNft(formData))
    }
  }

  useEffect(() => {
    if (isGetBlockdeadlineSuccess) {
      dispatch(resetBlockdeadline())
      setShowBottomPopup(true)
      if (localStorage.getItem('loginId')) {
        return
      }
      const promise = callWeb3Method(
        nftType === NFT_TYPE.AUCTION ? 'createAuction' : 'createRaffle',
        stakingcontract,
        stakingcontractabi,
        nftType === NFT_TYPE.AUCTION
          ? [1, blockdeadline, 1, nftData?.tokenurl]
          : [blockdeadline, 1, nftData?.tokenurl],
      )
      promise
        .then((txn: any) => {
          setTxnHash(txn.hash)
        })
        .catch((err: any) => {
          const isErrorGasEstimation = `${err}`.includes('cannot estimate gas')
          if (err.message === '406') {
            setTxnError(t('this functionality unavailable for internal users'))
          }
          if (isErrorGasEstimation) {
            setTxnError(t('not enough funds to pay for blockchain transaction'))
          } else {
            setTxnError(err.reason || err.message)
          }
        })
    }
  }, [isGetBlockdeadlineSuccess])
  const modeD = getDeliveryMode(toEdit?.delivery_mode)
  const [deliveryMode, setDeliveryMode] = useState(modeD || 'postal')
  const [requiresBuyerInformation, setRequiresBuyerInformation] = useState(
    !!toEdit?.buyerinstructions,
  )
  const handleDeliveryMode = mode => {
    if (mode === 'postal') {
      setDeliveryMode('postal')
    } else {
      setDeliveryMode('digital')
    }
  }
  const handleCreateItem = (values: any) => {
    if (!toEdit?.isOpenOnly) {
      const formData = new FormData()
      if (selectedImages.length > 0) {
        console.log('selectedImagesupload', selectedImages)
        // formData.append('itemPicture', selectedImages)
        // const tempImage = JSON.stringify(selectedImages)
        for (let i = 0; i < selectedImages.length; i++) {
          formData.append(`itemPicture${i}`, selectedImages[i])
        }
      }
      // formData.append('itemName', values.item_name)
      formData.append(
        'kioskItemCategoryId',
        itemCategoriesListData[selectShopCategories]?.id,
      )
      formData.append('additionalDescription', values.item_description)
      formData.append('player_contract', selectedPlayer?.playercontract)
      formData.append('itemPrice', values.price)
      formData.append('itemInventory', values.available_qty)
      // formData.append('delivery_mode', deliveryMode)
      if (values.buyerInstructions && requiresBuyerInformation) {
        formData.append('buyerInstructions', values.buyerInstructions)
      }
      if (toEdit) {
        formData.append('itemId', toEdit?.itemid)
      }
      if (toEdit) {
        dispatch(editKioskItem(formData))
      } else {
        for (const value of formData.values()) {
          console.log(value)
        }
        dispatch(createKioskItem(formData))
      }
    } else {
      console.log('pps')
      const formData = new FormData()
      formData.append('itemId', toEdit?.itemid)
      formData.append('isDeleted', 'True')
      dispatch(editKioskItem(formData))
    }
  }

  const handleUploadImage = () => {
    try {
      if (inputFile.current) {
        inputFile.current.click()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getInitialValues = () => {
    if (usageMode === 'kiosk') {
      if (toEdit) {
        return {
          ...kioskItemInitialValues,
          price: toEdit?.itemprice || '',
          item_name: toEdit?.itemname || '',
          item_description: toEdit?.itemdescription || '',
          available_qty: toEdit?.actualinventory || '',
          buyerInstructions: toEdit?.buyerinstructions || '',
        }
      }
      return kioskItemInitialValues
    }
    return initialValues
  }

  const getItemImage = () => {
    if (nftMedia) {
      return URL.createObjectURL(nftMedia)
    } else if (toEdit) {
      return toEdit?.itempicturethumb
    } else {
      return ObjectPlaceHolder
    }
  }

  const handleEditItem = async (event: any) => {
    event.stopPropagation()
    const toEditNow = toEdit
    delete toEditNow.isOpenOnly
    await dispatch(switchItemToEdit({ data: toEditNow }))
  }

  const MAX_FILE_SIZE = 102400 //100KB

  const validFileExtensions = {
    image: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'],
  }

  function isValidFileType(fileName, fileType) {
    return (
      fileName &&
      validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1
    )
  }

  const handleCloseForm = async () => {
    dispatch(showCreteKioskItemForm({ show: false }))
  }

  const handleImageChange = event => {
    const files = event.target.files
    const newImages = Array.from(files)
    // Check if adding the new images exceeds the limit (5)
    if (selectedImages.length + newImages.length <= 5) {
      setSelectedImages([...selectedImages, ...newImages])
    } else {
      // Display an error message or take appropriate action
      toast.error(t('Cannot add more than 5 images'))
    }
  }

  const handleImageRemove = indexToRemove => {
    const updatedImages = selectedImages.filter(
      (_, index) => index !== indexToRemove,
    )
    console.log('updateImage', updatedImages)
    setSelectedImages(updatedImages)
  }

  const handleCustomButtonClick = () => {
    // Trigger the hidden file input
    fileInputRef.current.click()
  }

  useEffect(() => {
    if (selectedImages.length > 0) {
      console.log('selectedImages', selectedImages)
      setItems(
        selectedImages.map((image, index) => (
          <div
            key={index}
            className="nft-image-cover"
            style={{ position: 'relative' }}
          >
            <img
              src={
                typeof selectedImages[index] === 'String'
                  ? image
                  : URL.createObjectURL(image)
              }
              alt={`Selected ${index + 1}`}
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
              }}
            />
            <div className="image_remove_btn_wrapper">
              <DeleteForeverIcon
                onClick={() => handleImageRemove(index)}
                style={{
                  color: '#f54f4f',
                  cursor: 'pointer',
                  width: '60px',
                  height: '60px',
                }}
              />
            </div>
          </div>
        )),
      )
    }
  }, [selectedImages])

  useEffect(() => {
    if (KioskItemDetail?.additionalImages?.length > 0) {
      console.log(
        'KioskItemDetail?.additionalImages',
        KioskItemDetail?.additionalImages,
      )
      setItems(
        KioskItemDetail?.additionalImages.map((image, index) => (
          <div
            key={index}
            className="nft-image-cover"
            style={{ position: 'relative' }}
          >
            <img
              src={image}
              alt={`Selected ${index + 1}`}
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
              }}
            />
            {!toEdit?.isOpenOnly && index !== 0 && (
              <div className="image_remove_btn_wrapper">
                <DeleteForeverIcon
                  onClick={() => handleImageRemove(index)}
                  style={{
                    color: '#f54f4f',
                    cursor: 'pointer',
                    width: '60px',
                    height: '60px',
                  }}
                />
              </div>
            )}
          </div>
        )),
      )
      // setSelectedImages(KioskItemDetail?.additionalImages)
    }
  }, [KioskItemDetail?.additionalImages])

  return (
    <>
      {showBottomPopup && (
        <DialogBox
          isOpen={showBottomPopup}
          onClose={handleClose}
          contentClass="onboarding-popup"
        >
          <div className="nft-tab-title pt-50">{t('please wait')}...</div>
          {localStorage.getItem('loginInfo') ? (
            <Web3BottomPopup
              showPopup={showBottomPopup}
              txnHash={txnHash}
              txnErr={txnError}
              onClose={handleClose}
            />
          ) : (
            <ApiBottomPopup
              showPopup={showBottomPopup}
              onSubmit={handleCreateNftApi}
              onClose={handleClose}
              customClass="purchase-pc-bottomwrapper"
            />
          )}
        </DialogBox>
      )}
      <Formik
        initialValues={getInitialValues()}
        onSubmit={(values: any) =>
          usageMode === 'kiosk'
            ? handleCreateItem(values)
            : handleNftCreate(values)
        }
        validate={validate}
        validationSchema={Yup.object().shape(
          usageMode === 'kiosk' && !toEdit
            ? {
                nftMedia: Yup.mixed()
                  .required('Image Required')
                  .test('is-valid-type', 'Not a valid image type', value =>
                    isValidFileType(value && value.name.toLowerCase(), 'image'),
                  ),
                // .test(
                //   'is-valid-size',
                //   'Max allowed size is 100KB',
                //   value => value && value.size <= MAX_FILE_SIZE,
                // ),
                price: Yup.number()
                  .min(0.1, 'Price must be at least 0.1')
                  .required(t('field is required and only non-decimal number')),
                // item_name: Yup.string().required(t('field is required')),
                item_description: Yup.string().required(t('field is required')),
                available_qty: Yup.number()
                  .min(1, 'Available quantity must be at least 1')
                  .required(t('field is required')),
                buyerInstructions: requiresBuyerInformation
                  ? Yup.string().required(t('field is required'))
                  : null,
              }
            : usageMode === 'kiosk' && toEdit
            ? {
                price: Yup.number()
                  .required(t('field is required and only non-decimal number'))
                  .min(0.1, 'Price must be at least 0.1'),
                item_name: Yup.string().required(t('field is required')),
                item_description: Yup.string().required(t('field is required')),
                available_qty: Yup.number()
                  .min(1, 'Available quantity must be at least 1')
                  .required(t('field is required')),
                buyerInstructions: requiresBuyerInformation
                  ? Yup.string().required(t('field is required'))
                  : null,
              }
            : {
                nftType: Yup.string().required(t('field is required')),
                daySelected: Yup.lazy(() => {
                  if (nftType === NFT_TYPE.MINT) {
                    return Yup.mixed().notRequired()
                  }
                  return Yup.string().required(t('date is required'))
                }),
                monthSelected: Yup.lazy(() => {
                  if (nftType === NFT_TYPE.MINT) {
                    return Yup.mixed().notRequired()
                  }
                  return Yup.string().required(t('month is required'))
                }),
                yearSelected: Yup.lazy(() => {
                  if (nftType === NFT_TYPE.MINT) {
                    return Yup.mixed().notRequired()
                  }
                  return Yup.string().required(t('year is required'))
                }),
              },
        )}
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
          const [currentNumber, setCurrentNumber] = useState(
            values.detail ? maxNumber - values.detail.length : maxNumber,
          )
          return (
            <form
              autoComplete="off"
              onSubmit={handleSubmit}
              className={customClass}
            >
              <div
                className={classNames(
                  'createnft-fileload',
                  nftMedia || pictureFile ? 'no-border' : '',
                  usageMode === 'kiosk' ? 'createitem-fileload' : '',
                  usageMode === 'kiosk' && isMobile()
                    ? 'createnft-fileload-kiosk'
                    : '',
                  toEdit?.isOpenOnly && usageMode === 'kiosk' ? 'w-none' : '',
                )}
              >
                {toEdit?.isOpenOnly && usageMode === 'kiosk' ? (
                  <div
                    className="edit-box"
                    style={{
                      top: '0px',
                      cursor: 'pointer',
                      borderRadius:
                        toEdit?.isOpenOnly && usageMode === 'kiosk'
                          ? '0 0px 0px 10px'
                          : '0 10px',
                    }}
                    onClick={(event: any) => handleEditItem(event)}
                  >
                    <ImageComponent loading="lazy" src={EditIcon} alt="" />
                  </div>
                ) : null}
                {usageMode === 'kiosk' ? (
                  <input
                    type="file"
                    name="nftMedia"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={event => {
                      setFieldValue('nftMedia', event.currentTarget.files[0])
                      onSetNFTFile(event)
                      handleImageChange(event)
                    }}
                    // onChange={handleImageChange}
                  />
                ) : (
                  <input
                    id="media"
                    name="nftMedia"
                    accept="image/*"
                    type="file"
                    autoComplete="off"
                    tabIndex={-1}
                    style={{ display: 'none' }}
                    ref={inputFile}
                    // onChange={onSetNFTFile}
                    onChange={event => {
                      setFieldValue('nftMedia', event.currentTarget.files[0])
                      onSetNFTFile(event)
                    }}
                  />
                )}

                {usageMode === 'kiosk' ? (
                  <div
                    className={classNames(
                      'player-avatar-root',
                      !nftMedia && !toEdit?.itempicturethumb
                        ? 'kiosk-item-default-avatar'
                        : '',
                    )}
                  >
                    {/* <ImageComponent
                      src={getItemImage()}
                      alt="image"
                      // className="player-avatar-picture"
                    /> */}
                    {selectedImages.length > 0 || items?.length > 0 ? (
                      <div
                        className={classNames(
                          'circle-carousel kiosk',
                          items.length <= 3 ? 'center-carousel' : 'carousel',
                        )}
                        onMouseOver={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                      >
                        <AliceCarousel
                          infinite={items.length > minLength}
                          mouseTracking
                          items={items}
                          disableButtonsControls={false}
                          keyboardNavigation={true}
                          responsive={responsiveItemDefault}
                          // autoPlayInterval={5000}
                          // infinite
                          // autoPlay={items.length > minLength}
                          // activeIndex={activeIndex}
                          renderPrevButton={() => {
                            return items.length > minLength &&
                              (isMobile() || hovered) ? (
                              <div style={{ opacity: 0.6, transition: '0.5s' }}>
                                <ImageComponent
                                  src={leftArrow}
                                  alt=""
                                  className="img-radius carousel-arrow"
                                  style={{ margin: '2px 5px 2px 0' }}
                                />
                              </div>
                            ) : (
                              <div style={{ opacity: 0, transition: '0.5s' }}>
                                <ImageComponent
                                  src={leftArrow}
                                  alt=""
                                  className="img-radius carousel-arrow"
                                  style={{ margin: '2px 5px 2px 0' }}
                                />
                              </div>
                            )
                          }}
                          renderNextButton={() => {
                            return items.length > minLength &&
                              (isMobile() || hovered) ? (
                              <div style={{ opacity: 0.6, transition: '0.5s' }}>
                                <ImageComponent
                                  src={rightArrow}
                                  alt=""
                                  className="img-radius carousel-arrow"
                                  style={{ margin: '2px 3px 2px 2px' }}
                                />
                              </div>
                            ) : (
                              <div style={{ opacity: 0, transition: '0.5s' }}>
                                <ImageComponent
                                  src={rightArrow}
                                  alt=""
                                  className="img-radius carousel-arrow"
                                  style={{ margin: '2px 3px 2px 2px' }}
                                />
                              </div>
                            )
                          }}
                          // onSlideChanged={handleSlideChange}
                        />
                      </div>
                    ) : (
                      // <ImageComponent
                      //   src={
                      //     itemCategoriesListData[selectShopCategories]
                      //       ?.defaultImage
                      //   }
                      //   alt="image"
                      //   // className="player-avatar-picture"
                      // />
                      <div
                        className="nft-image-cover"
                        style={{ position: 'relative' }}
                      >
                        <img
                          src={
                            itemCategoriesListData[selectShopCategories]
                              ?.defaultImage
                          }
                          alt={`SelectedDefault`}
                          style={{
                            width: '100%',
                            height: '400px',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {nftMedia || pictureFile ? (
                      <div className="player-avatar-root">
                        <ImageComponent
                          src={
                            pictureFile
                              ? pictureFile
                              : URL.createObjectURL(nftMedia)
                          }
                          alt="image"
                          className="player-avatar-picture"
                        />
                      </div>
                    ) : (
                      <div
                        className="createnft-fileload-description"
                        onClick={onOpenGallery}
                      >
                        {t('load from Gallery')}
                      </div>
                    )}
                  </>
                )}
                {usageMode === 'kiosk' ? (
                  <div className="upload-kioskitem-wrapper">
                    <div
                      className={classNames(
                        'change-secret-otp-wrapper',
                        toEdit?.isOpenOnly ? 'item-admin-open' : '',
                      )}
                    >
                      <div className="percentage_value_wrapper">
                        {toEdit?.isOpenOnly ? (
                          <div className="currency_mark_wrapper kiosk-item-flag-buyItem kiosk-item-img">
                            <div
                              className="currency_mark_img"
                              style={{
                                background: getCircleColor(
                                  getPlayerDetailsSuccessData?.playerlevelid,
                                ),
                              }}
                            >
                              <PlayerImage
                                src={allPlayersData[0]?.playerpicturethumb}
                                className="img-radius_kiosk currency_mark"
                              />
                            </div>
                            <div>
                              {toEdit?.itemprice}
                              <span>
                                {' '}
                                {getPlayerDetailsSuccessData?.ticker ||
                                  allPlayersData[0]?.ticker}
                              </span>
                            </div>
                          </div>
                        ) : null}
                      </div>
                      {!toEdit?.isOpenOnly ? (
                        <div
                          className="form-submit-btn m-0"
                          onClick={
                            usageMode === 'kiosk'
                              ? handleCustomButtonClick
                              : handleUploadImage
                          }
                        >
                          {toEdit ? t('change image') : t('upload image')}
                        </div>
                      ) : (
                        ''
                      )}
                    </div>
                    {/* {console.log({ errors, values })} */}
                    {errors.nftMedia && touched.nftMedia && (
                      <div className="input-feedback">
                        {errors.nftMedia.toString()}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
              {usageMode === 'kiosk' ? (
                <div className="wrapper_flex_col_center">
                  <Select
                    value={selectShopCategories.toString()}
                    onChange={() => {
                      console.log('')
                    }}
                    disabled
                    inputProps={{ 'aria-label': 'Without label' }}
                    sx={{
                      color: 'var(--primary-foreground-color)',
                      width: '300px',
                      '&:before': {
                        borderColor: 'orange',
                      },
                      '&:after': {
                        borderColor: 'green',
                      },
                    }}
                    style={{
                      color: 'white !important',
                      fontWeight: 'bold !important',
                    }}
                  >
                    {itemCategoriesListData?.map((el, ind) => (
                      <MenuItem value={ind}>{el?.itemName}</MenuItem>
                    ))}
                  </Select>
                  <div className="radio_delivery_wrapper">
                    <div className="radio_label_wrapper">
                      <Radio
                        sx={{
                          color: 'var(--primary-foreground-color)',
                          '&.Mui-checked': {
                            color: toEdit?.isOpenOnly
                              ? 'grey'
                              : 'var(--primary-foreground-color)',
                          },
                          width: '25px',
                          height: '25px',
                        }}
                        checked={
                          itemCategoriesListData[selectShopCategories]
                            ?.deliveryType === 1
                            ? true
                            : false
                        }
                        disabled={toEdit?.isOpenOnly || true}
                        onChange={() => {
                          handleDeliveryMode('postal')
                        }}
                      />
                      <p>{t('postal_delivery')}</p>
                    </div>
                    <div className="radio_label_wrapper">
                      <Radio
                        sx={{
                          color: 'var(--primary-foreground-color)',
                          '&.Mui-checked': {
                            color: toEdit?.isOpenOnly
                              ? 'grey'
                              : 'var(--primary-foreground-color)',
                          },
                          width: '25px',
                          height: '25px',
                        }}
                        checked={
                          itemCategoriesListData[selectShopCategories]
                            ?.deliveryType === 2
                            ? true
                            : false
                        }
                        disabled={toEdit?.isOpenOnly || true}
                        onChange={() => {
                          handleDeliveryMode('digital')
                        }}
                      />
                      <p>{t('digital_delivery')}</p>
                    </div>
                  </div>
                </div>
              ) : null}
              {(nftMedia || pictureFile) && usageMode !== 'kiosk' ? (
                <div className="createnft-fileload-btn" onClick={onOpenGallery}>
                  {t('go back to gallery')}
                </div>
              ) : (
                <></>
              )}
              {usageMode !== 'kiosk' ? (
                <div className="createnft-input-container">
                  <div className="createnft-input-item">
                    <div className="input-label mb-10">{t('who gets it')}</div>
                    <div className="player-dashboard-select">
                      <select
                        id="select-day"
                        className="dob-select"
                        value={values.nftType}
                        name="nftType"
                        onChange={(event: any) => {
                          handleChange(event)
                          handleSelect(event)
                        }}
                        onBlur={handleBlur}
                      >
                        <option>Select</option>
                        {bidderList.map(({ id, name }) => (
                          <option key={id} value={id}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.nftType && touched.nftType && (
                      <div className="input-feedback">
                        {errors.nftType.toString()}
                      </div>
                    )}
                  </div>
                  {nftType !== NFT_TYPE.MINT && (
                    <div className="createpoll-input-item">
                      <div className="input-label">{t('bidding end date')}</div>
                      <div className="birthday" style={{ marginTop: '6px' }}>
                        <select
                          id="select-day"
                          className="dob-select"
                          value={values.daySelected}
                          name="daySelected"
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <option>DD</option>
                          {daysSet.map(({ value, title }, index) => (
                            <option key={index} value={value}>
                              {title}
                            </option>
                          ))}
                        </select>
                        <select
                          id="select-month"
                          className="dob-select"
                          value={values.monthSelected}
                          name="monthSelected"
                          onChange={(event: any) => {
                            handleChange(event)
                            handleMonthChange(event)
                          }}
                          onBlur={handleBlur}
                        >
                          <option>MM</option>
                          {monthSet.map(({ value, title }, index) => (
                            <option key={index} value={value}>
                              {title}
                            </option>
                          ))}
                        </select>
                        <select
                          id="select-year"
                          className="dob-select"
                          value={values.yearSelected}
                          name="yearSelected"
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <option>YYYY</option>
                          {yearSet.map(({ value, title }, index) => (
                            <option key={index} value={value}>
                              {title}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors.daySelected && touched.daySelected && (
                        <div className="input-feedback">
                          {errors.daySelected.toString()}
                        </div>
                      )}
                      {errors.monthSelected && touched.monthSelected && (
                        <div className="input-feedback">
                          {errors.monthSelected.toString()}
                        </div>
                      )}
                      {errors.yearSelected && touched.yearSelected && (
                        <div className="input-feedback">
                          {errors.yearSelected.toString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="createnft-input-container edit-item-form">
                  {toEdit?.isOpenOnly ? (
                    <>
                      <div className="createnft-input-item">
                        {/* <div
                          className="nft-title text-primary-color"
                          style={{
                            fontSize: '21px',
                          }}
                        >
                          {toEdit?.itemname}
                        </div> */}
                      </div>
                      <div className="createnft-input-item">
                        <div className="input-label mb-10">
                          {t('general_description')}
                        </div>
                        <div className="textinput-wrapper shop_categories_desc_unset">
                          {KioskItemDetail?.itemDescription}
                        </div>
                      </div>
                      <div className="createnft-input-item">
                        <div className="input-label mb-10">
                          {t('additional_description')}
                        </div>
                        <div className="textinput-wrapper shop_categories_desc_unset">
                          {KioskItemDetail?.additionalDescription}
                        </div>
                      </div>
                      {/* <div className="createnft-input-item">
                        <div className="player-dashboard-select">
                          <div
                            className={classNames('textinput-wrapper')}
                            style={{
                              height: '150px',
                              overflowY: 'auto',
                              padding: '10px',
                              justifyContent: 'flex-start',
                              flexDirection: 'column',
                              alignItems: 'flex-start',
                            }}
                          >
                            <div className={classNames('item-description')}>
                              {toEdit?.itemdescription}
                            </div>
                          </div>
                        </div>
                      </div> */}

                      <div className="createnft-input-item mb-0">
                        <div className="input-label mb-10">
                          {t('extra information from buyer required')}
                        </div>
                      </div>
                      <div className="radio_delivery_wrapper flex-centerz">
                        <div className="radio_label_wrapper">
                          <Radio
                            sx={{
                              color: 'var(--primary-foreground-color)',
                              '&.Mui-checked': {
                                color: toEdit?.isOpenOnly
                                  ? 'grey'
                                  : 'var(--primary-foreground-color)',
                              },
                              width: '25px',
                              height: '25px',
                            }}
                            checked={requiresBuyerInformation}
                            disabled={toEdit?.isOpenOnly}
                            onChange={() => setRequiresBuyerInformation(true)}
                          />
                          <p>{t('yes')}</p>
                        </div>
                        <div className="radio_label_wrapper">
                          <Radio
                            sx={{
                              color: 'var(--primary-foreground-color)',
                              '&.Mui-checked': {
                                color: toEdit?.isOpenOnly
                                  ? 'grey'
                                  : 'var(--primary-foreground-color)',
                              },
                              width: '25px',
                              height: '25px',
                            }}
                            checked={!requiresBuyerInformation}
                            disabled={toEdit?.isOpenOnly}
                            onChange={() => setRequiresBuyerInformation(false)}
                          />
                          <p>{t('no')}</p>
                        </div>
                      </div>
                      {requiresBuyerInformation && (
                        <div className="createnft-input-item">
                          <div className="input-label mb-10">
                            {t('describe what information you need from buyer')}
                          </div>
                          <div className="player-dashboard-select">
                            <FormTextArea
                              id="buyerInstructions"
                              type="text"
                              placeholder={t('enter item buyer instructions')}
                              name="buyerInstructions"
                              value={values.buyerInstructions}
                              handleChange={(e: any) => {
                                const length = e.target.value.length
                                setCurrentNumber(maxNumber - length)
                                handleChange(e)
                              }}
                              disabled={toEdit?.isOpenOnly}
                              onBlur={handleBlur}
                              containerClass={classNames('description-box')}
                            />
                          </div>
                          {(errors.buyerInstructions ||
                            values?.buyerInstructions?.length === 0) && (
                            <div className="input-feedback">
                              {errors?.buyerInstructions?.toString()}
                            </div>
                          )}
                          {currentNumber < 251 && currentNumber >= 0 && (
                            <div className="characters_left">
                              {t('characters left')}: {currentNumber}
                            </div>
                          )}
                        </div>
                      )}
                      <div>
                        <div className="player_reward_percentage_wrapper kiosk-item-available">
                          <div className="input-label">{t('available')}:</div>
                          <div className="percentage_value_wrapper">
                            {toEdit?.actualinventory}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="createnft-input-item">
                        <div className="input-label mb-10">
                          {t('general_description')}
                        </div>
                        <div className="textinput-wrapper shop_categories_desc_unset">
                          {
                            itemCategoriesListData[selectShopCategories]
                              ?.itemDescription
                          }
                        </div>
                      </div>
                      <div className="createnft-input-item">
                        <div className="input-label mb-10">
                          {t('additional_description')}
                        </div>
                        <div className="player-dashboard-select">
                          <FormTextArea
                            id="itemdescripition"
                            type="text"
                            placeholder={t('enter additional description')}
                            name="item_description"
                            value={values.item_description}
                            handleChange={handleChange}
                            onBlur={handleBlur}
                            containerClass={classNames('description-box')}
                          />
                        </div>
                        {errors.item_description &&
                          touched.item_description && (
                            <div className="input-feedback">
                              {errors.item_description.toString()}
                            </div>
                          )}
                      </div>

                      <div className="createnft-input-item">
                        <div className="input-label mb-10">{t('price')}</div>
                        <div className="player-dashboard-select">
                          <div className="price-ticker-wrapper">
                            <input
                              className="new_percentage_value"
                              style={{ width: '95px' }}
                              name="price"
                              id="price"
                              type="number"
                              value={values.price}
                              placeholder={t('price')}
                              // onChange={e => {
                              //   if (Number(e.target.value) < 1) {
                              //     handleChange(e)
                              //     errors.price = 'Price must be at least 1'
                              //   } else {
                              //     handleChange(e)
                              //   }
                              // }}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <span>{selectedPlayer?.ticker}</span>
                          </div>
                        </div>
                        {errors.price && touched.price && (
                          <div className="input-feedback">
                            {errors.price.toString()}
                          </div>
                        )}
                      </div>

                      <div className="createnft-input-item mb-0">
                        <div className="input-label mb-10">
                          {t('extra information from buyer required')}
                        </div>
                      </div>
                      <div className="radio_delivery_wrapper flex-center">
                        <div className="radio_label_wrapper">
                          <Radio
                            sx={{
                              color: 'var(--primary-foreground-color)',
                              '&.Mui-checked': {
                                color: toEdit?.isOpenOnly
                                  ? 'grey'
                                  : 'var(--primary-foreground-color)',
                              },
                              width: '25px',
                              height: '25px',
                            }}
                            checked={requiresBuyerInformation}
                            disabled={toEdit?.isOpenOnly}
                            onChange={() => setRequiresBuyerInformation(true)}
                          />
                          <p>{t('yes')}</p>
                        </div>
                        <div className="radio_label_wrapper">
                          <Radio
                            sx={{
                              color: 'var(--primary-foreground-color)',
                              '&.Mui-checked': {
                                color: toEdit?.isOpenOnly
                                  ? 'grey'
                                  : 'var(--primary-foreground-color)',
                              },
                              width: '25px',
                              height: '25px',
                            }}
                            checked={!requiresBuyerInformation}
                            disabled={toEdit?.isOpenOnly}
                            onChange={() => setRequiresBuyerInformation(false)}
                          />
                          <p>{t('no')}</p>
                        </div>
                      </div>
                      {requiresBuyerInformation && (
                        <div className="createnft-input-item">
                          <div className="input-label mb-10">
                            {t('describe what information you need from buyer')}
                          </div>
                          <div className="player-dashboard-select">
                            <FormTextArea
                              id="buyerInstructions"
                              type="text"
                              placeholder={t('enter item buyer instructions')}
                              name="buyerInstructions"
                              value={values.buyerInstructions}
                              handleChange={(e: any) => {
                                const length = e.target.value.length
                                setCurrentNumber(maxNumber - length)
                                handleChange(e)
                              }}
                              onBlur={handleBlur}
                              containerClass={classNames('description-box')}
                            />
                          </div>
                          {(errors.buyerInstructions ||
                            values?.buyerInstructions?.length === 0) && (
                            <div className="input-feedback">
                              {errors?.buyerInstructions?.toString()}
                            </div>
                          )}
                          {currentNumber < 251 && currentNumber >= 0 && (
                            <div className="characters_left">
                              {t('characters left')}: {currentNumber}
                            </div>
                          )}
                        </div>
                      )}

                      <div>
                        <div className="player_reward_percentage_wrapper kiosk-item-available">
                          <div className="input-label">{t('available')}</div>
                          <div className="percentage_value_wrapper">
                            <input
                              style={{ width: '70px' }}
                              className="new_percentage_value"
                              type="number"
                              name="available_qty"
                              id="available_qty"
                              value={values.available_qty}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </div>
                        </div>
                        {errors.available_qty && touched.available_qty && (
                          <div className="input-feedback">
                            {errors.available_qty.toString()}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
              {!toEdit?.isOpenOnly ? (
                <>
                  {createKioskSuccess ? (
                    <div
                      className="close-button-draftee m-0 text-center mt-40"
                      style={{ marginLeft: '120px' }}
                      onClick={() => handleCloseForm()}
                    >
                      {t('close')}
                    </div>
                  ) : (
                    <SubmitButton
                      isDisabled={false}
                      title={
                        usageMode === 'kiosk' ? t('save') : t('create NFT')
                      }
                      className="createnft-createbtn"
                      onPress={handleSubmit}
                      isLoading={
                        usageMode === 'kiosk' ? createKioskLoading : ''
                      }
                    />
                  )}
                  <div style={{ height: '30px' }}></div>
                </>
              ) : (
                <SubmitButton
                  isDisabled={false}
                  title={t('delete')}
                  className="createnft-createbtn delete-btn"
                  onPress={handleSubmit}
                  isLoading={usageMode === 'kiosk' ? createKioskLoading : ''}
                />
              )}
            </form>
          )
        }}
      </Formik>
    </>
  )
}

export default CreateNft
