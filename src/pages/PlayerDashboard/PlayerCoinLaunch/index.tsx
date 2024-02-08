import React, { useEffect, useState, useRef, createRef } from 'react'
import SubmitButton from '@components/Button/SubmitButton'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined'
import {
  checkLaunchStatus,
  fetchPassportImage,
  fetchPassportImageInit,
  getPlayerData,
  launchPlayerCoin,
  updatePlayerProfile,
  instaProfileRefetch,
  resetPlayerProfileMessage,
  resetInstaProfileRefetch,
  resetGoLive,
} from '@root/apis/playerCoins/playerCoinsSlice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
// import Cropper from 'react-cropper'
import Cropper, { ReactCropperElement } from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import Resizer from 'react-image-file-resizer'
import { IsDevelopment } from '@root/constants'
import toast from 'react-hot-toast'
import MaskIcon from '@assets/images/mask.png'
import MaskIconWhite from '@assets/images/maskWhite.png'
import MaskIconEnabled from '@assets/images/maskEnabled.png'
import MaskIconEnabledGold from '@assets/images/maskEnabledGold.png'
import MaskIconEnabledLadies from '@assets/images/maskEnabledPink.png'
import InstagramProfile from '@assets/icons/icon/InstagramProfile.svg'
import InstagramProfileBlack from '@assets/icons/icon/InstagramProfileBlack.svg'
import classNames from 'classnames'
import {
  getBrowserName,
  getCountryNameNew,
  getPlayerLevelName,
} from '@utils/helpers'
import ImageComponent from '@components/ImageComponent'
import {
  postCartoon,
  getCartoonizeStatus,
} from '@root/apis/onboarding/authenticationSlice'
import TooltipLabel from '@components/TooltipLabel'
import PlayerImageProfile from '@pages/Player/Profile/components/PlayerImageProfile'

