import React from 'react'
import classNames from 'classnames'
import '@assets/css/components/SubmitButton.css'
import { useTranslation } from 'react-i18next'
import ArrowCircleUpOutlinedIcon from '@mui/icons-material/ArrowCircleUpOutlined'

interface Props {
  isGlow?: boolean
  onPress: () => void
}

const TourButton: React.FC<Props> = props => {
  const { isGlow = false, onPress } = props
  const { t } = useTranslation()

  return (
    <div
      className={classNames(
        `tour-button form-submit-btn`,
        isGlow ? 'btn-glow' : '',
      )}
      onClick={onPress}
    >
      <ArrowCircleUpOutlinedIcon />
      {t('product tour')}
    </div>
  )
}

export default TourButton
