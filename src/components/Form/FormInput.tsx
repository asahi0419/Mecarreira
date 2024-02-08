/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import classNames from 'classnames'
import '@assets/css/components/FormInput.css'

interface Props {
  id?: string
  type?: 'text' | 'checkbox' | 'radio' | 'email' | 'password' | 'number'
  value?: number | string
  name?: string
  handleChange: (v?: any) => void
  onBlur: (v?: any) => void
  disabled?: boolean
  className?: string
  classNameWrapper?: string
  placeholder?: string
  maxLength?: number
  paymentFormZip?: boolean
  paymentFormCity?: boolean
}

const FormInput: React.FC<Props> = ({
  id,
  type,
  value,
  name,
  handleChange,
  onBlur,
  disabled,
  placeholder,
  className,
  maxLength,
  paymentFormZip,
  paymentFormCity,
  classNameWrapper,
}) => {
  const [isVisible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!isVisible)
  }

  const getInputType = () => {
    if (type === 'password') {
      if (isVisible) {
        return 'text'
      }
      return type
    }
    return type
  }

  return (
    <div
      className={classNames(
        'textinput-wrapper',
        paymentFormZip ? 'textinput-wrapper-zip' : '',
        paymentFormCity ? 'textinput-wrapper-city' : '',
        classNameWrapper,
      )}
    >
      <input
        id={id || ''}
        type={getInputType()}
        value={value}
        name={name}
        onChange={handleChange}
        onBlur={e => onBlur(e)}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={maxLength}
        className={classNames(className)}
        onCopy={e => {
          e.preventDefault()
          return false
        }}
      />
      {type === 'password' && (
        <>
          {isVisible ? (
            <VisibilityIcon className="input-btn" onClick={toggleVisibility} />
          ) : (
            <VisibilityOffIcon
              className="input-btn"
              onClick={toggleVisibility}
            />
          )}
        </>
      )}
    </div>
  )
}

export default FormInput