let repeat: any = null
// const windowReference = window.open('')
const PlayerCoinLaunch: React.FC = () => {
  const currentBrowser = getBrowserName()
  const cropperRef = createRef<ReactCropperElement>()
  const theme = localStorage.getItem('theme')
  const intervalRef = useRef(null)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const isLaunchClicked = localStorage.getItem('ISLAUNCHCLICKED')
  const inputFile = useRef<HTMLInputElement>(null)
  const [nftMedia, setNFTMedia] = useState<any>()
  const [playerInfo, setPlayerInfo] = useState<any>()
  const [fileLoadStatus, setFileLoadStatus] = useState(false)
  const [cropStatus, setCropStatus] = useState(false)
  const [launchInitiated, setLaunchInitiated] = useState(false)
  const [imageValidationError, setImageValidationError] = useState('')
  const [imageWidth, setImageWidth] = useState(1)
  const [currentStep, setCurrentStep] = useState(1)

  const playerCoinData = useSelector((state: RootState) => state.playercoins)

  const [image, setImage] = useState('')
  const [cropper, setCropper] = useState<any>()

  const getCropData = async () => {
    const croppero = cropperRef.current?.cropper

    if (typeof croppero !== 'undefined') {
      if (nftMedia) {
        console.log({ nftMedia, croppero })
        const url = croppero.getCroppedCanvas().toDataURL()
        console.log({ url })
        const file = await dataUrlToFileUsingFetch(
          url,
          'output.webp',
          'image/png',
        )
        console.log({ file })
        let imageFile: any
        Resizer.imageFileResizer(
          file,
          400,
          400,
          'PNG',
          100,
          0,
          output => {
            console.log({ output })
            imageFile = output as File
            const formData = new FormData()
            formData.append('id', String(newPlayerId || allPlayersData[0]?.id))
            formData.append('playerpicture', imageFile)
            dispatch(updatePlayerProfile(formData))
            setFileLoadStatus(false)
            setImage('')
          },
          'file',
          800,
          800,
        )
      } else {
        setFileLoadStatus(true)
        setImage('')
      }
    }
    setImageWidth(1)
    setCropStatus(false)
  }

  const {
    isLaunching,
    isGetPlayerError,
    isUpdatePlayerProfileSuccess,
    isUpdatePlayerProfileError,
    playerData,
    passportimage,
    isFetchPassportImageSuccess,
    newPlayerId,
    allPlayersData,
    isLaunchPlayerCoinSuccess,
    isLaunchPlayerCoinError,
    isCheckLaunchStatusSuccess,
    launchStatus,
    instaProfileRefetchData,
    instaProfileRefetchDataSuccess,
    isinstaProfileRefetchError,
    isinstaProfileRefetchLoading,
    isInstaProfileLoading,
    defaultLoader,
    pictureUploadLoader,
  } = playerCoinData
  const {
    dateofbirth,
    email,
    mobilenumber,
    transfermarkt_link,
    givenname,
    nationality,
    surname,
  } = playerData
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    countriesData,
    selectedThemeRedux,
    cartoonSuccess,
    cartoonLoader,
    cartoonStatusLoader,
    cartoonStatusData,
  } = authenticationData

  useEffect(() => {
    if (allPlayersData && allPlayersData.length > 0) {
      setPlayerInfo(allPlayersData[0])
      if (allPlayersData[0]?.launch_initiated === true) {
        setLaunchInitiated(true)
        localStorage.setItem('ISLAUNCHCLICKED', 'true')
      } else if (allPlayersData[0]?.launch_initiated === false) {
        setLaunchInitiated(false)
        localStorage.removeItem('ISLAUNCHCLICKED')
      }
    }
  }, [allPlayersData])

  useEffect(() => {
    if (isUpdatePlayerProfileSuccess === 'success') {
      toast.success(t('profile picture updated successfully'))
      dispatch(resetPlayerProfileMessage())
    }
  }, [isUpdatePlayerProfileSuccess])

  useEffect(() => {
    if (instaProfileRefetchDataSuccess === true) {
      toast.success(instaProfileRefetchData)
      console.log('fetching_player_data16')
      dispatch(getPlayerData({ isInstaLoading: true }))
      dispatch(resetInstaProfileRefetch())
    }
    if (isinstaProfileRefetchError) {
      toast.error(isinstaProfileRefetchError)
    }
  }, [
    instaProfileRefetchDataSuccess,
    instaProfileRefetchData,
    isinstaProfileRefetchError,
  ])

  const onSetNFTFile = (e: any) => {
    try {
      setImageValidationError('')
      e.preventDefault()
      let files
      if (e.dataTransfer) {
        files = e.dataTransfer.files
      } else if (e.target) {
        files = e.target.files
      }
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result as any)
        const img = new Image() // Image constructor
        img.src = reader.result?.toString() ?? ''
        img.onload = () => {
          if (img.width === 0) {
            setImageWidth(200)
          } else {
            setImageWidth(img.width)
          }
        }
        img.onerror = () => {
          if (img.width === 0) {
            setImageWidth(200)
          } else {
            setImageWidth(img.width)
          }
        }
      }
      reader.readAsDataURL(files[0])
      if (files && files.length) {
        setNFTMedia(files[0])
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (imageWidth > 1) {
      setCropStatus(true)
    }
  }, [imageWidth])

  const handleFileInput = () => {
    try {
      setFileLoadStatus(false)
      if (inputFile.current) {
        inputFile.current.click()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleInstaRefetch = () => {
    if (playerInfo?.instagram) {
      dispatch(instaProfileRefetch({ id: playerInfo?.id }))
    } else {
      toast.error(t('please upload instagram profile url'))
    }
  }
  const handleCartoonToggle = () => {
    if (playerInfo?.cartoonfilter) {
      toast.error(t('Filter is mandatory'))
    } else {
      dispatch(postCartoon({ player_id: playerInfo?.id }))
    }
  }
  useEffect(() => {
    if (cartoonSuccess) {
      toast.success(cartoonSuccess)
      console.log('fetching_player_data17')
      dispatch(getPlayerData({}))
    }
  }, [cartoonSuccess])

  useEffect(() => {
    console.log({ playerInfo })
    clearInterval(intervalRef.current)
    if (allPlayersData[0]?.cartoonizing || playerInfo?.cartoonizing) {
      // Start the interval when the component mounts
      intervalRef.current = setInterval(() => {
        if (playerInfo?.id) {
          dispatch(getCartoonizeStatus({ player_id: playerInfo?.id }))
        }
      }, 5000) // Runs every 5 second (5000 milliseconds)
    }
  }, [playerInfo?.cartoonizing, allPlayersData[0]?.cartoonizing])

  useEffect(() => {
    if (
      playerInfo?.cartoonizing === false ||
      allPlayersData[0]?.cartoonizing === false ||
      cartoonStatusData === false
    ) {
      clearInterval(intervalRef.current)
      console.log('fetching_player_data18')
      dispatch(getPlayerData({}))
    }
  }, [
    playerInfo?.cartoonizing,
    cartoonStatusData,
    allPlayersData[0]?.cartoonizing,
  ])

  const dataUrlToFileUsingFetch = async (
    url: string,
    fileName: string,
    mimeType: string,
  ) => {
    const response = await fetch(url)
    const buffer = await response.arrayBuffer()

    return new File([buffer], fileName, { type: mimeType })
  }

  const handleSubmit = async () => {
    if (IsDevelopment) {
      if (nftMedia || playerCoinData?.allPlayersData[0]?.playerpicture) {
        console.log('clearINterval check status 1')
        clearInterval(repeat)
        dispatch(launchPlayerCoin())
      } else {
        setFileLoadStatus(true)
      }
    } else {
      toast.error(t('this feature is not yet enabled'))
    }
  }

  console.log({ playerInfo, allPlayersData })

  const checkPlayerDetail = () => {
    clearInterval(repeat)
    repeat = setInterval(() => {
      dispatch(checkLaunchStatus(allPlayersData[0]?.detailpageurl))
    }, 5000)
  }

  useEffect(() => {
    return () => {
      clearInterval(repeat)
      dispatch(resetGoLive())
      clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    console.log('clearINterval check status 2 documnet hidden')
    clearInterval(repeat)
    if (!document.hidden) {
      if (isLaunching || isLaunchClicked) {
        checkPlayerDetail()
      }
    }
  }, [document.hidden])

  useEffect(() => {
    if (isCheckLaunchStatusSuccess) {
      if (!launchStatus?.playercontract) {
        return
      }
      // else if (!launchStatus?.nftcontract) {
      //   setCurrentStep(2)
      // }
      else if (!launchStatus?.stakingcontract) {
        setCurrentStep(2)
      } else if (!launchStatus?.playeradmintx) {
        setCurrentStep(3)
      } else if (
        launchStatus?.playercontract &&
        launchStatus?.stakingcontract &&
        launchStatus?.playeradmintx
      ) {
        setCurrentStep(4)
      }
    }

    if (launchStatus?.launched) {
      console.log('clearINterval check status 3 launch staus succes')
      clearInterval(repeat)
      console.log('fetching_player_data19')
      dispatch(getPlayerData({}))
    }
  }, [isCheckLaunchStatusSuccess])

  useEffect(() => {
    if (nftMedia) {
      const objectUrl = URL.createObjectURL(nftMedia)
      return () => URL.revokeObjectURL(objectUrl)
    }
  }, [nftMedia])

  useEffect(() => {
    if (isLaunching || isLaunchClicked) {
      setLaunchInitiated(true)
      localStorage.setItem('ISLAUNCHCLICKED', 'true')
      checkPlayerDetail()
    }
  }, [isLaunching, isLaunchClicked])

  useEffect(() => {
    if (isGetPlayerError) {
      console.log('clearINterval check status 4 error')
      clearInterval(repeat)
    }
  }, [isGetPlayerError])

  useEffect(() => {
    window.scrollTo(0, 0)
    return () => {
      console.log('clearINterval check status 5 return demount')
      localStorage.removeItem('ISLAUNCHCLICKED')
      clearInterval(repeat)
    }
  }, [])

  const onSubmitHandler = () => {
    console.log('clearINterval check status 6 submit handler')
    clearInterval(repeat)
  }

  const handleShowImage = (evt: any) => {
    evt.preventDefault()
    dispatch(fetchPassportImage())
  }
  // var windowReference = window.open();

  // myService.getUrl().then(function(url) {
  //      windowReference.location = url;
  // });

  /*
    const base64ImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
    const contentType = 'image/png';

    const byteCharacters = atob(base64ImageData.substr(`data:${contentType};base64,`.length));
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, {type: contentType});
    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, '_blank');
  */

  const handleShowImageIos = (passportimage: any) => {
    try {
      const base64ImageData = `data:image/png;base64,${passportimage}`
      const contentType = 'image/png'

      const byteCharacters = atob(
        base64ImageData.substr(`data:${contentType};base64,`.length),
      )
      const byteArrays = []

      for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024)

        const byteNumbers = new Array(slice.length)
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }

        const byteArray = new Uint8Array(byteNumbers)

        byteArrays.push(byteArray)
      }
      const blob = new Blob(byteArrays, { type: contentType })
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      document.body.appendChild(a)
      // a.style = "display: none"
      a.setAttribute('style', 'display: none;')
      a.href = blobUrl
      a.download = 'MeCarreira_Passport_Image'
      a.click()
      document.body.removeChild(a)
    } catch (err) {
      console.log('base64err', err)
    }
  }

  useEffect(() => {
    if (isFetchPassportImageSuccess && passportimage) {
      dispatch(fetchPassportImageInit())
      if (currentBrowser !== 'Safari') {
        try {
          const image: any = new Image()
          image.src = 'data:image/jpg;base64,' + passportimage
          const w: any = window.open('')
          w.document.write(image.outerHTML)
        } catch (err) {
          console.log('opening_passport_img_err::', err)
        }
      } else {
        handleShowImageIos(passportimage)
      }
    }
  }, [isFetchPassportImageSuccess])

  return (
    <div className="fullwidth dlg-content player-coin-launch">
      {
        <>
          <div className="player-dashboard-title">
            {playerInfo?.playerpicture
              ? t('your player coin')
              : t('add profile picture and launch player coin')}
          </div>
          {!cropStatus && (
            <div className="player-avatar">
              <div
                className={`${
                  fileLoadStatus ? `icon-camera-error` : `icon-camera `
                }`}
                onClick={handleFileInput}
              >
                <CameraAltOutlinedIcon className="icon-camera-svg" />
                <input
                  id="media"
                  name="nftMedia"
                  // accept="image/*"
                  type="file"
                  autoComplete="off"
                  tabIndex={-1}
                  style={{ display: 'none' }}
                  ref={inputFile}
                  onChange={onSetNFTFile}
                />
              </div>
              {playerInfo?.instagram && (
                <div className="icon_insta" onClick={handleInstaRefetch}>
                  <ImageComponent
                    src={
                      selectedThemeRedux === 'Black'
                        ? InstagramProfileBlack
                        : InstagramProfile
                    }
                    width="23px"
                    height="23px"
                    alt="icon"
                  />
                </div>
              )}
              {playerInfo?.cartoonfilter ? (
                <TooltipLabel title={t('remove_cartoonize_player_profile')}>
                  <div className="mask_insta" onClick={handleCartoonToggle}>
                    <ImageComponent
                      src={
                        selectedThemeRedux === 'Black'
                          ? MaskIconWhite
                          : MaskIcon
                      }
                      width="23px"
                      height="23px"
                      alt="icon"
                    />
                  </div>
                </TooltipLabel>
              ) : (
                <TooltipLabel title={t('cartoonize_player_profile')}>
                  <div
                    className="mask_insta_enabled"
                    style={{
                      background:
                        theme === 'Ladies'
                          ? '#f5f5f5'
                          : theme === 'Light'
                          ? '#f5f5f5'
                          : '#222435',
                    }}
                    onClick={handleCartoonToggle}
                  >
                    <ImageComponent
                      src={
                        theme === 'Ladies'
                          ? MaskIconEnabledLadies
                          : theme === 'Gold'
                          ? MaskIconEnabledGold
                          : MaskIconEnabled
                      }
                      width="23px"
                      height="23px"
                      alt="icon"
                    />
                  </div>
                </TooltipLabel>
              )}
              {allPlayersData[0]?.playerpicture ? (
                <div>
                  {pictureUploadLoader ||
                  isinstaProfileRefetchLoading ||
                  isInstaProfileLoading ||
                  cartoonLoader ||
                  defaultLoader ? (
                    <div
                      className="player-avatar-root"
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <div className="loading-spinner">
                        <div className="spinner"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="player-avatar-root">
                      {/* <ImageComponent
                        src={allPlayersData[0]?.playerpicture}
                        alt=""
                        className="player-avatar-picture"
                      /> */}
                      <PlayerImageProfile
                        src={allPlayersData[0]?.playerpicture}
                        alt=""
                        className="player-avatar-picture"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <PersonOutlineIcon className="player-avatar-svg" />
              )}
            </div>
          )}
          {allPlayersData[0]?.cartoonizing || playerInfo?.cartoonizing ? (
            <div className="cartoonizing_loader_wrapper">
              <p className="fg-primary-color">{t('cartoonizing..')}</p>
              <div className={classNames('spinner size-small_cartoon')}></div>
            </div>
          ) : null}
          {imageValidationError && (
            <div className="input-feedback text-center mb-20">
              {imageValidationError}
            </div>
          )}
          {cropStatus && (
            <div className="cropper-container">
              <div style={{ width: '100%' }}>
                {/* <Cropper
                  // ref={cropperRef}
                  style={{ height: 400, width: '100%' }}
                  zoomTo={0.5}
                  initialAspectRatio={1}
                  preview=".img-preview"
                  src={image}
                  viewMode={1}
                  minCropBoxHeight={10}
                  minCropBoxWidth={10}
                  background={false}
                  responsive={true}
                  autoCropArea={1}
                  checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                  guides={true}
                  onInitialized={instance => {
                    setCropper(instance)
                  }}
                /> */}
                <Cropper
                  ref={cropperRef}
                  style={{ height: 400, width: '100%' }}
                  zoomTo={0}
                  initialAspectRatio={1 / 1}
                  preview=".img-preview"
                  src={image}
                  viewMode={1}
                  minCropBoxHeight={10}
                  minCropBoxWidth={10}
                  background={false}
                  responsive={true}
                  autoCropArea={1}
                  checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                  guides={true}
                />
              </div>
              <div className="button-line">
                <button className="form-submit-btn" onClick={getCropData}>
                  {t('upload')}
                </button>
              </div>
            </div>
          )}
          <div className="coin-details">
            <div className="input-label">{t('player level')}</div>
            <div
              className={classnames(
                'input-label fg-primary-color mb-20',
                getPlayerLevelName(playerInfo?.playerlevelid) === 'Diamond'
                  ? 'player_level_diamond'
                  : getPlayerLevelName(playerInfo?.playerlevelid) === 'Gold'
                  ? 'player_level_gold'
                  : getPlayerLevelName(playerInfo?.playerlevelid) === 'Silver'
                  ? 'player_level_silver'
                  : getPlayerLevelName(playerInfo?.playerlevelid) === 'Bronze'
                  ? 'player_level_bronze'
                  : '',
              )}
            >
              {getPlayerLevelName(playerInfo?.playerlevelid)}
            </div>
            <div className="input-label">{t('player name')}</div>
            <div className="input-label text-primary-color mb-20 uppercase">
              {playerInfo ? playerInfo?.name + ' ' : givenname + ' ' + surname}
            </div>
            <div className="input-label">{t('date of Birth')}</div>
            <div className="input-label text-primary-color mb-20">
              {playerInfo
                ? playerInfo.dateofbirth.replaceAll('-', '.')
                : dateofbirth?.replaceAll('-', '.')}
            </div>
            <div className="input-label">{t('email address (not shared)')}</div>
            <div className="input-label text-primary-color mb-20">
              {playerInfo ? playerInfo.email : email}
            </div>
            <div className="input-label">
              {t('mobile phone number (not shared)')}
            </div>
            <div className="input-label text-primary-color mb-20">
              {playerInfo ? playerInfo?.mobilenumber : mobilenumber}
            </div>
            <div className="input-label">{t('nationality')}</div>
            <div className="input-label text-primary-color mb-20">
              {/* {playerInfo
                ? playerInfo?.nationality?.countryname
                : countriesData[nationality]?.countryname || '--'} */}
              {getCountryNameNew(
                playerInfo?.country_id || playerInfo?.nationality_id,
              )}
            </div>
            <div className="input-label">
              {t('passport image (not shared)')}
            </div>
            <div className="mb-20">
              <a
                className="input-label text-primary-color"
                href="#"
                onClick={evt => handleShowImage(evt)}
                // target="_blank"
              >
                {t('click here to open')}
              </a>
            </div>
            {playerInfo?.instagram && playerInfo?.instagram !== 'undefined' && (
              <>
                <div className="input-label">{t('instagram link')}</div>
                <a
                  className="text-primary-color"
                  href={
                    (playerInfo.instagram.includes('https') ? '' : 'https://') +
                    playerInfo.instagram
                  }
                  target="_blank"
                >
                  <p className="input-label player-value text-primary-color mt-0 mb-20 transferMarkt-link">
                    {playerInfo ? playerInfo?.instagram : null}
                  </p>
                </a>
              </>
            )}
            {(playerInfo?.transfermarkt_link || transfermarkt_link) &&
              playerInfo?.transfermarkt_link !== 'undefined' && (
                <>
                  <div className="input-label">{t('transfermarkt link')}</div>
                  <a
                    className="text-primary-color"
                    href={
                      (playerInfo.transfermarkt_link.includes('https')
                        ? ''
                        : 'https://') + playerInfo.transfermarkt_link
                    }
                    target="_blank"
                  >
                    <p className="input-label player-value text-primary-color mt-0 mb-20 transferMarkt-link">
                      {playerInfo
                        ? playerInfo?.transfermarkt_link
                        : transfermarkt_link}
                    </p>
                  </a>
                </>
              )}
          </div>
          {fileLoadStatus ? (
            <div className="player-dashboard-error red-color">
              {t('please add a profile picture to continue')}
            </div>
          ) : isUpdatePlayerProfileError ? (
            <div className="player-dashboard-error red-color">
              {isUpdatePlayerProfileError}
            </div>
          ) : null}
          {console.log({
            isLaunchPlayerCoinSuccess,
            launchInitiated,
            isLaunchClicked,
          })}
          {isLaunchPlayerCoinSuccess || launchInitiated || isLaunchClicked ? (
            <>
              {isLaunchPlayerCoinError ? (
                <div
                  className="input-feedback text-center create-player-error"
                  style={{ width: '100%' }}
                >
                  {isLaunchPlayerCoinError}
                </div>
              ) : (
                <div
                  className={classnames(
                    'spinner-container launch-step-spinner',
                    'show',
                  )}
                >
                  <div className="new-draft-title mt-0">
                    {t('your contracts are being saved')}
                  </div>
                  <span className="mt-10">
                    {t('launching')}... {currentStep}/4
                  </span>
                  <div className="spinner mt-20"></div>
                </div>
              )}
            </>
          ) : playerInfo?.player_launch_setting === 2 ? (
            <SubmitButton
              title={t('launch player coin')}
              onPress={handleSubmit}
              className={classnames('launch-btn')}
            />
          ) : (
            <>
              <div className="new-draft-title mb-20">
                {t('launching_settings_desc_0_1')}
              </div>
              <SubmitButton
                title={t('launch player coin')}
                // onPress={handleSubmit}
                className={classnames('launch-btn')}
                isDisabled={true}
              />
            </>
          )}
          {playerInfo?.playerstatusid?.playerstatusname === 'Cancelled' ? (
            <div className="input-feedback text-center mb-20">
              {t('your coin was rejected')}
            </div>
          ) : null}
          <SubmitButton
            isDisabled={false}
            title={t('okay')}
            className={classnames(
              'form-submit-btn mt-20 m-0auto status-check-btn',
              playerInfo?.playerstatusid?.playerstatusname === 'Cancelled'
                ? ''
                : 'hidden',
            )}
            onPress={onSubmitHandler}
          />
        </>
      }
    </div>
  )
}

export default PlayerCoinLaunch
