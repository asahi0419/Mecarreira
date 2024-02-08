import { BLOCK_TIME, PLAYER_STATUS } from '@root/constants'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { RootState } from '@root/store/rootReducers'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import ReplyIcon from '@mui/icons-material/Reply'
import Message from './Message'
import { Formik } from 'formik'
import * as Yup from 'yup'
import SubmitButton from '@components/Button/SubmitButton'
import FormInput from '@components/Form/FormInput'
import FormTextArea from '@components/Form/FormTextArea'
import { isMobile, timeAgo } from '@utils/helpers'
import {
  showSignupForm,
  showStakingForm,
} from '@root/apis/onboarding/authenticationSlice'
import { useWalletHelper } from '@utils/WalletHelper'
import {
  checkPlayerStatus,
  getMessages,
  getMessagesReply,
} from '@root/apis/playerCoins/playerCoinsSlice'
import Web3BottomPopup from '@components/Dialog/Web3BottomPopup'
import ApiBottomPopup from '@components/Dialog/ApiBottomPopup'
import DialogBox from '@components/Dialog/DialogBox'
import Spinner from '@components/Spinner'
import { toast } from 'react-hot-toast'
import { ethers } from 'ethers'
import ArrowDown from '@components/Svg/ArrowDown'
import ArrowUp from '@components/Svg/ArrowUp'

