import React from 'react'
import { useTranslation } from 'react-i18next'
import SubmitButton from '@components/Button/SubmitButton'

interface Props {
  promptText: string
  onSuccess: () => void
  onClose: () => void
}

const ApprovePaymentOptionPrompt: React.FC<Props> = ({
  onSuccess,
  onClose,
  promptText,
}) => {
  const { t } = useTranslation()

  return (
    <section
      className="new-draft"
      style={{
        width: '90%',
        marginTop: '80px',
      }}
    >
      <div className="remove-adminplayer-prompt-wrapper">
        <div className="new-draft-title">{promptText}</div>
        <div style={{ marginTop: '60px' }}>
          <SubmitButton
            title={t('yes')}
            className="m-0auto mt-20"
            onPress={onSuccess}
          />
          <SubmitButton
            title={t('no')}
            className="m-0auto mt-20 btn-disabled"
            onPress={onClose}
          />
        </div>
      </div>
    </section>
  )
}

export default ApprovePaymentOptionPrompt
