import React from 'react'
import ToggleSwitch from '@components/Form/ToggleSwitch'
import { postNotificationsSettings } from '@root/apis/onboarding/authenticationSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { RootState } from '@root/store/rootReducers'
import classNames from 'classnames'
interface Props {
  item: any
  index: number
  isMenu: boolean
  className?: string
  isDisabled?: boolean
  marginBottom?: boolean
}

const NotificationSettingItem: React.FC<Props> = ({
  item,
  index,
  isDisabled = false,
  marginBottom = false,
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { selectedThemeRedux } = authenticationData
  let selectedLanguage = localStorage.getItem('languageName')

  if (selectedLanguage === null) {
    selectedLanguage = 'English'
  }
  const handleToggleSwitch = toggleValue => {
    const reqParams = {
      notification_type: item.notificationtype,
      setting: toggleValue ? 1 : 0,
    }
    dispatch(postNotificationsSettings(reqParams))
  }
  return (
    <div className={classNames('notification', marginBottom ? 'mb-50' : '')}>
      <div className="notification-title plain">
        {item.notificationtype === 'Notify by eMail' ? (
          <div className="notification-text">
            {t(`${item.notificationtype}`)}
          </div>
        ) : (
          <div
            className="notification-text"
            style={{ textTransform: 'capitalize' }}
          >
            {t(`${item.notificationtype.replaceAll('_', ' ')}`)}
          </div>
        )}
        <div className="selected-value-row">
          <div
            className={`grey-color ${!Boolean(index) && 'fg-primary-color'}`}
          >
            <ToggleSwitch
              onToggle={handleToggleSwitch}
              isCheckedSetting={item.setting > 0 ? true : false}
              isDisabled={isDisabled}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationSettingItem
