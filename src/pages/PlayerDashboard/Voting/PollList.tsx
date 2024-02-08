import { useEffect, useState } from 'react'
import ArrowDown from '@components/Svg/ArrowDown'
import { useTranslation } from 'react-i18next'
import SubmitButton from '@components/Button/SubmitButton'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import classNames from 'classnames'
import {
  closeVote,
  getOpenVoteList,
  getOpenVoteListInit,
  getVoteInfo,
  getVoteList,
  resetSendMaticTxnConfirm,
  resetTxnConfirmationData,
} from '@root/apis/playerCoins/playerCoinsSlice'
import Web3BottomPopup from '@components/Dialog/Web3BottomPopup'
import { getVotePercentage, displayDate } from '@utils/helpers'
import DialogBox from '@components/Dialog/DialogBox'
import ArrowUp from '@components/Svg/ArrowUp'
import '@assets/css/components/ComingSoon.css'
import toast from 'react-hot-toast'
import HotToaster from '@components/HotToaster'
import ApiBottomPopup from '@components/Dialog/ApiBottomPopup'
import { showVotingMobile } from '@root/apis/onboarding/authenticationSlice'
import { useWalletHelper } from '@utils/WalletHelper'
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined'

interface Props {
  onCreate: () => any
}
const PollList: React.FC<Props> = ({ onCreate }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [countDownDate, setCountDownDate] = useState(-1)
  const [showBottomPopup, setShowBottomPopup] = useState(false)
  const [txnHash, setTxnHash] = useState<string>('')
  const [txnErr, setTxnErr] = useState('')
  const [openVoteInfo, setOpenVoteInfo] = useState([])

  const playerCoinData = useSelector((state: RootState) => state.playercoins)

  const [clickList, setClickList] = useState<boolean[]>([])

  const {
    selectedPlayer,
    isLoading,
    voteList,
    openVoteList,
    voteInfo,
    player1contract,
    stakingcontract,
    stakingcontractabi,
    isGetOpenVoteListSuccess,
    isGetVoteInfoSuccess,
  } = playerCoinData
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const { getStakingContract } = useWalletHelper()

  const { selectedThemeRedux } = authenticationData
  const loginInfo = localStorage.getItem('loginInfo')

  // custom
  const [openExpandFlag, setOpenExpandFlag] = useState(true)

  const handleCreate = () => {
    dispatch(resetTxnConfirmationData())
    dispatch(resetSendMaticTxnConfirm())
    if (countDownDate > -1) {
      toast.error(t('your voting poll is not closed yet.'))
    } else {
      dispatch(showVotingMobile({ newVotingCreate: true }))
      onCreate()
    }
  }

  const handleClick1 = (index: number) => {
    const temp = clickList
    temp[index] = !temp[index]
    setClickList(temp)
  }

  useEffect(() => {
    if (isGetVoteInfoSuccess) {
      setOpenVoteInfo(voteInfo)
    }
  }, [isGetVoteInfoSuccess])

  let countDown: any = null
  const [state, setState] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  })

  const updateState = (data: any) => {
    setState(state => ({ ...state, ...data }))
  }

  const initCountDown = () => {
    countDown = setInterval(function () {
      const now = new Date().getTime()
      const distance = countDownDate < now ? 0 : countDownDate - now
      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      )
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      if (distance < 0) {
        clearInterval(countDown)
        updateState({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
        })
      } else {
        updateState({
          days,
          hours,
          minutes,
          seconds,
        })
      }
    }, 1000)
  }

  useEffect(() => {
    dispatch(getVoteList(player1contract))
    dispatch(getOpenVoteList(player1contract))
    return () => {
      dispatch(getOpenVoteListInit())
      clearInterval(countDown)
    }
  }, [])

  useEffect(() => {
    if (isGetOpenVoteListSuccess && openVoteList.length > 0) {
      if (openVoteList[0]?.votelaunchdate) {
        const endDate = new Date(openVoteList[0]?.blockdeadline).getTime()
        if (endDate > new Date().getTime()) {
          setCountDownDate(endDate)
        }
      }
      let param =
        'vote_id=' + openVoteList[0]?.voteid + '&contract=' + player1contract
      if (loginInfo) {
        param += '&walletaddress=' + loginInfo
      }
      if (openVoteList[0]?.voteid >= 0) {
        dispatch(getVoteInfo(param))
      }
    }
  }, [isGetOpenVoteListSuccess])

  useEffect(() => {
    if (countDownDate > -1) {
      initCountDown()
    }
  }, [countDownDate])

  const handleCloseVote = async () => {
    if (!stakingcontract) {
      return
    }
    setShowBottomPopup(true)
    if (localStorage.getItem('loginId')) {
      return
    }
    const stakingContract = await getStakingContract(
      stakingcontract,
      stakingcontractabi,
    )
    stakingContract
      ?.closeOpenPoll()
      .then(async (txn: any) => {
        setTxnHash(txn.hash)
      })
      .catch((err: any) => {
        const isErrorGasEstimation = `${err}`.includes('cannot estimate gas')
        if (err.message === '406') {
          setTxnErr(t('this functionality unavailable for internal users'))
        }
        if (isErrorGasEstimation) {
          setTxnErr(t('not enough funds to pay for blockchain transaction'))
        } else {
          setTxnErr(err.reason || err.message)
        }
      })
  }

  const handleClose = () => {
    setShowBottomPopup(false)
    setTxnErr('')
    setTxnHash('')
    dispatch(getOpenVoteList(player1contract))
    dispatch(getVoteList(player1contract))
  }

  const handleCloseVoteApi = (user_secret: any) => {
    const formData = new FormData()
    formData.append('user_secret', user_secret)
    formData.append('contract', selectedPlayer?.playercontract)
    dispatch(closeVote(formData))
  }

  useEffect(() => {
    if (voteList.length > 0) {
      const temp: any[] = []
      for (let i = 0; i < voteList.length; i++) {
        temp.push(true)
      }
      setClickList(temp)
    }
  }, [voteList.length])

  return (
    <div className="player-vote-list-container">
      {showBottomPopup && (
        <DialogBox
          isOpen={showBottomPopup}
          onClose={handleClose}
          contentClass="onboarding-popup"
        >
          <div className="nft-tab-title pt-50">{t('please wait')}...</div>
          {localStorage.getItem('loginInfo') ? (
            <Web3BottomPopup
              showPopup={showBottomPopup}
              txnHash={txnHash}
              txnErr={txnErr}
              onClose={handleClose}
            />
          ) : (
            <ApiBottomPopup
              showPopup={showBottomPopup}
              onSubmit={handleCloseVoteApi}
              onClose={handleClose}
              customClass="purchase-pc-bottomwrapper"
            />
          )}
        </DialogBox>
      )}
      <HotToaster />
      {/* <div className={classNames('nft-tab-title text-primary-color')}>
        {t('create a new voting poll')}
      </div> */}
      <div className="kiosk-filter-wrapper" style={{ width: '0px' }}>
        {/* <SubmitButton
          title={t('create voting poll')}
          className="nft-create-btn"
          onPress={handleCreate}
        /> */}
        <div className="plus-icon create-new-items" onClick={handleCreate}>
          <AddCircleOutlinedIcon />
        </div>
      </div>
      {isLoading ? (
        <div
          className={classNames(
            'loading-spinner-container mb-40 mt-240',
            isLoading ? 'show' : '',
          )}
        >
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
      ) : (
        <>
          {openVoteList.length > 0 && (
            <div className="kiosk-wrapper">
              <div
                className={classNames(
                  'kiosk-title-wrapper blog-title text-primary-color',
                )}
              >
                {t('Open Votes')}
              </div>
              <div className="kiosk-content-wrapper fullwidth NftList-poll-root">
                {openVoteList.map((item: any, index: number) => (
                  <div
                    className="NftList-poll-container NftList-poll-closed-container"
                    key={index}
                  >
                    <div className="NftList-poll-header">{item.question}</div>
                    <div className="NftList-poll-body">
                      {openExpandFlag &&
                        openVoteInfo.map(
                          (voteItem: any, detailIndex: number) => (
                            <div
                              className={classNames(
                                'NftList-poll-item poll-voted',
                                voteItem.hasivoted > 0 ? 'poll-voted-item' : '',
                                selectedThemeRedux,
                              )}
                              style={{ position: 'relative' }}
                              key={detailIndex}
                            >
                              <div
                                className="grey-bar"
                                style={{
                                  width: getVotePercentage(voteItem) + '%',
                                }}
                              />
                              <div className="poll-text text-content text-content-closed-padding">
                                <div className="text-content-left">
                                  {voteItem?.selectiontext}
                                </div>
                                <div className="text-content-right">
                                  {getVotePercentage(voteItem)}%
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                    </div>
                    {countDownDate > -1 ? (
                      <div className="poll-countdown-container">
                        <div className="coming-soon-time-card">
                          <div className="timer">
                            <div className="heading">{t('days')}</div>
                            <div className="time">
                              {~~state.days < 10 && 0}
                              {state.days}
                            </div>
                          </div>
                          <div className="timer">
                            <div className="heading">{t('hours')}</div>
                            <div className="time">
                              {~~state.hours < 10 && 0}
                              {state.hours}
                            </div>
                          </div>
                          <div className="timer">
                            <div className="heading">{t('mins')}</div>
                            <div className="time">
                              {~~state.minutes < 10 && 0}
                              {state.minutes}
                            </div>
                          </div>
                          <div className="timer">
                            <div className="heading">{t('secs')}</div>
                            <div className="time">
                              {~~state.seconds < 10 && 0}
                              {state.seconds}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <SubmitButton
                        title={t('close voting')}
                        className="nft-create-btn fullwidth"
                        onPress={handleCloseVote}
                      />
                    )}
                    <div className={classNames('NftList-poll-footer')}>
                      <div>
                        {t('ends')}
                        &nbsp;
                        {displayDate(item.blockdeadline)}
                      </div>
                      <div
                        className="expand-section"
                        onClick={() => setOpenExpandFlag(!openExpandFlag)}
                      >
                        <span>
                          {item.voterCount}
                          {t('votes')}
                        </span>
                        <span className="arrow-down">
                          {!openExpandFlag ? <ArrowDown /> : <ArrowUp />}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {voteList.length > 0 && (
            <div className="kiosk-wrapper">
              <div className="kiosk-title-wrapper text-primary-color blog-title">
                {t('Closed Votes')}
              </div>
              <div className="kiosk-content-wrapper playercoin-container">
                {voteList.map((item: any, index: number) => (
                  <div
                    className="NftList-poll-container vote-card-size"
                    onClick={() => handleClick1(index)}
                    key={index}
                  >
                    <div className="NftList-poll-header">{item.question}</div>
                    {clickList[index] && (
                      <div className="NftList-poll-body">
                        {item.vote_detail.map(
                          (voteItem: any, detailIndex: number) => (
                            <div
                              className={classNames(
                                'NftList-poll-item poll-voted',
                                voteItem.hasivoted > 0 ? 'poll-voted-item' : '',
                                selectedThemeRedux,
                              )}
                              style={{ position: 'relative' }}
                              key={detailIndex}
                            >
                              <div
                                className="grey-bar"
                                style={{
                                  width: `${getVotePercentage(voteItem)}%`,
                                }}
                              ></div>
                              <div
                                className="poll-text text-content"
                                style={{ minHeight: '50px' }}
                              >
                                <div className="text-content-left">
                                  {voteItem?.selectiontext}
                                </div>
                                <div className="text-content-right">
                                  {getVotePercentage(voteItem)}%
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                    <div className={classNames('NftList-poll-footer')}>
                      <div className="yellow-color">
                        {t('Closed')} &nbsp;
                        {displayDate(item.blockdeadline)}
                      </div>
                      <div className="expand-section">
                        <span>
                          {item.voterCount}
                          {t('votes')}
                        </span>
                        <span className="arrow-down">
                          <ArrowUp />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default PollList
