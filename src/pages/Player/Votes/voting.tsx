import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import {
  getOpenVoteList,
  getOpenVoteListInit,
  getVoteInfo,
  getVoteList,
  vote,
} from '@root/apis/playerCoins/playerCoinsSlice'
import {
  getVotePercentage,
  isMobile,
  displayDate,
  getFlooredFixed,
} from '@utils/helpers'
import DialogBox from '@components/Dialog/DialogBox'
import Web3BottomPopup from '@components/Dialog/Web3BottomPopup'
import ArrowDown from '@components/Svg/ArrowDown'
import classNames from 'classnames'
import ArrowUp from '@components/Svg/ArrowUp'
import { showSignupForm } from '@root/apis/onboarding/authenticationSlice'
import toast from 'react-hot-toast'
import HotToaster from '@components/HotToaster'
import '@assets/css/components/ComingSoon.css'
import SubmitButton from '@components/Button/SubmitButton'
import ApiBottomPopup from '@components/Dialog/ApiBottomPopup'
import { useWalletHelper } from '@utils/WalletHelper'

interface Props {
  playercontract: string
  ticker: string
}
const Votings: React.FC<Props> = ({ playercontract, ticker }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [selectedPoll, setSelectedPoll] = useState(-1)
  const [countDownDate, setCountDownDate] = useState(-1)
  const [isOpenPoll, setOpenPoll] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [showBottomPopup, setShowBottomPopup] = useState(false)
  const [txnHash, setTxnHash] = useState<string>('')
  const [txnErr, setTxnErr] = useState('')
  const [option, setOption] = useState(-1)

  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const { stakingBalance } = useSelector(
    (state: RootState) => state.playercoins,
  )
  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')
  const [isOpenVote, setOpenVote] = useState(true)

  const [openVoteInfo, setOpenVoteInfo] = useState([])

  // custom
  const [openExpandFlag, setOpenExpandFlag] = useState(true)
  const [clickList, setClickList] = useState<boolean[]>([])

  const {
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

  const { selectedThemeRedux, playerShareHold } = authenticationData

  const votingPower =
    stakingBalance > 0
      ? getFlooredFixed(
          (stakingBalance / (stakingBalance + openVoteInfo[0]?.votesumtotal)) *
            100,
          2,
        )
      : playerShareHold > 0
      ? getFlooredFixed(
          (playerShareHold /
            (playerShareHold + openVoteInfo[0]?.votesumtotal)) *
            100,
          2,
        )
      : 0

  const { getStakingContract } = useWalletHelper()

  const handleClick1 = (index: number) => {
    const temp = clickList
    temp[index] = !temp[index]
    setClickList(temp)
  }

  useEffect(() => {
    if (isGetVoteInfoSuccess) {
      if (isOpenVote) {
        setOpenVoteInfo(voteInfo)
        setOpenVote(false)
      }
    }
  }, [isGetVoteInfoSuccess])

  let countDown: any = null
  const [state, setState] = useState({
    days: '0',
    hours: '0',
    minutes: '0',
    seconds: '0',
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
    dispatch(getVoteList(playercontract))
    dispatch(getOpenVoteList(playercontract))
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
      setOpenPoll(true)
      let param =
        'vote_id=' + openVoteList[0]?.voteid + '&contract=' + playercontract
      if (loginInfo) {
        param += '&walletaddress=' + loginInfo
      }
      if (param) {
        dispatch(getVoteInfo(param))
      }
    }
  }, [isGetOpenVoteListSuccess])

  useEffect(() => {
    if (countDownDate > -1) {
      clearInterval(countDown)
      initCountDown()
    }
  }, [countDownDate])

  const handleVoteAction = (arg: number) => {
    if (!loginInfo && !loginId) {
      dispatch(showSignupForm())
      return
    }
    if (countDownDate <= 0) {
      toast.error(t('voting is already ended'))
      return
    }
    if (voteInfo.filter((item: any) => item.hasivoted === 1).length > 0) {
      return
    }
    if (stakingBalance <= 0) {
      toast.error(t('please buy and stake tokens to vote'))
      return
    }
    if (!stakingcontract) {
      return
    }
    setShowPopup(true)
    setOption(arg)
  }

  const handleVote = async () => {
    setShowBottomPopup(true)
    if (localStorage.getItem('loginId')) {
      return
    }
    const stakingContract = await getStakingContract(
      stakingcontract,
      stakingcontractabi,
    )
    stakingContract
      ?.vote(option)
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

  const handleVoteApi = (user_secret: any) => {
    const locationUrl = window.location.href
    const urlPlayer = locationUrl.split('/')
    const formData = new FormData()
    formData.append('options', option.toString())
    formData.append('user_secret', user_secret)
    formData.append('detail_page_url', urlPlayer[urlPlayer.length - 1])
    dispatch(vote(formData))
  }

  const handleClose = () => {
    setShowBottomPopup(false)
    setTxnErr('')
    setTxnHash('')
    setShowPopup(false)
  }

  useEffect(() => {
    if (txnHash) {
      dispatch(getOpenVoteList(player1contract))
      dispatch(getVoteList(player1contract))
    }
  }, [txnHash])

  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = 'hidden'
      if (isMobile()) {
        document.body.style.position = 'fixed'
      }
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
    }
  }, [showPopup])

  useEffect(() => {
    if (voteList.length > 0) {
      const temp: boolean[] = []
      for (let i = 0; i < voteList.length; i++) {
        temp.push(true)
      }
      setClickList(temp)
    }
  }, [voteList.length])

  const handleCloseVote = async () => {
    if (!stakingcontract) {
      return
    }
    setShowPopup(true)
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

  return (
    <div className="votes-tab-container">
      <HotToaster />
      {showPopup && (
        <DialogBox
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
          contentClass={classNames(
            'onboarding-popup',
            isMobile() ? 'mobile-popup' : '',
          )}
        >
          {!showBottomPopup ? (
            <div className="confirm-voting-container">
              <div className="new-draft-title">
                {t('you are about to vote ')}
                <br />
                <div className="vote_info">
                  {voteInfo[option].selectiontext}
                </div>
                {t('do you want to continue?')}
              </div>
              <div className="mt-60">
                <SubmitButton
                  title={t('yes')}
                  className="m-0auto mt-20"
                  onPress={handleVote}
                />
                <SubmitButton
                  title={t('no')}
                  className="m-0auto mt-20 btn-disabled"
                  onPress={() => setShowPopup(false)}
                />
              </div>
            </div>
          ) : (
            <>
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
                  onSubmit={handleVoteApi}
                  onClose={handleClose}
                  customClass="purchase-pc-bottomwrapper"
                />
              )}
            </>
          )}
        </DialogBox>
      )}
      {isLoading ? (
        <div
          className={classNames(
            'loading-spinner-container loading-center',
            isLoading ? 'show' : '',
          )}
        >
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
      ) : isGetOpenVoteListSuccess &&
        openVoteList.length === 0 &&
        voteList.length === 0 ? (
        <div className="flex-middle">
          <div style={{ margin: 'auto', width: '360px' }}>
            <div className="alert-wrapper">
              <div className="heading-title unverified-alert text-center">
                {t('no open votes')}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {openVoteList.length > 0 && (
            <div className="polls-wrapper">
              <div className={classNames('blog-title text-primary-color')}>
                {t('Open Votes')}
              </div>
              <div className="open-votes-wrapper">
                <div className="voting-alert-wrapper">
                  {(!loginInfo && !loginId) || playerShareHold === 0 ? (
                    <div className="voting-alert-text">{`Buy $${ticker} Tokens and stake them to earn XP and be eligible to vote`}</div>
                  ) : stakingBalance === 0 ? (
                    <>
                      <div className="voting-alert-text">{`Stake your ${getFlooredFixed(
                        playerShareHold,
                        2,
                      )} $${ticker} Tokens in order to vote`}</div>
                      <div className="voting-alert-comment">{`Your current voting power is ${votingPower}% of all votes`}</div>
                    </>
                  ) : openVoteInfo.filter((item: any) => item.hasivoted === 1)
                      .length === 0 ? (
                    <div className="voting-alert-text">{`Your current voting power is ${votingPower}% of all votes`}</div>
                  ) : (
                    <div className="voting-alert-text fg-primary-color">{`Your vote currently holds ${votingPower}% of voting power`}</div>
                  )}
                </div>
                <div className="open-votes-content player-dashboard-container">
                  {openVoteList.map((item: any, index: number) => (
                    <div
                      className="NftList-poll-container NftList-poll-closed-container"
                      key={index}
                    >
                      <div className="NftList-poll-header">{item.question}</div>
                      <div className="NftList-poll-body">
                        {openVoteInfo.filter(
                          (item: any) => item.hasivoted === 1,
                        ).length === 0 ? (
                          <>
                            {openExpandFlag &&
                              openVoteInfo.map(
                                (voteItem: any, detailIndex: number) => (
                                  <div
                                    className={classNames(
                                      'NftList-poll-item',
                                      selectedThemeRedux,
                                    )}
                                    key={detailIndex}
                                    onClick={() =>
                                      handleVoteAction(detailIndex)
                                    }
                                  >
                                    <div className="text-content">
                                      <div className="text-content-left">
                                        {voteItem?.selectiontext}
                                      </div>
                                      <div
                                        className={classNames(
                                          'fg-primary-color capitalize text-content-right',
                                          countDownDate <= 0
                                            ? 'voting-disabled'
                                            : '',
                                        )}
                                      >
                                        {t('vote')}
                                      </div>
                                    </div>
                                  </div>
                                ),
                              )}
                          </>
                        ) : (
                          <>
                            {openExpandFlag &&
                              openVoteInfo.map(
                                (voteItem: any, detailIndex: number) => (
                                  <div
                                    className={classNames(
                                      'NftList-poll-item poll-voted',
                                      voteItem.hasivoted > 0
                                        ? 'poll-voted-item'
                                        : '',
                                      selectedThemeRedux,
                                    )}
                                    style={{ position: 'relative' }}
                                    key={detailIndex}
                                  >
                                    <div
                                      className="grey-bar"
                                      style={{
                                        width:
                                          getVotePercentage(voteItem) + '%',
                                      }}
                                    />
                                    <div className="poll-text text-content">
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
                          </>
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
            </div>
          )}
          {voteList.length > 0 && (
            <div className="polls-wrapper">
              <div className={classNames('blog-title text-primary-color')}>
                {t('Closed Votes')}
              </div>
              <div className="closed-vote-container player-dashboard-container">
                {voteList.length > 0 &&
                  voteList.map((item: any, index: number) => (
                    <div
                      className="NftList-poll-container NftList-poll-closed-container vote-card-size"
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
                                  voteItem.hasivoted > 0
                                    ? 'poll-voted-item'
                                    : '',
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
                        <div
                          className="expand-section"
                          onClick={() => {
                            setSelectedPoll(index)
                            setOpenPoll(!isOpenPoll)
                          }}
                        >
                          <span>
                            {item.voterCount}
                            {t('votes')}
                          </span>
                          <span className="arrow-down">
                            {selectedPoll === index && isOpenPoll ? (
                              <ArrowDown />
                            ) : (
                              <ArrowUp />
                            )}
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

export default Votings
