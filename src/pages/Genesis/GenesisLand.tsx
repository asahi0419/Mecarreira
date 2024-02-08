import React, { useEffect, useState } from 'react'
import MaticIcon from '@assets/images/matic-token-icon.webp'
import { useTranslation } from 'react-i18next'
import FormInput from '@components/Form/FormInput'
import HoverVideoPlayer from 'react-hover-video-player'
import ImageComponent from '@components/ImageComponent'
import toast from 'react-hot-toast'
import HotToaster from '@components/HotToaster'
import { useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { useWalletHelper } from '@utils/WalletHelper'
import { ethers } from 'ethers'
import classNames from 'classnames'
import Spinner from '@components/Spinner'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import { usePrivy, useWallets } from '@privy-io/react-auth'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

interface Props {
  isFirst: boolean
  onMint: any
}
const GenesisLand: React.FC<Props> = ({ isFirst, onMint }) => {
  const authenticationData: any = useSelector(
    (state: RootState) => state.authentication,
  )
  const { genesisGoLiveTimestamp, centralNftContract, centralNftContractAbi } =
    authenticationData

  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const { genesisSaleDetailData } = playerCoinData

  const { t } = useTranslation()
  const [quantity, setQuantity] = useState(0)
  const [showCountdown, setShowCountdown] = useState(false)
  const [mintingPhase, setMintingPhase] = useState(1)
  const [mintTimestamp, setMintTimestamp] = useState(0)
  const [maxMint, setMaxMint] = useState(0)
  const [price, setPrice] = useState(10)
  const [showMintCard, setShowMintCard] = useState(false)
  const [isWhitelisted1, setIsWhitelisted1] = useState(false)
  const [isWhitelisted2, setIsWhitelisted2] = useState(false)
  const [isMintDisabled, setIsMintDisabled] = useState(true)
  const [mintBalance, setMintBalance] = useState(0)
  const [whitelist, setWhitelist] = useState(0)

  const loginInfo = localStorage.getItem('loginInfo')
  const wallet = localStorage.getItem('wallet')

  const { getWeb3Provider, getBalance } = useWalletHelper()
  const { wallets } = useWallets()
  const [privyReady, setPrivyReady] = useState(false)

  const checkMintable = async () => {
    try {
      const provider = await getWeb3Provider()
      const generalContract = new ethers.Contract(
        centralNftContract, // contract address of Router
        centralNftContractAbi,
        provider.getSigner(loginInfo!), // signer of the currently logged in user wallet address
      )
      // console.log(centralNftContract, centralNftContractAbi)
      let result = await generalContract.gGetIsWhiteList(1)
      console.log('for test gGetIsWhiteList(1)', result)
      setIsWhitelisted1(result)

      result = await generalContract.gGetIsWhiteList(2)
      console.log('for test gGetIsWhiteList(2)', result)
      setIsWhitelisted2(result)

      if (genesisSaleDetailData.genesissalestate > 0) {
        const balance = await generalContract.gGetMints()
        console.log('for test gGetMints', Number(balance))
        setMintBalance(Number(balance))

        if (
          quantity === 0 ||
          (whitelist === 1 && !isWhitelisted1) ||
          (whitelist === 2 && !isWhitelisted2)
        ) {
          console.log(
            'for test checkMintable',
            { quantity },
            { balance: Number(balance) },
            { maxMint },
            { whitelist },
            { isWhitelisted1 },
            { isWhitelisted2 },
          )
          setIsMintDisabled(true)
        } else {
          setIsMintDisabled(false)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    console.log('for test privy wallets', wallets)
    const embeddedWallet = wallets.find(
      wallet => wallet.walletClientType === 'privy',
    )
    if (embeddedWallet) {
      setPrivyReady(true)
    }
  }, [wallets])

  useEffect(() => {
    if (genesisSaleDetailData) {
      console.log('for test genesisSaleDetailData', genesisSaleDetailData)
      if (loginInfo && centralNftContract) {
        if (wallet !== 'Privy' || privyReady) {
          checkMintable()
        }
      }
      if (genesisSaleDetailData.genesissalestate > 0) {
        setMintingPhase(genesisSaleDetailData.genesissalestate)
        setMaxMint(genesisSaleDetailData.maxmint)
        setPrice(genesisSaleDetailData.price)
        setMintTimestamp(genesisSaleDetailData.mintphasecountdown)
        setWhitelist(genesisSaleDetailData.whitelist)
        setShowMintCard(true)
      }
    }
    if (!loginInfo) {
      setIsWhitelisted1(false)
      setIsWhitelisted2(false)
    } else {
      if (wallet !== 'Privy' || privyReady) {
        getBalance()
      }
    }
  }, [genesisSaleDetailData, loginInfo, centralNftContract, privyReady])

  useEffect(() => {
    if (
      !loginInfo ||
      quantity === 0 ||
      (whitelist === 1 && !isWhitelisted1) ||
      (whitelist === 2 && !isWhitelisted2)
    ) {
      console.log(
        'for test checkMintable',
        { quantity },
        { balance: mintBalance },
        { maxMint },
        { whitelist },
        { isWhitelisted1 },
        { isWhitelisted2 },
      )
      setIsMintDisabled(true)
    } else {
      setIsMintDisabled(false)
    }
  }, [quantity])

  const handleMint = () => {
    if (quantity + mintBalance > maxMint) {
      toast('You have already minted.')
      return
    }
    if (
      quantity * genesisSaleDetailData.price >
        parseFloat(localStorage.getItem('balance')) ||
      parseInt(localStorage.getItem('balance')) === 0
    ) {
      toast('You have not enough balance.')
      return
    }
    onMint(quantity)
  }

  const handleChange = v => {
    if (Number.isNaN(parseInt(v.target.value))) {
      setQuantity(0)
    } else {
      setQuantity(parseInt(v.target.value))
    }
  }

  const handleBlur = str => {
    console.log(str)
  }

  let countDown: any = null
  let mintCountDown: any = null

  const [state, setState] = useState({
    day: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  })

  const [mintState, setMintState] = useState({
    hours: '02',
    minutes: '00',
    seconds: '00',
  })

  const updateState = (data: any) => {
    setState(state => ({ ...state, ...data }))
  }

  const updateMintState = (data: any) => {
    setMintState(state => ({ ...state, ...data }))
  }

  const initCountDown = () => {
    countDown = setInterval(function () {
      const countDownDate = new Date(genesisGoLiveTimestamp * 1000).getTime()
      const now = new Date().getTime()
      const distance = countDownDate < now ? 0 : countDownDate - now

      if (distance < 0) {
        clearInterval(countDown)
        updateState({
          day: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
        })
        setShowCountdown(false)
      } else {
        const day = ~~(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        )
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        updateState({
          day,
          hours,
          minutes,
          seconds,
        })
        setShowCountdown(true)
      }
    }, 1000)
  }

  const initMintCountDown = () => {
    mintCountDown = setInterval(function () {
      const countDownDate = new Date(mintTimestamp * 1000).getTime()
      const now = new Date().getTime()
      const distance = countDownDate < now ? 0 : countDownDate - now

      if (distance < 0) {
        clearInterval(mintCountDown)
        updateMintState({
          hours: '00',
          minutes: '00',
          seconds: '00',
        })
      } else {
        const hours = Math.floor(distance / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        updateMintState({
          hours,
          minutes,
          seconds,
        })
      }
    }, 1000)
  }

  useEffect(() => {
    if (genesisGoLiveTimestamp) {
      initCountDown()
    }
  }, [genesisGoLiveTimestamp])

  useEffect(() => {
    if (mintTimestamp) {
      initMintCountDown()
    }
  }, [mintTimestamp])

  return (
    <div className="genesis-land-root root-section">
      <HotToaster />
      <video playsInline autoPlay muted loop poster="cake.jpg">
        <source src="/videos/genesis-land-background.mp4" type="video/mp4" />
      </video>
      <div className="genesis-land-root-wrapper">
        <div className="genesis-land-container">
          {isFirst && (
            <div
              className={`${
                showMintCard ? '' : 'full-width'
              } genesis-land-left-content`}
            >
              <div className="genesis-land-title">
                <span>{t('genesis')}&nbsp;</span> {t('by meca')}
              </div>
              <div className="genesis-land-desc">{t('The ultimate early')}</div>
              <div className="genesis-whitelist-alert">
                {isWhitelisted1 && (
                  <Alert severity="success">
                    <div className="genesis-whitelist-alert-text">
                      {t('You are whitelisted')}
                      <b className="genesis-land-minting-phase">1</b>
                    </div>
                  </Alert>
                )}
                {isWhitelisted2 && (
                  <Alert severity="success">
                    <div className="genesis-whitelist-alert-text">
                      {t('You are whitelisted')}
                      <b className="genesis-land-minting-phase">2</b>
                    </div>
                  </Alert>
                )}
              </div>
            </div>
          )}

          {(window.innerWidth > 1800 || !isFirst) && showMintCard ? (
            <div className="genesis-land-right-content">
              <div className="genesis-land-mintcard-wrapper">
                <div className="genesis-land-mintcard">
                  <div className="genesis-land-mintcard-logo">
                    <HoverVideoPlayer
                      videoSrc="/videos/1.mp4"
                      pausedOverlay={
                        <ImageComponent
                          src="/videos/1.png"
                          alt=""
                          style={{
                            // Make the image expand to cover the video's dimensions
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      }
                      style={{ width: '100%', height: '100%' }}
                      loadingOverlay={
                        <div className="loading-overlay">
                          <div className="loading-spinner" />
                        </div>
                      }
                    />
                  </div>
                  <div className="genesis-land-mintcard-container">
                    <div>
                      <div className="genesis-land-mintcard-title">
                        <b>{t('minting phase')}</b>{' '}
                        <b className="genesis-land-minting-phase">
                          {mintingPhase}
                        </b>
                      </div>
                      <div className="genesis-land-text">
                        {t('common genesis nft')}
                      </div>
                    </div>

                    <div className="genesis-mintedlive-countdown-box genesis-minting-phase-countdown-box">
                      <div className="genesis-mintedlive-time-content">
                        <div className="genesis-mintedlive-timer">
                          <div className="genesis-mintedlive-timer-time">
                            {mintState.hours.toString().padStart(2, '0')}
                          </div>
                          <div className="genesis-mintedlive-timer-time-unit-mobile">
                            {t('H')}
                          </div>
                        </div>
                        <div className="genesis-mintedlive-timer">
                          <div className="genesis-mintedlive-timer-time">
                            {mintState.minutes.toString().padStart(2, '0')}
                          </div>
                          <div className="genesis-mintedlive-timer-time-unit-mobile">
                            {t('M')}
                          </div>
                        </div>
                        <div className="genesis-mintedlive-timer">
                          <div className="genesis-mintedlive-timer-time">
                            {mintState.seconds.toString().padStart(2, '0')}
                          </div>
                          <div className="genesis-mintedlive-timer-time-unit-mobile">
                            {t('S')}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="genesis-land-text gold-color">
                      {`${whitelist > 0 ? `${t('whitelist only')} | ` : ''}${t(
                        'max mint',
                      )}: `}
                      <b>{maxMint}</b>
                    </div>

                    <div className="genesis-land-mint-container">
                      <FormInput
                        id="mint-number"
                        type="text"
                        placeholder={t('0')}
                        name="mint-number"
                        value={quantity}
                        handleChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <div
                        className={classNames(
                          'genesis-land-mint-btn',
                          isMintDisabled ? 'btn-disabled' : '',
                        )}
                        onClick={handleMint}
                      >
                        <div className="genesis-land-priceinfo-item-price">
                          <img src={MaticIcon} alt="matic-icon"></img>
                          <span>{price}</span>
                        </div>
                        <b>{t('mint now')}</b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : window.innerWidth > 1800 && !genesisSaleDetailData ? (
            <Spinner
              spinnerStatus={true}
              className="genesis-land-container-spinner"
            />
          ) : (
            ''
          )}
        </div>

        {isFirst &&
          showCountdown &&
          false && ( // hide temporarily
            <div className="genesis-mintedlive-countdown-box">
              <div className="genesis-mintedlive-time-label">
                {/* {t('minting starting in')} */}
                &nbsp;
              </div>
              <div className="genesis-mintedlive-time-content">
                <div className="genesis-mintedlive-timer">
                  <div className="genesis-mintedlive-timer-time">
                    {state.day.toString().padStart(2, '0')}
                  </div>
                  <div className="genesis-mintedlive-timer-time-unit">
                    {t('days')}
                  </div>
                  <div className="genesis-mintedlive-timer-time-unit-mobile">
                    {t('D')}
                  </div>
                </div>
                <div className="genesis-mintedlive-timer">
                  <div className="genesis-mintedlive-timer-time">
                    {state.hours.toString().padStart(2, '0')}
                  </div>
                  <div className="genesis-mintedlive-timer-time-unit">
                    {t('hours')}
                  </div>
                  <div className="genesis-mintedlive-timer-time-unit-mobile">
                    {t('H')}
                  </div>
                </div>
                <div className="genesis-mintedlive-timer">
                  <div className="genesis-mintedlive-timer-time">
                    {state.minutes.toString().padStart(2, '0')}
                  </div>
                  <div className="genesis-mintedlive-timer-time-unit">
                    {t('minutes')}
                  </div>
                  <div className="genesis-mintedlive-timer-time-unit-mobile">
                    {t('M')}
                  </div>
                </div>
                <div className="genesis-mintedlive-timer">
                  <div className="genesis-mintedlive-timer-time">
                    {state.seconds.toString().padStart(2, '0')}
                  </div>
                  <div className="genesis-mintedlive-timer-time-unit">
                    {t('seconds')}
                  </div>
                  <div className="genesis-mintedlive-timer-time-unit-mobile">
                    {t('S')}
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  )
}

export default GenesisLand
