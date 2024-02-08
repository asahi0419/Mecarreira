/* eslint-disable no-unused-vars */
import React from 'react'
import classNames from 'classnames'
import '@assets/css/components/FormInput.css'
import { isMobile } from '@utils/helpers'

interface Props {
  id?: string
  type?: 'text' | 'checkbox' | 'radio' | 'email' | 'password' | 'number'
  value?: number | string
  name?: string
  handleChange: (v?: any) => void
  onBlur: (v?: any) => void
  disabled?: boolean
  className?: string
  placeholder?: string
  maxLength?: number
  containerClass?: string
}

const FormTextArea: React.FC<Props> = ({
  id,
  value,
  name,
  handleChange,
  onBlur,
  disabled,
  placeholder,
  className,
  maxLength,
  containerClass = '',
}) => {
  return (
    <div className={classNames('textinput-wrapper', containerClass)}>
      <textarea
        id={id || ''}
        value={value}
        name={name}
        onChange={handleChange}
        onBlur={e => onBlur(e)}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={maxLength}
        className={classNames(className)}
        rows={id === 'detail' ? 6 : 4}
        cols={isMobile() ? 50 : 100}
      />
    </div>
  )
}

export default FormTextArea
