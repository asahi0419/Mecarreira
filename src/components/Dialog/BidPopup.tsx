/* eslint-disable no-unused-vars */
import React from 'react'
import Modal from 'react-modal'
import classnames from 'classnames'
import '@assets/css/components/BidPopup.css'
interface Props {
  formActive?: string
  isOpen: boolean
  children: React.ReactNode
  contentClass?: string
}

Modal.setAppElement('#root')

const BidPopup: React.FC<Props> = ({ isOpen, children, contentClass }) => {
  return (
    <div
      id="myBidPopup"
      className={classnames('bid-popup', isOpen ? 'show' : '')}
    >
      <div className={classnames('bid-popup-content', contentClass)}>
        {children}
      </div>
    </div>
  )
}

export default BidPopup
