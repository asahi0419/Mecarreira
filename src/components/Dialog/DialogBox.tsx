/* eslint-disable no-unused-vars */
import React from 'react'
import Modal from 'react-modal'
import classnames from 'classnames'
import { isMobile } from '@utils/helpers'
import '@assets/css/components/DialogBox.css'
interface Props {
  formActive?: string
  isOpen: boolean
  children: React.ReactNode
  contentClass?: string
  closeBtnClass?: string
  parentClass?: string
  isMandatory?: boolean
  onClose: (v?: any) => void
}

Modal.setAppElement('#root')

const DialogBox: React.FC<Props> = ({
  isOpen,
  children,
  contentClass,
  closeBtnClass,
  parentClass,
  isMandatory = false,
  onClose,
}) => {
  const getMarginOnSite = () => {
    const currentURL = window.location.href
    const includesGenesis = currentURL.includes('/genesis')
    const includeLanding = !currentURL.includes('/app')
    if (includeLanding && !includesGenesis && isMobile()) {
      return '60px'
    }
    return null
  }

  return (
    <div
      id="myModal"
      style={{
        marginTop: getMarginOnSite(),
      }}
      className={classnames('modal', isOpen ? 'show' : '', parentClass)}
    >
      <div className={classnames('modal-content', contentClass)}>
        {!isMandatory ? (
          <button
            className={classnames('close', isMobile() ? closeBtnClass : '')}
          >
            <span onClick={onClose}>&times;</span>
          </button>
        ) : null}
        {children}
      </div>
    </div>
  )
}

export default DialogBox
