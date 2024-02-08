import AppLayout from '@components/Page/AppLayout'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import UserMySettings from './UserMySettings'

const UserMySettingsWrapper = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const loginId = localStorage.getItem('loginId')
  const loginInfo = localStorage.getItem('loginInfo')
  return (
    <AppLayout className="notifications my-settings">
      {!loginId && !loginInfo ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <h2 className="page-heading">{t('404! page not found')}</h2>
          <div
            className="button-box button1"
            onClick={() => {
              navigate('/')
            }}
          >
            {t('go to home')}
          </div>
        </div>
      ) : (
        <UserMySettings />
      )}
    </AppLayout>
  )
}

export default UserMySettingsWrapper
