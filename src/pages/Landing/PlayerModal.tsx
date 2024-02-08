/* eslint-disable no-unused-vars */
import React from 'react'
import Modal from 'react-modal'
import classnames from 'classnames'
import '@assets/css/components/WalletModal.css'
import { useTranslation } from 'react-i18next'
import Spinner from '@components/Spinner'
import { useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import UserAvatar from '@assets/images/user_avatar.webp'
import ImageComponent from '@components/ImageComponent'

interface Props {
  isOpen: boolean
  playerList: any
  onClick: (v?: any) => void
  onClose: (v?: any) => void
}

Modal.setAppElement('#root')

const PlayerModal: React.FC<Props> = ({
  isOpen,
  playerList,
  onClick,
  onClose,
}) => {
  const { t } = useTranslation()

  const { isLoading } = useSelector((state: RootState) => state.playercoins)
  console.log({ playerList })
  return (
    <div
      id="walletModal"
      className={classnames('modal', 'wallet-modal', isOpen ? 'show' : '')}
    >
      <div className="wallet-modal-content player-modal-content">
        <button className="wallet-modal-close">
          <span onClick={onClose}>&times;</span>
        </button>
        <span>{t('select Player Account')}</span>
        {isLoading ? (
          <Spinner title={''} />
        ) : (
          <>
            {playerList.map((player: any, index: number) => (
              <div
                className="wallet-modal-btn"
                onClick={() => onClick(index)}
                key={index}
              >
                <ImageComponent
                  loading="lazy"
                  src={
                    player.playerpicturethumb ||
                    player.playerpicture ||
                    UserAvatar
                  }
                  alt="walletconnect-icon"
                />
                <span>{player.name}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default PlayerModal
