/* eslint-disable no-unused-vars */
import React, { useRef, useEffect } from 'react'
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

const WalletDialog: React.FC<Props> = ({
  isOpen,
  children,
  contentClass,
  closeBtnClass,
  parentClass,
  isMandatory = false,
  onClose,
}) => {
  const ref: any = useRef(null)
  let span: any = null
  useEffect(() => {
    span = ref.current // corresponding DOM node
  }, [])

  useEffect(() => {
    if (isOpen && span) {
      span.className += ' show'
    }
    console.log({ isOpen, span })
  }, [isOpen, span])

  const handleClose = () => {
    onClose()
  }
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
      id="walletModal"
      style={{
        marginTop: getMarginOnSite(),
      }}
      ref={ref}
      // className={classnames('modal', parentClass)}
      className={classnames('modal', isOpen ? 'show' : '', parentClass)}
    >
      <div
        id="walletModalContent"
        className={classnames('modal-content', contentClass)}
      >
        {!isMandatory ? (
          <button
            className={classnames('close', isMobile() ? closeBtnClass : '')}
          >
            <span onClick={() => handleClose()}>&times;</span>
          </button>
        ) : null}
        {children}
      </div>
    </div>
  )
}

export default WalletDialog
