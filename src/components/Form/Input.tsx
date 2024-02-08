/* eslint-disable no-unused-vars */
import React, { useRef } from 'react'
import classNames from 'classnames'

interface Props {
  id?: string
  type?: 'text' | 'checkbox' | 'radio' | 'email' | 'password' | 'number'
  value?: number | string
  defaultValue?: number | string
  name?: string
  onChange: (v?: string) => void
  onBlur: (v?: any) => void
  onFocus: (v?: any) => void
  disabled?: boolean
  className?: string
  placeholder?: string
  min?: number
  max?: number
  maxLength?: number
  allowAlphaNumeric?: boolean
  inputRef?: any
}

const Input: React.FC<Props> = ({
  id,
  type,
  value,
  defaultValue,
  name,
  onChange,
  onBlur,
  onFocus,
  disabled,
  placeholder,
  className,
  min,
  max,
  allowAlphaNumeric = false,
  maxLength = 50,
  inputRef,
}) => {
  const handleChange = (event: any) => {
    if (!allowAlphaNumeric) {
      event.preventDefault()
      const re = /^[0-9.\b]+$/
      // if value is not blank, then test the regex
      if (event.target.value === '' || re.test(event.target.value)) {
        onChange(event)
      }
    } else {
      onChange(event)
    }
  }
  // const inputRef :any = useRef(null)

  // const focusInput = () => {
  //   if (id === 'buy_price' || id === 'sell_price') {
  //     inputRef.current.focus()
  //     inputRef.current.setSelectionRange(
  //       inputRef.current.value.length,
  //       inputRef.current.value.length,
  //     )
  //   }
  // }
  if (defaultValue) {
    return (
      <input
        id={id || ''}
        type={type || 'text'}
        defaultValue={defaultValue}
        name={name}
        maxLength={maxLength}
        onChange={handleChange}
        onBlur={e => onBlur(e)}
        onFocus={e => (onFocus ? onFocus(e) : console.log(''))}
        disabled={disabled}
        placeholder={placeholder}
        min={min}
        max={max}
        className={classNames(className)}
        ref={inputRef}
        // onClick={focusInput}
      />
    )
  }
  return (
    <input
      id={id || ''}
      type={type || 'text'}
      value={value}
      name={name}
      maxLength={maxLength}
      onChange={handleChange}
      onBlur={e => onBlur(e)}
      onFocus={e => (onFocus ? onFocus(e) : console.log(''))}
      disabled={disabled}
      placeholder={placeholder}
      min={min}
      max={max}
      className={classNames(className)}
      ref={inputRef}
      // onClick={focusInput}
    />
  )
}

export default Input