const Messages = () => {
  const authToken = localStorage.getItem('accessToken')
  const { t } = useTranslation()
  const maxMessageTitleLength = 50
  const maxMessageBodyLength = 250
  const [isDetailView, setIsDetailView] = useState(false)
  const [isPostMode, setIsPostMode] = useState(false)
  const [isCommentMode, setIsCommentMode] = useState(false)
  const [message, setMessage] = useState(null)
  const [msgIndex, setMsgIndex] = useState(null)
  const [messages, setMessages] = useState<any>([])
  const loginId = localStorage.getItem('loginId')
  const loginInfo = localStorage.getItem('loginInfo')
  const dispatch = useDispatch()
  const [txnError, setTxnError] = useState('')
  const [txnHash, setTxnHash] = useState('')
  const [showStats, setShowStats] = useState(!isMobile())
  const [showBottomPopup, setShowBottomPopup] = useState(false)
  const { callWeb3Method, getWeb3Provider } = useWalletHelper()
  const [loader, setLoader] = useState(false)
  const [getAvailability, setGetAvailability] = useState(0)
  const [blockNumber, setBlockNumber] = useState(0)
  const [votingBalance, setVotingBalance] = useState(0)
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const {
    stakingcontract,
    stakingcontractabi,
    player1contract,
    player2contract,
    isLoadingMessages,
    isGetMessagesSuccess,
    getPlayerDetailsSuccessData,
    allPlayersDataCheckStatus,
  } = playerCoinData
  const { stakingBalance } = useSelector(
    (state: RootState) => state.playercoins,
  )
  useEffect(() => {
    if (isGetMessagesSuccess.length > 0) {
      setMessages(isGetMessagesSuccess)
    }
  }, [isGetMessagesSuccess])

  const getAllMessages = () => {
    setMessages([])
    dispatch(getMessages(player1contract || player2contract))
  }

  const checkVotingBalance = () => {
    if (loginId) {
      return
    }
    if (loginInfo) {
      const promise = callWeb3Method(
        'getMessageVotingBalance',
        stakingcontract,
        stakingcontractabi,
        [],
      )
      promise
        .then((txn: any) => {
          setVotingBalance(parseInt(txn?._balance?._hex) / 1000000000000000000)
          console.log(
            'getMessageVotingBalance',
            parseInt(txn?._balance?._hex) / 1000000000000000000,
            parseInt(txn?._total?._hex) / 1000000000000000000,
          )
        })
        .catch((err: any) => {
          if (err.message === '406') {
            console.log(t('this functionality unavailable for internal users'))
          } else {
            console.log(err.reason || err.message)
          }
        })
    }
  }

  useEffect(() => {
    if (authToken) {
      dispatch(checkPlayerStatus())
    }
  }, [authToken])

  useEffect(() => {
    if (player1contract || player2contract) {
      getAllMessages()
      if (loginInfo) {
        setLoader(true)
        checkAvailability()
        checkVotingBalance()
      }
    }
    console.log('contract', { stakingcontract, stakingcontractabi })
  }, [player1contract, player2contract])

  const handleOpenMessage = (event, index, _isCommentMode) => {
    setIsCommentMode(_isCommentMode)
    console.log('HOM--', { index, messages })
    setMessage(messages[index])
    setMsgIndex(index)
    setIsDetailView(true)
    setIsPostMode(false)
    event.stopPropagation()
  }
  const handlePostMessage = () => {
    console.log({
      tts: getPlayerDetailsSuccessData?.playercontract,
      sts: allPlayersDataCheckStatus,
    })
    if (loginId || loginInfo) {
      if (loader) {
        // toast.error('Please wait while loading staking balance')
      } else if (stakingBalance >= 1) {
        if (
          getPlayerDetailsSuccessData?.playercontract?.toLowerCase() ===
          allPlayersDataCheckStatus[0]?.playercontract?.toLowerCase()
        ) {
          // if (blockNumber > getAvailability) {
          setIsPostMode(true)
          // } else { // Disabled due to this ticket "Player can always write mesages on his own board"
          //   toast.error('You can only post once within a 24-hour period.')
          // }
        } else {
          if (blockNumber > getAvailability) {
            setIsPostMode(true)
          } else {
            // Disabled due to this ticket "Player can always write mesages on his own board"
            toast.error(t('You can only post once within a 24-hour period.'))
          }
        }
      } else {
        toast.error(t('Staked token required'))
      }
    } else {
      dispatch(showSignupForm())
    }
  }

  const handleVote = (param, parent, sub) => {
    console.log('handleVote index', { param, parent, sub })
    if (loginId) {
      return
    }
    if (loginInfo) {
      setShowBottomPopup(true)
      const promise = callWeb3Method(
        'voteMessage',
        stakingcontract,
        stakingcontractabi,
        [parent, sub, param, ethers.utils.parseEther('1')],
      )
      promise
        .then((txn: any) => {
          console.log('voteMessage', txn?.hash)
          setTxnHash(txn?.hash)
        })
        .catch((err: any) => {
          console.log('error voting', err)
          const isErrorGasEstimation = `${err}`.includes('cannot estimate gas')
          if (err.message === '406') {
            setTxnError(t('this functionality unavailable for internal users'))
          }
          if (isErrorGasEstimation) {
            setTxnError(t('not enough funds to pay for blockchain transaction'))
          } else {
            setTxnError(err.reason || err.message)
          }
        })
    }
  }

  const vote = (param, parent, sub) => {
    if (loginId || loginInfo) {
      console.log('vote', param)
      if (votingBalance > 0) {
        handleVote(param, parent, sub)
      } else {
        toast.error(
          t(
            'Your voting balance is insufficient for obtaining stake player tokens',
          ),
        )
      }
    } else {
      dispatch(showSignupForm())
    }
  }

  const initialValues = {
    voting_count: 0,
    username: 'FootballTrader401',
    posted_at: 'a few minutes ago',
    title: '',
    body: '',
    reply_count: 0,
  }
  const submitForm = (values: any) => {
    if (values.title.trim()) {
      if (values.body.trim()) {
        const reqParams = {
          voting_count: values.voting_count,
          username: values.username,
          posted_at: values.posted_at,
          title: values.title.trim(),
          body: values.body.trim(),
          reply_count: values.reply_count,
        }
        // setMessages([...messages, reqParams])
        // setIsPostMode(false)
        if (loginId) {
          return
        }
        if (loginInfo) {
          setShowBottomPopup(true)
          // console.log('trim body', reqParams?.body, reqParams?.title)
          const promise = callWeb3Method(
            'writeMessage',
            stakingcontract,
            stakingcontractabi,
            [reqParams?.title, reqParams?.body, 0],
          )
          promise
            .then((txn: any) => {
              console.log('messages', txn)
              setTxnHash(txn?.hash)
            })
            .catch((err: any) => {
              const isErrorGasEstimation = `${err}`.includes(
                'cannot estimate gas',
              )
              if (err.message === '406') {
                setTxnError(
                  t('this functionality unavailable for internal users'),
                )
              }
              if (isErrorGasEstimation) {
                setTxnError(
                  t('not enough funds to pay for blockchain transaction'),
                )
              } else {
                setTxnError(err.reason || err.message)
              }
            })
        }
      } else {
        setBodyErrorMsg(t('Body can not be empty'))
      }
    } else {
      setTitleErrorMsg(t('Title can not be empty'))
    }
  }
  const handleClose = () => {
    if (txnHash) {
      setIsPostMode(false)
      if (loginInfo) {
        dispatch(getMessages(player1contract || player2contract))
        // dispatch(
        //   getMessagesReply({
        //     playerContract: player1contract || player2contract,
        //     parent: message?.parent,
        //   }),
        // )
        checkAvailability()
        checkVotingBalance()
      }
    }
    setShowBottomPopup(false)
    setTxnError('')
    setTxnHash('')
  }
  const handleClaimApi = (user_secret: any) => {
    console.log('login with Internal')
  }
  const checkAvailability = async () => {
    const provider = await getWeb3Provider()
    const getNextAvailability = new ethers.Contract(
      stakingcontract, // contract address of Router
      stakingcontractabi, //  contract abi of Router
      provider.getSigner(loginInfo!),
    )
    const type = 1
    try {
      const isGetAvailability =
        await getNextAvailability.getNextAvailabilityForActivity(type)
      const value = parseInt(isGetAvailability._hex)
      setGetAvailability(value)
      const currentBlockNumber = await provider.getBlockNumber()
      setBlockNumber(currentBlockNumber)
      setLoader(false)
      // blockNumber > getAvailability
      console.log('getAvailabilityMessages', {
        isGetAvailability,
        value,
        currentBlockNumber,
      })
    } catch (error) {
      console.log('error', error)
    }
  }
  const handleClearDetailView = () => {
    setIsDetailView(false)
    setMsgIndex(null)
  }
  const [titleError, setTitleError] = useState('')
  const [bodyErrorMsg, setBodyErrorMsg] = useState('')
  const [titleErrorMsg, setTitleErrorMsg] = useState('')

  // const [bodyError, setBodyError] = useState('')

  const [countDownTime, setCountDownTime] = useState<number>(0)

  let countDown: any = null
  const [state, setState] = useState({
    day: '0',
    hours: '0',
    minutes: '0',
    seconds: '0',
  })
  const [endable, setEndable] = useState(false)

  const updateState = (data: any) => {
    setState(state => ({ ...state, ...data }))
  }

  const initCountDown = () => {
    clearInterval(countDown)
    countDown = setInterval(function () {
      const countDownDate = new Date(countDownTime).getTime()
      const now = new Date().getTime()
      const distance = countDownDate < now ? 0 : countDownDate - now
      if (distance < 0) {
        setEndable(true)
      }
      const day = ~~(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      )
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)
      if (distance < 0) {
        clearInterval(countDown)
        updateState({
          day: '0',
          hours: '0',
          minutes: '0',
          seconds: '0',
        })
      } else {
        updateState({
          day,
          hours,
          minutes,
          seconds,
        })
      }
    }, 1000)
  }

  useEffect(() => {
    if (countDownTime > 0) {
      initCountDown()
    }
  }, [countDownTime])

  // Disabled due to this ticket "Player can always write mesages on his own board"
  useEffect(() => {
    if (
      blockNumber > 0 &&
      getAvailability > 0 &&
      blockNumber < getAvailability
    ) {
      if (countDownTime === 0) {
        setCountDownTime(
          new Date().getTime() + (getAvailability - blockNumber) * BLOCK_TIME,
        )
      }
    }
  }, [getAvailability, blockNumber])

  const handleStakeFormOpen = () => {
    if (!loginInfo && !loginId) {
      dispatch(showSignupForm())
      return
    }
    dispatch(showStakingForm({ playerData: getPlayerDetailsSuccessData }))
  }

  return (
    <section className="messages-container">
      {showBottomPopup && (
        <DialogBox
          isOpen={showBottomPopup}
          onClose={handleClose}
          contentClass={isMobile() ? 'post-msg-popup' : 'onboarding-popup'}
        >
          <div className="nft-tab-title pt-50">{t('please wait')}...</div>
          {localStorage.getItem('loginInfo') ? (
            <Web3BottomPopup
              showPopup={showBottomPopup}
              txnHash={txnHash}
              txnErr={txnError}
              onClose={handleClose}
            />
          ) : (
            <ApiBottomPopup
              showPopup={showBottomPopup}
              onSubmit={handleClaimApi}
              onClose={handleClose}
              customClass="purchase-pc-bottomwrapper"
            />
          )}
        </DialogBox>
      )}
      {isDetailView ? (
        <Message
          message={message}
          msgIndex={msgIndex}
          isCommentMode={isCommentMode}
          onBack={() => handleClearDetailView()}
        />
      ) : (
        <>
          {isPostMode ? (
            <Formik
              enableReinitialize={true}
              initialValues={initialValues}
              onSubmit={submitForm}
              validationSchema={Yup.object().shape({
                title: Yup.string().required('title required'),
                body: Yup.string().required('content required'),
              })}
            >
              {props => {
                const {
                  values,
                  touched,
                  errors,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                } = props

                const [currentNumberTitle, setCurrentNumberTitle] = useState(
                  values.title
                    ? maxMessageTitleLength - values.title.length
                    : maxMessageTitleLength,
                )
                const [currentNumberBody, setCurrentNumberBody] = useState(
                  values.body
                    ? maxMessageBodyLength - values.body.length
                    : maxMessageBodyLength,
                )
                const [disableFlagTitle, setDisableFlagTitle] = useState(false)
                const [disableFlagBody, setDisableFlagBody] = useState(false)

                return (
                  <form autoComplete="off" onSubmit={handleSubmit}>
                    <div className="field-wrapper">
                      <label style={{ marginBottom: '10px' }}>
                        <b>{t('title')}:</b>
                      </label>
                      <FormInput
                        id="title"
                        type="text"
                        name="title"
                        value={values.title}
                        maxLength={maxMessageTitleLength}
                        handleChange={(e: any) => {
                          setTitleErrorMsg('')
                          const length = e.target.value.length
                          // const inputValue = e.target.value

                          // // Trim the input value to remove spaces at the beginning and end
                          // const trimmedValue = inputValue.trim()

                          if (length > maxMessageTitleLength) {
                            setDisableFlagTitle(true)
                          } else {
                            setDisableFlagTitle(false)
                          }

                          // Check if the trimmed value is different from the original input value
                          // if (inputValue !== trimmedValue) {
                          //   // Display an error message and prevent form submission (if applicable)
                          //   setDisableFlagTitle(true)
                          //   setTitleError(
                          //     'Spaces at the beginning or end are not allowed.',
                          //   )
                          //   // You can also prevent form submission by returning false or using event.preventDefault()
                          // } else {
                          //   // Clear the error message if the input is valid
                          //   setDisableFlagTitle(false)
                          //   setTitleError('')
                          // }
                          setCurrentNumberTitle(maxMessageTitleLength - length)
                          handleChange(e)
                        }}
                        onBlur={handleBlur}
                      />
                      {errors.title && touched.title && (
                        <div className="input-feedback">
                          {errors.title.toString()}
                        </div>
                      )}
                      {titleErrorMsg && (
                        <div className="input-feedback">{titleErrorMsg}</div>
                      )}
                      <div className="input-feedback">{titleError}</div>
                      {currentNumberTitle < maxMessageTitleLength &&
                        currentNumberTitle >= 0 && (
                          <div className="gallery-current-number">
                            {t('characters left')}: {currentNumberTitle}
                          </div>
                        )}
                      <label style={{ margin: '10px 0px' }}>
                        <b>{t('message')}:</b>
                      </label>
                      <FormTextArea
                        id="body"
                        type="text"
                        name="body"
                        containerClass="textarea-wrapper"
                        value={values.body}
                        maxLength={maxMessageBodyLength}
                        handleChange={(e: any) => {
                          setBodyErrorMsg('')
                          const length = e.target.value.length
                          // const inputValue = e.target.value

                          // // Trim the input value to remove spaces at the beginning and end
                          // const trimmedValue = inputValue.trim()

                          if (length > maxMessageBodyLength) {
                            setDisableFlagBody(true)
                          } else {
                            setDisableFlagBody(false)
                          }

                          // // Check if the trimmed value is different from the original input value
                          // if (inputValue !== trimmedValue) {
                          //   // Display an error message and prevent form submission (if applicable)
                          //   setDisableFlagBody(true)
                          //   setBodyError(
                          //     'Spaces at the beginning or end are not allowed.',
                          //   )
                          //   // You can also prevent form submission by returning false or using event.preventDefault()
                          // } else {
                          //   // Clear the error message if the input is valid
                          //   setDisableFlagBody(false)
                          //   setBodyError('')
                          // }
                          setCurrentNumberBody(maxMessageBodyLength - length)
                          handleChange(e)
                        }}
                        onBlur={handleBlur}
                      />
                      {errors.body && touched.body && (
                        <div className="input-feedback mt-20">
                          {errors.body.toString()}
                        </div>
                      )}
                      {bodyErrorMsg && (
                        <div className="input-feedback">{bodyErrorMsg}</div>
                      )}
                      {/* <div className="input-feedback">{bodyError}</div> */}
                      {currentNumberBody < maxMessageBodyLength &&
                        currentNumberBody >= 0 && (
                          <div className="gallery-current-number">
                            {t('characters left')}: {currentNumberBody}
                          </div>
                        )}
                    </div>
                    <div className="send-divider mt-30 mb-20">
                      <SubmitButton
                        isDisabled={disableFlagTitle || disableFlagBody}
                        isLoading={false}
                        title={t('send')}
                        onPress={handleSubmit}
                      />
                      <div
                        className="form-submit-btn btn-disabled"
                        onClick={() => setIsPostMode(false)}
                      >
                        {t('discard')}
                      </div>
                    </div>
                  </form>
                )
              }}
            </Formik>
          ) : loginInfo ? (
            !showStats ? (
              <div className="box-wrapper">
                <div className="message-info-container">
                  <div className="message-info-wrapper">
                    <div className="message-info-title">
                      {t('write again in')}
                      <span onClick={() => setShowStats(true)}>
                        &nbsp;
                        <ArrowDown />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="box-wrapper user-message">
                {loader ? (
                  <div className="message-info-container">
                    <div className="message-alert">
                      <Spinner className="mt-0" spinnerStatus={true} />
                    </div>
                  </div>
                ) : stakingBalance === 0 ? (
                  <div className="message-info-container">
                    <div className="message-alert">
                      <span onClick={handleStakeFormOpen}>{t('stake')} </span>
                      {` $${getPlayerDetailsSuccessData?.ticker} ${t(
                        'tokens to write a message or upvote',
                      )}`}
                    </div>
                  </div>
                ) : (
                  <div className="message-info-container">
                    <div className="message-info-wrapper">
                      {isMobile() ? (
                        <div className="message-info-title">
                          {t('write again in')}
                          <span onClick={() => setShowStats(false)}>
                            &nbsp;
                            <ArrowUp />
                          </span>
                        </div>
                      ) : (
                        <div className="message-info-title">
                          {t('write again in')}
                        </div>
                      )}
                      <div className="message-info-value">
                        {countDownTime > 0 &&
                        getPlayerDetailsSuccessData?.playercontract?.toLowerCase() !==
                          allPlayersDataCheckStatus[0]?.playercontract?.toLowerCase() ? (
                          <>
                            {state.hours}h {state.minutes}m {state.seconds}s
                          </>
                        ) : (
                          <>{t('now')}</>
                        )}
                      </div>
                    </div>
                    <div className="message-info-wrapper">
                      <div className="message-info-title">
                        {t('votes remaining')}
                      </div>
                      <div className="message-info-value">
                        {Math.floor(votingBalance)}
                      </div>
                    </div>
                    <div className="message-btn" onClick={handlePostMessage}>
                      {t('Post a message')}
                    </div>
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="box-wrapper">
              <div className="message-btn-wrapper" onClick={handlePostMessage}>
                <div>{t('Post a message')}</div>
              </div>
            </div>
          )}
          <div className="box-wrapper user-message">
            {isLoadingMessages || !player1contract ? (
              <div
                className="loading-spinner"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: '100px auto',
                }}
              >
                <div className="spinner">
                  <div className="spinner"></div>
                </div>
              </div>
            ) : messages.length > 0 ? (
              <>
                {messages.map((item, index) => {
                  return (
                    <div
                      className="message-box"
                      key={index}
                      onClick={e => handleOpenMessage(e, index, false)}
                    >
                      <div
                        className="voting-actions"
                        onClick={e => e.stopPropagation()}
                      >
                        <ThumbUpIcon
                          onClick={() => {
                            vote(false, item?.parent, item?.sub)
                          }}
                          style={{ color: 'var(--profit-color)' }}
                        />
                        <div className="voting-count">{item.upvotes}</div>
                        <ThumbDownIcon
                          onClick={() => {
                            vote(true, item?.parent, item?.sub)
                          }}
                          style={{ color: 'var(--loss-color)' }}
                        />
                        <div className="voting-count">{item.downvotes}</div>
                      </div>
                      <div className="message-content">
                        <div className="message-posted">
                          {isMobile() ? (
                            <>
                              {`Posted by ${item.username}`}
                              <br />
                              {item.posted_at}
                            </>
                          ) : (
                            <>{`Posted by ${item.username} • ${timeAgo(
                              item.createdsecago,
                            )}`}</>
                          )}
                        </div>
                        <div className="message-title">{item.title}</div>
                        <div className="message-body">{item.body}</div>
                        <div className="message-actions">
                          <div
                            className="message-action-reply"
                            onClick={e => handleOpenMessage(e, index, false)}
                          >
                            <ReplyIcon />
                            {item.replies} {t('Replies')}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </>
            ) : (
              <div className="alert-wrapper">
                <div
                  style={{ textAlign: 'center' }}
                  className="heading-title unverified-alert"
                >
                  {t('No Messages')}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  )
}

export default Messages
