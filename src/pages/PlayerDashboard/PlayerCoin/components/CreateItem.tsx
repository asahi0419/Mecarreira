import SubmitButton from '@components/Button/SubmitButton'
import { useTranslation } from 'react-i18next'
import { useEffect, useRef, useState } from 'react'
import { monthSet, NON_EMPTY_REGEX } from '@root/constants'
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
import {
  deleteKioskImage,
  getKioskItemDetail,
  getPlayerKioskList,
  resetDeleteKioskImage,
} from '@root/apis/onboarding/authenticationSlice'
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
  item_name: '  ',
  additionalDescription: '',
  available_qty: '0',
}

interface Props {
  newItemStep?: number
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
const CreateItem: React.FC<Props> = ({
  newItemStep,
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
  const [remainingUploads, setRemainingUploads] = useState<number>(5)
  const [pictureFile, setPictureFile] = useState<any>()
  const [nftType, setNftType] = useState<any>()
  const [errMsg, setErrMsg] = useState<string>('')
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
    isGetKioskItemDetailSuccess,
    deleteKioskImageData,
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
    isCreateKioskItemFormVisible,
    createKioskError,
  } = playerCoinData

  const { nftData } = useSelector((state: RootState) => state.gallery)

  const [items, setItems] = useState([])

  useEffect(() => {
    if (isCreateKioskItemFormVisible === false) {
      setItems([])
      selectedImages([])
      dispatch(resetDeleteKioskImage())
    }
  }, [isCreateKioskItemFormVisible])

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
      setSelectedImages([])
      dispatch(showCreteKioskItemForm({ show: false }))
    }
  }, [createKioskSuccess])

  useEffect(() => {
    if (deleteKioskImageData?.additionalImages?.length > -1) {
      toast.success(t('image deleted'))
      dispatch(getKioskItemDetail(KioskItemDetail?.itemId))
    }
  }, [deleteKioskImageData])

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
    // Check for trailing whitespaces in each field
    // if (key === 'additionalDescription') {
    Object.keys(values).forEach(key => {
      if (key === 'additionalDescription') {
        const value = values[key]
        if (typeof value === 'string' && value !== '' && value.trim() === '') {
          errors[key] = 'Required'
        }
      }
    })
    // }
    // if (nftData?.statusid.id !== 2 && usageMode !== 'kiosk') {
    //   errors.nftType = t('please select public nft picture.')
    // }
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

  const handleDeleteItem = () => {
    try {
      console.log('hdi_caled', toEdit)
      const formData = new FormData()
      formData.append('itemId', toEdit?.itemid)
      formData.append('isDeleted', 'True')
      dispatch(editKioskItem(formData))
    } catch (err) {
      console.error('err', err)
    }
  }
  const handleCreateItem = (values: any) => {
    setErrMsg('')
    console.log('HCI_called', selectedImages)
    try {
      if (!toEdit?.isOpenOnly) {
        const formData = new FormData()
        const selectedImagesTemp = []
        if (selectedImages.length > 0) {
          console.log('selectedImagesupload', selectedImages)
          console.log({ selectedImagesTemp })
          for (let i = 0; i < selectedImages.length; i++) {
            if (selectedImages[i] instanceof File) {
              selectedImagesTemp.push(selectedImages[i])
            }
          }
          console.log({ selectedImagesTemp })
          for (let i = 0; i < selectedImagesTemp.length; i++) {
            formData.append(`itemPicture${i}`, selectedImagesTemp[i])
          }
        }
        // formData.append('itemName', values.item_name)
        if (!toEdit) {
          formData.append(
            'kioskItemCategoryId',
            itemCategoriesListData[selectShopCategories]?.id,
          )
        }
        formData.append('additionalDescription', values.additionalDescription)
        formData.append('player_contract', selectedPlayer?.playercontract)
        formData.append('itemPrice', values.price)
        formData.append('itemInventory', values.available_qty)
        // newitemstep 0 : fix price, 2:auction, 3: random draw
        const salesMethod = `${
          newItemStep === 0 ? 0 : newItemStep === 2 ? 1 : 2
        }`
        formData.append('salesMethod', salesMethod)
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
            console.log('creating_first', value)
          }
          for (const key of formData.keys()) {
            console.log('creating_first1', key)
          }
          console.log('kopl', formData.has('itemPicture0'))
          if (
            formData.has('itemPicture0') ||
            formData.has('itemPicture1') ||
            formData.has('itemPicture2') ||
            formData.has('itemPicture3') ||
            formData.has('itemPicture4')
          ) {
            dispatch(createKioskItem(formData))
          } else {
            setErrMsg('Image Required')
          }
        }
      } else {
        const formData = new FormData()
        formData.append('itemId', toEdit?.itemid)
        formData.append('isDeleted', 'True')
        dispatch(editKioskItem(formData))
      }
    } catch (err) {
      console.log({ err })
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
    if (toEdit) {
      return {
        ...kioskItemInitialValues,
        price: toEdit?.itemprice || '',
        item_name: toEdit?.itemname || '',
        additionalDescription:
          KioskItemDetail?.additionalDescription ||
          toEdit?.additionalDescription ||
          toEdit?.additionaldescription ||
          '',
        available_qty: toEdit?.actualinventory || '',
        buyerInstructions: toEdit?.buyerinstructions || '',
      }
    }
    return kioskItemInitialValues
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

  console.log({ remainingUploads })

  const handleImageChange = event => {
    const imgSet = selectedImages || KioskItemDetail?.additionalImages || []
    const imgSetTemp = [...imgSet]
    imgSetTemp.shift()
    console.log({ imgSetTemp, imgSet, selectedImages })
    ////
    const files = event.target.files
    const newImages = Array.from(files)
    if (newImages.length > 0) {
      // Check if adding the new images exceeds the limit (5)
      const previousImages = KioskItemDetail?.additionalImages
        ? KioskItemDetail?.additionalImages?.length - 1
        : 0
      // const remainingUploads = 5 - previousImages
      // if (selectedImages.length + newImages.length <= 6 - previousImages) {
      if (newImages.length <= remainingUploads) {
        // if (selectedImages.length <= 6) {
        setSelectedImages([...selectedImages, ...newImages])
        setRemainingUploads(remainingUploads - newImages.length)
      } else {
        // Display an error message or take appropriate action
        const msg = `${t('cannot add more than')} ${remainingUploads} images`
        toast.error(msg)
      }
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
    if (itemCategoriesListData.length > 0) {
      const temp = [...selectedImages]
      // itemCategoriesListData.forEach(element => {
      //   temp.push(element.defaultImage)
      // })
      temp.push(itemCategoriesListData[selectShopCategories]?.defaultImage)
      console.log({ temp })
      setSelectedImages(temp)
    }
  }, [itemCategoriesListData])

  useEffect(() => {
    if (selectedImages.length > 0) {
      // return
      setItems(
        selectedImages.map((image, index) => (
          <div
            key={index}
            className="nft-image-cover"
            style={{ position: 'relative' }}
          >
            <img
              src={
                typeof selectedImages[index] === 'string'
                  ? image
                  : URL.createObjectURL(image)
              }
              // src={
              //   'https://playerkiosks.s3.amazonaws.com/default_kiosk/email_thumb_art.png'
              // }
              alt={`Selected ${index + 1}`}
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
              }}
            />
            {index > 0 && !toEdit?.isOpenOnly && (
              <div className="image_remove_btn_wrapper">
                <DeleteForeverIcon
                  // onClick={() => handleImageRemove(index)}
                  onClick={() => handleImageDelete(image)}
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
    }
  }, [selectedImages])

  const handleImageDelete = image => {
    // const imgSet = selectedImages || KioskItemDetail?.additionalImages || []
    // const imgSetTemp = [...imgSet]
    // imgSetTemp.shift()
    // console.log({ imgSetTemp, imgSet, selectedImages })
    // ////
    // const files = event.target.files
    // const newImages = [] //Array.from(files)
    // // Check if adding the new images exceeds the limit (5)
    // const previousImages = KioskItemDetail?.additionalImages
    //   ? KioskItemDetail?.additionalImages?.length - 1
    //   : 0
    // // const remainingUploads = 5 - previousImages
    // console.log({
    //   selectedImages,
    //   newImages,
    //   previousImages,
    //   remainingUploads,
    // })
    // return
    if (KioskItemDetail.length < 1) {
      const deleteeIndex = selectedImages.findIndex(
        item => item.name === image.name,
      )
      const temps = [...selectedImages]
      temps.splice(deleteeIndex, 1)
      setSelectedImages(temps)
      setRemainingUploads(remainingUploads + 1)
    } else {
      const formData = new FormData()
      formData.append('itemId', KioskItemDetail?.itemId)
      formData.append('deletedPictures', [image])
      dispatch(deleteKioskImage(formData))
    }
  }

  useEffect(() => {
    if (
      KioskItemDetail?.additionalImages?.length > 0 &&
      isGetKioskItemDetailSuccess
    ) {
      // setItems(
      //   KioskItemDetail?.additionalImages.map((image, index) => (
      //     <div
      //       key={index}
      //       className="nft-image-cover"
      //       style={{ position: 'relative' }}
      //     >
      //       <img
      //         src={image}
      //         alt={`Selected ${index + 1}`}
      //         style={{
      //           width: '100%',
      //           height: '400px',
      //           objectFit: 'cover',
      //         }}
      //       />
      //       {!toEdit?.isOpenOnly && index !== 0 && (
      //         <div className="image_remove_btn_wrapper">
      //           <DeleteForeverIcon
      //             onClick={() => handleImageDelete(image)}
      //             style={{
      //               color: '#f54f4f',
      //               cursor: 'pointer',
      //               width: '60px',
      //               height: '60px',
      //             }}
      //           />
      //         </div>
      //       )}
      //     </div>
      //   )),
      // )
      const tempusSans = [...KioskItemDetail?.additionalImages]
      tempusSans.shift()
      console.log('KIDA', tempusSans)
      setSelectedImages(KioskItemDetail?.additionalImages)
      setRemainingUploads(remainingUploads - tempusSans?.length)
    }
  }, [KioskItemDetail?.additionalImages, isGetKioskItemDetailSuccess])

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
        onSubmit={(values: any) => handleCreateItem(values)}
        validate={validate}
        validationSchema={Yup.object().shape(
          !toEdit
            ? {
                nftMedia: Yup.mixed()
                  .required('images required')
                  .test('is-valid-type', t('not a valid image type'), value =>
                    isValidFileType(value && value.name.toLowerCase(), 'image'),
                  ),
                // .test(
                //   'is-valid-size',
                //   'Max allowed size is 100KB',
                //   value => value && value.size <= MAX_FILE_SIZE,
                // ),
                price: Yup.number()
                  .min(0.1, `${t('price must be at least')} 0.1`)
                  .required(t('field is required and only non-decimal number')),
                // item_name: Yup.string().required(t('field is required')),
                additionalDescription: Yup.string().required(
                  t('field is required'),
                ),
                available_qty: Yup.number()
                  .min(1, `${t('available quantity min')} 1`)
                  .required(t('field is required')),
                buyerInstructions: requiresBuyerInformation
                  ? Yup.string().required(t('field is required'))
                  : null,
                daySelected: Yup.string().required(t('date is required')),
                monthSelected: Yup.string().required(t('month is required')),
                yearSelected: Yup.string().required(t('year is required')),
              }
            : {
                price: Yup.number()
                  .required(t('field is required and only non-decimal number'))
                  .min(0.1, `${t('price must be at least')} 0.1`),
                // item_name: Yup.string().required(t('field is required')),
                additionalDescription: Yup.string().required(
                  t('field is required'),
                ),
                available_qty: Yup.number()
                  .min(1, `${t('available quantity min')} 1`)
                  .required(t('field is required')),
                buyerInstructions: requiresBuyerInformation
                  ? Yup.string().required(t('field is required'))
                  : null,
                daySelected: Yup.string().required(t('date is required')),
                monthSelected: Yup.string().required(t('month is required')),
                yearSelected: Yup.string().required(t('year is required')),
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
                  'createnft-fileload',
                  isMobile() ? 'createnft-fileload-kiosk' : '',
                  toEdit?.isOpenOnly ? 'w-none' : '',
                )}
              >
                {/* {toEdit?.isOpenOnly ? (
                  <div
                    className="edit-box"
                    style={{
                      top: '0px',
                      cursor: 'pointer',
                      borderRadius: toEdit?.isOpenOnly
                        ? '0 0px 0px 10px'
                        : '0 10px',
                    }}
                    onClick={(event: any) => handleEditItem(event)}
                  >
                    <ImageComponent loading="lazy" src={EditIcon} alt="" />
                  </div>
                ) : null} */}
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

                <div
                  className={classNames(
                    'player-avatar-root item-avatar',
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
                        isMobile()
                          ? 'circle-carousel-mob'
                          : 'circle-carousel kiosk',
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
                    {!toEdit?.isOpenOnly && selectedImages.length < 6 ? (
                      <div
                        className="form-submit-btn m-0"
                        style={{
                          width: isMobile() ? '' : '200px',
                          // display:
                          //   KioskItemDetail?.additionalImages?.length === 6
                          //     ? 'none'
                          //     : '',
                        }}
                        onClick={handleCustomButtonClick}
                      >
                        {/* {toEdit ? t('change image') : t('upload image')} */}
                        {t('upload more images')}
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                  {/* {errors.nftMedia && touched.nftMedia && (
                    <div className="input-feedback">
                      {errors.nftMedia.toString()}dfklsdf
                    </div>
                  )} */}
                </div>
              </div>
              {errors.nftMedia && touched.nftMedia && (
                <div
                  className="input-feedback"
                  style={{
                    margin: `-30px 0 10px ${isMobile() ? 37 : 20}px`,
                  }}
                >
                  {errors.nftMedia.toString()}
                </div>
              )}
              <div className="wrapper_flex_col_center">
                <Select
                  className="match-worn-shirt"
                  value={
                    KioskItemDetail?.kioskItemCategoryId
                      ? KioskItemDetail?.kioskItemCategoryId - 1
                      : selectShopCategories.toString()
                  }
                  onChange={() => {
                    console.log('')
                  }}
                  disabled
                  inputProps={{ 'aria-label': 'Without label' }}
                  sx={{
                    color: 'var(--primary-foreground-color)',
                    borderRadius: '4px',
                    border: '1px solid',
                    // backgroundColor: 'var(--third-background-color)',
                  }}
                  style={{
                    color: 'var(--primary-foreground-color)',
                    borderRadius: '4px',
                    border: '1px solid',
                    // backgroundColor: 'var(--third-background-color)',
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
                      <div className="player_reward_percentage_wrapper">
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
                          id="additionalDescription"
                          type="text"
                          placeholder={t('enter additional description')}
                          name="additionalDescription"
                          value={values.additionalDescription}
                          handleChange={handleChange}
                          onBlur={handleBlur}
                          containerClass={classNames('description-box')}
                        />
                      </div>
                      {errors.additionalDescription &&
                        touched.additionalDescription && (
                          <div className="input-feedback">
                            {errors.additionalDescription.toString()}
                          </div>
                        )}
                    </div>
                    <div className="createpoll-input-item">
                      <div className="input-label">
                        {newItemStep === 0 ? (
                          <span>{t('vote closes on')}</span>
                        ) : newItemStep === 2 ? (
                          <span>
                            {t('Auction finishes on (max 0 days from now)')}
                          </span>
                        ) : (
                          <span>{t('Open until (max 30 days from now)')}</span>
                        )}
                      </div>
                      {newItemStep !== 0 && (
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
                      )}
                      {errors.daySelected && touched.daySelected && (
                        <div className="input-feedback">
                          {errors.daySelected}
                        </div>
                      )}
                      {errors.yearSelected && touched.yearSelected && (
                        <div className="input-feedback">
                          {errors.monthSelected}
                        </div>
                      )}
                      {errors.yearSelected && touched.yearSelected && (
                        <div className="input-feedback">
                          {errors.yearSelected}
                        </div>
                      )}
                    </div>
                    {newItemStep === 0 && (
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
                    )}
                    {newItemStep === 2 && (
                      <div className="createnft-input-item">
                        <div className="input-label mb-10">
                          {t('Minimum Bid')}
                        </div>
                        <div className="player-dashboard-select">
                          <div className="price-ticker-wrapper">
                            <input
                              className="new_percentage_value"
                              style={{ width: '95px' }}
                              name="price"
                              id="price"
                              type="number"
                              value={values.price}
                              placeholder={t('Minimum Bid')}
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
                            <span>PHDE</span>
                          </div>
                        </div>
                        {errors.price && touched.price && (
                          <div className="input-feedback">
                            {errors.price.toString()}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="createnft-input-item mb-0">
                      <div className="input-label mb-10">
                        {t('extra information from buyer required')}
                      </div>
                    </div>
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
                      <div className="player_reward_percentage_wrapper">
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
              {errMsg ? (
                <div
                  className="input-feedback"
                  style={{
                    marginTop: '20px',
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  {errMsg}
                </div>
              ) : null}
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
                        newItemStep === 0
                          ? t('save')
                          : newItemStep === 2
                          ? t('start auction')
                          : t('start draw')
                      }
                      className="createnft-createbtn"
                      onPress={handleSubmit}
                      isLoading={createKioskLoading}
                    />
                  )}
                  <div style={{ height: '30px' }}></div>
                </>
              ) : (
                <SubmitButton
                  isDisabled={false}
                  title={t('delete')}
                  className="createnft-createbtn delete-btn"
                  onPress={handleDeleteItem}
                  isLoading={createKioskLoading}
                />
              )}
              {createKioskError && (
                <div className="input-feedback">{createKioskError}</div>
              )}
            </form>
          )
        }}
      </Formik>
    </>
  )
}

export default CreateItem
