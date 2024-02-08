import DialogBox from '@components/Dialog/DialogBox'
import { PLAYER_STATUS } from '@root/constants'
import { RootState } from '@root/store/rootReducers'
import { isMobile } from '@utils/helpers'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import CreatePoll from './CreatePoll'
import PollList from './PollList'

const Voting = () => {
  const { t } = useTranslation()
  const [status, setStatus] = useState('list')
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const { selectedPlayer } = playerCoinData
  const handleCloseDialog = () => {
    setStatus('list')
  }
  return (
    <div className="dlg-content no-scroll playercoin-vote-width">
      <DialogBox
        isOpen={status === 'create' && !isMobile()}
        onClose={() => setStatus('list')}
      >
        <CreatePoll onClose={handleCloseDialog} />
      </DialogBox>
      {/* {selectedPlayer?.playerstatusid?.id === PLAYER_STATUS.PRO ? (
        <>
          {status === 'list' ? (
            <PollList onCreate={() => setStatus('create')} />
          ) : status === 'create' && isMobile() ? (
            <CreatePoll onClose={handleCloseDialog} />
          ) : (
            <></>
          )}
        </>
      ) : (
        <div className="heading-title-container">
          <div className="heading-title unverified-alert popup-alert must-text">
            {t('your status must be pro')}
          </div>
        </div>
      )} */}
      <>
        {status === 'list' ? (
          <PollList onCreate={() => setStatus('create')} />
        ) : status === 'create' && isMobile() ? (
          <CreatePoll onClose={handleCloseDialog} />
        ) : (
          <></>
        )}
      </>
    </div>
  )
}

export default Voting
