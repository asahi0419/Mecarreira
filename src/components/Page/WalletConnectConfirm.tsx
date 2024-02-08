import { useContext, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { useTranslation } from 'react-i18next'
import { walletConnectCheck } from '@root/apis/onboarding/authenticationSlice'
import Home from '@assets/icons/icon/home.webp'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { ConnectContext } from '@root/WalletConnectProvider'
import ImageComponent from '@components/ImageComponent'
import Spinner from '@components/Spinner'

const WalletConnectConfirm = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [isProgress, setIsProgress] = useState<boolean>(false)
  const { connect, disconnect, connectError } = useContext(ConnectContext)
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const { walletType } = authenticationData
  const handleConnect = async (wallet: string) => {
    await connect(wallet)
  }

  const handleAccept = (evt: any) => {
    evt.preventDefault()
    setIsProgress(true)
    handleConnect(walletType)
  }

  useEffect(() => {
    if (connectError) {
      setIsProgress(false)
    }
  }, [connectError])

  return (
    <div className="wrapper_wallet_Connect">
      <h2 className="welcome">{t('welcome_to_mecarreira')}</h2>
      <ImageComponent
        src={Home}
        alt=""
        className="home-img home_wallet_confirm"
      />
      <p className="term_text" style={{ marginTop: '40px' }}>
        {t('by connecting your wallet and')}
      </p>
      <p className="term_text">{t('using mecarreira, you agree to our')}</p>
      <p className="term_text">
        <a
          className="link_text"
          href="https://dev.mecarreira.com/terms-conditions"
        >
          {t('terms_of_service')}
        </a>{' '}
        {t('and')}{' '}
        <a
          className="link_text"
          href="https://dev.mecarreira.com/privacy-policy"
        >
          {t('privacy_policy')}
        </a>
        .
      </p>

      <div className="check_sign">
        <InfoOutlinedIcon
          sx={{
            color: 'var(--secondary-foreground-color)',
            width: '20px',
            height: '20px',
            cursor: 'pointer',
          }}
        />
        <p className="check_sign_text">
          {t('check your wallet for a signature request')}
        </p>
      </div>
      {isProgress ? (
        <div className="button_wrapper">
          <Spinner title={''} spinnerStatus={true} />
        </div>
      ) : (
        <div className="button_wrapper">
          <button
            className="form-submit-btn m-0auto btn-disabled"
            style={{
              width: '50px',
              padding: '20px 40px',
              border: '1px solid black',
            }}
            onClick={() => {
              console.log('showing_connect_confirm6')
              dispatch(walletConnectCheck({ walletConnectConfirmPopUp: false }))
              disconnect()
            }}
          >
            {t('cancel')}
          </button>
          <button
            className="form-submit-btn m-0auto"
            style={{
              width: '160px',
              padding: '20px 20px',
              border: '1px solid black',
            }}
            onClick={handleAccept}
          >
            {t('accept and sign')}
          </button>
        </div>
      )}
    </div>
  )
}

export default WalletConnectConfirm
