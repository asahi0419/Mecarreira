/* eslint-disable no-unused-vars */
import React, { useRef } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import classNames from 'classnames'

interface Props {
  type?: 'text' | 'checkbox' | 'radio' | 'email' | 'password'
  value?: number | string
  name?: string
  onChange: (v?: string) => void
  disabled?: boolean
  className?: string
  placeholder?: string
}

const SearchInput: React.FC<Props> = ({
  type,
  value,
  name,
  onChange,
  disabled,
  placeholder,
  className,
}) => {
  const searchInputRef = useRef<any>(null)
  return (
    <div className={classNames(className)}>
      <div className="input-group-prepend">
        <SearchIcon className="icon-color-search black" />
      </div>
      <input
        ref={searchInputRef}
        type={type || 'text'}
        value={value}
        name={name}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
      />
    </div>
  )
}

export default SearchInput
