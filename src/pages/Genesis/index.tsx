import React, { useContext, useEffect, useState } from 'react'
import Header, { MobileHeader } from './Header'
import GenesisLand from './GenesisLand'
import '@assets/css/pages/Genesis.css'
import '@assets/css/components/GenesisCollectionCard.css'
import '@assets/css/components/GenesisComponent.css'
import Collection from './Collection'
import CommonCollection from './CommonCollection'
import MintedLive from './MintedLive'
import Utility from './Utility'
import UseNFT from './UseNFT'
import LevelUp from './LevelUp'
import Bottom from '@pages/Landing/Bottom'
import { Scrollbar } from 'smooth-scrollbar-react'
import DialogBox from '@components/Dialog/DialogBox'
import WalletConnectConfirm from '@components/Page/WalletConnectConfirm'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { isMobile } from '@utils/helpers'
import {
  showSignupForm,
  showWalletForm,
  walletConnectCheck,
} from '@root/apis/onboarding/authenticationSlice'
import { ConnectContext } from '@root/WalletConnectProvider'
import WalletDialog from '@components/Dialog/WalletDialog'
import WalletForm from '@pages/Wallet/WalletForm'
import { useWalletHelper } from '@utils/WalletHelper'
import { useTranslation } from 'react-i18next'
import { ethers } from 'ethers'
import Web3BottomPopup from '@components/Dialog/Web3BottomPopup'
import OnboardingForm from '@pages/Onboarding/OnboardingForm'
import {
  getRequest,
  makeGetRequest,
  makeGetRequestAdvance,
} from '@root/apis/axiosClient'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css'
import { getGenesisSaleDetail } from '@root/apis/playerCoins/playerCoinsSlice'

let nftListInterval: any = null

