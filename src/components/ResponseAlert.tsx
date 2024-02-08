/* eslint-disable prettier/prettier */
import React from 'react'
import classnames from 'classnames'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import '@assets/css/components/ResponseAlert.css'

interface Props {
  status?: string
}

const ResponseAlert: React.FC<Props> = props => {
  const { status } = props
  return (
    <div
      className={classnames(
        'response-status-container',
        status === 'Success'
          ? 'pay-success'
          : status === 'Error'
            ? 'pay-error'
            : 'none',
      )}
    >
      <CheckCircleOutlinedIcon className="response-icon success-icon" />
      <CancelOutlinedIcon className="response-icon error-icon" />
      <span>{status}!</span>
    </div>
  )
}

export default ResponseAlert