const Genesis: React.FC = () => {
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    isSignupFormVisible,
    isWalletFormVisible,
    walletConnectConfirmPopUp,
    centralNftContract,
    centralNftContractAbi,
  } = authenticationData

  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const { genesisSaleDetailData } = playerCoinData

  const [showHeader, setShowHeader] = useState(false)
  const { disconnect } = useContext(ConnectContext)
  const [showBottomPopup, setShowBottomPopup] = useState(false)
  const [txnError, setTxnError] = useState('')
  const [txnHash, setTxnHash] = useState('')

  const { getWeb3Provider } = useWalletHelper()

  const [levelItems, setLevelItems] = useState([
    {
      unlocks: 2,
      label: t('Common'),
      isPerpetual: false,
      minted: 0,
      xpBoost: 0,
    },
    {
      unlocks: 5,
      label: t('bronze'),
      isPerpetual: false,
      minted: 0,
      xpBoost: 0,
    },
    {
      unlocks: 10,
      label: t('silver'),
      isPerpetual: false,
      minted: 0,
      xpBoost: 0,
    },
    {
      unlocks: 30,
      label: t('gold'),
      isPerpetual: false,
      minted: 0,
      xpBoost: 0,
    },
    {
      unlocks: 0,
      label: t('diamond'),
      isPerpetual: false,
      minted: 0,
      xpBoost: 0,
    },
  ])

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchGenesisData()
    nftListInterval = setInterval(() => {
      fetchGenesisData()
    }, 60000)
    dispatch(getGenesisSaleDetail())
    document.body.style.backgroundColor = '#12131c'
    return () => {
      document.body.style.backgroundColor = '#222435'
      clearInterval(nftListInterval)
    }
  }, [])

  useEffect(() => {
    if (
      isWalletFormVisible ||
      walletConnectConfirmPopUp ||
      isSignupFormVisible
    ) {
      document.body.style.overflow = 'hidden'
      if (isMobile()) {
        document.body.style.position = 'fixed'
      }
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
    }
  }, [isWalletFormVisible, walletConnectConfirmPopUp, isSignupFormVisible])

  const handleClose = () => {
    if (isSignupFormVisible) {
      dispatch(showSignupForm())
    } else if (isWalletFormVisible) {
      dispatch(showWalletForm({}))
    } else if (walletConnectConfirmPopUp) {
      console.log('showing_connect_confirm7')
      dispatch(walletConnectCheck({ walletConnectConfirmPopUp: false }))
      disconnect()
    }
  }

  const loginInfo = localStorage.getItem('loginInfo')

  const fetchGenesisData = async () => {
    try {
      const items = []
      const levels = [
        t('Common'),
        t('bronze'),
        t('silver'),
        t('gold'),
        t('diamond'),
      ]
      const unlocks = [2, 5, 10, 30, 0]
      for (let index = 1; index <= levels.length; index++) {
        const result = await makeGetRequestAdvance(
          `accounts/level_details/?level=${index}`,
        )
        const levelDetail = result.data?.data
        items.push({
          unlocks: unlocks[index - 1],
          label: levels[index - 1],
          isPerpetual: levelDetail.isperpetual,
          minted: Number(levelDetail.minted),
          xpBoost: Number(levelDetail.xpboost),
          index: index,
        })
      }
      setLevelItems(items)
    } catch (error) {
      console.log(error)
    }
  }

  const handleMint = async (value: any) => {
    setShowBottomPopup(true)
    if (localStorage.getItem('loginId')) {
      return
    }
    const exp = ethers.BigNumber.from('10').pow(18)

    const amount = ethers.BigNumber.from(
      Math.floor(value * genesisSaleDetailData.price),
    ).mul(exp)

    try {
      const provider = await getWeb3Provider()
      const contract = new ethers.Contract(
        centralNftContract, // contract address of Router
        centralNftContractAbi, //  contract abi of Router
        provider.getSigner(loginInfo!), // signer of the currently logged in user wallet address
      )

      const tx = await contract.gBuyMint(value, {
        gasLimit: ethers.utils.hexlify(2000000),
        value: amount,
      })

      setTxnHash(tx.hash)
    } catch (err: any) {
      const isErrorGasEstimation = `${err}`.includes('cannot estimate gas')
      if (err.message === '406') {
        setTxnError(t('this functionality unavailable for internal users'))
      }
      if (isErrorGasEstimation) {
        setTxnError(t('not enough funds to pay for blockchain transaction'))
      } else {
        setTxnError(err.reason || err.message)
      }
    }
  }

  const handleCloseBottomPopup = () => {
    if (txnHash) {
      dispatch(getGenesisSaleDetail())
    }
    setShowBottomPopup(false)
    setTxnError('')
    setTxnHash('')
  }

  return (
    <>
      {showBottomPopup && (
        <DialogBox
          isOpen={showBottomPopup}
          onClose={handleCloseBottomPopup}
          contentClass="onboarding-popup"
        >
          <div className="nft-tab-title pt-50">{t('please wait')}...</div>
          <Web3BottomPopup
            showPopup={showBottomPopup}
            txnHash={txnHash}
            txnErr={txnError}
            onClose={handleCloseBottomPopup}
          />
        </DialogBox>
      )}
      {walletConnectConfirmPopUp && (
        <DialogBox
          isOpen={walletConnectConfirmPopUp}
          onClose={handleClose}
          parentClass={isMobile() ? 'flex-dialog' : ''}
        >
          <WalletConnectConfirm />
        </DialogBox>
      )}
      {isWalletFormVisible && (
        <WalletDialog
          isOpen={isWalletFormVisible}
          onClose={handleClose}
          isMandatory={false}
          parentClass={isMobile() ? 'flex-dialog' : ''}
        >
          <WalletForm />
        </WalletDialog>
      )}
      {isSignupFormVisible && (
        <DialogBox
          isOpen={isSignupFormVisible && !walletConnectConfirmPopUp}
          onClose={handleClose}
          parentClass={isMobile() ? 'flex-dialog' : ''}
        >
          <OnboardingForm onSubmit={handleClose} onClose={handleClose} />
        </DialogBox>
      )}

      <Header showHeader={showHeader} />
      {isMobile() &&
      (showBottomPopup ||
        walletConnectConfirmPopUp ||
        isWalletFormVisible ||
        isSignupFormVisible) ? (
        <MobileHeader handleClose={handleClose} />
      ) : null}
      <Splide
        aria-label="My Favorite Images"
        options={{
          direction: 'ttb',
          wheel: true,
          speed: 1000,
          height: '100vh',
          autoHeight: true,
          autoWidth: true,
          arrows: false,
          waitForTransition: true,
        }}
        onMove={({ index }) => {
          if (index === 0) setShowHeader(false)
          else setShowHeader(true)
        }}
      >
        <SplideSlide>
          <GenesisLand isFirst={true} onMint={handleMint} />
        </SplideSlide>
        {window.innerWidth <= 1800 &&
          genesisSaleDetailData &&
          genesisSaleDetailData.genesissalestate > 0 && (
            <SplideSlide>
              <GenesisLand isFirst={false} onMint={handleMint} />
            </SplideSlide>
          )}
        <SplideSlide>
          <MintedLive items={levelItems} />
        </SplideSlide>
        <SplideSlide>
          <Utility />
        </SplideSlide>
        <SplideSlide>
          <CommonCollection item={levelItems[0]} />
        </SplideSlide>
        <SplideSlide>
          <Collection items={levelItems.slice(1)} />
        </SplideSlide>
        <SplideSlide>
          <UseNFT />
        </SplideSlide>
        <SplideSlide>
          <LevelUp />
        </SplideSlide>
        <SplideSlide>
          <div className="genesis-bottom-section">
            <Bottom />
          </div>
        </SplideSlide>
        {/* {isMobile() && (
          <SplideSlide>
            <div
              className="genesis-bottom-section"
              style={{ marginTop: 'calc(100vh - 1000px)' }}
            >
              <Bottom />
            </div>
          </SplideSlide>
        )} */}
      </Splide>
    </>
  )
}

export default Genesis
