import { PLAYER_STATUS } from '@root/constants'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { RootState } from '@root/store/rootReducers'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import ReplyIcon from '@mui/icons-material/Reply'
import classNames from 'classnames'
import { Formik } from 'formik'
import * as Yup from 'yup'
import SubmitButton from '@components/Button/SubmitButton'
import FormInput from '@components/Form/FormInput'
import FormTextArea from '@components/Form/FormTextArea'
import DialogBox from '@components/Dialog/DialogBox'
import Web3BottomPopup from '@components/Dialog/Web3BottomPopup'
import ApiBottomPopup from '@components/Dialog/ApiBottomPopup'
import { useWalletHelper } from '@utils/WalletHelper'
import { timeAgo } from '@utils/helpers'
import {
  getMessages,
  getMessagesReply,
} from '@root/apis/playerCoins/playerCoinsSlice'
import { toast } from 'react-hot-toast'
import { showSignupForm } from '@root/apis/onboarding/authenticationSlice'
import { ethers } from 'ethers'
import ImageComponent from '@components/ImageComponent'
import ReturnIcon from '@components/Svg/ReturnIcon'

interface Props {
  message: any
  msgIndex: number
  isCommentMode: boolean
  onBack: any
}

const Message: React.FC<Props> = ({
  message,
  msgIndex,
  isCommentMode = false,
  onBack,
}) => {
  console.log('checkingdownvote', { message })
  const { t } = useTranslation()
  const maxMessageBodyLength = 250

  const [isPostMode, setIsPostMode] = useState(isCommentMode)
  const loginId = localStorage.getItem('loginId')
  const loginInfo = localStorage.getItem('loginInfo')
  const dispatch = useDispatch()
  const [txnError, setTxnError] = useState('')
  const [txnHash, setTxnHash] = useState('')
  const [showBottomPopup, setShowBottomPopup] = useState(false)
  const { callWeb3Method, getWeb3Provider } = useWalletHelper()
  const [loader, setLoader] = useState(false)
  const [getAvailability, setGetAvailability] = useState(0)
  const [blockNumber, setBlockNumber] = useState(0)
  const [votingBalance, setVotingBalance] = useState(0)
  const [bodyErrorMsg, setBodyErrorMsg] = useState('')
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const {
    stakingcontract,
    stakingcontractabi,
    player1contract,
    player2contract,
    isLoadingMessagesReply,
    isGetMessagesReplySuccess,
    isGetMessagesSuccess = [],
    isGetMessagesReplyError,
  } = playerCoinData
  const { stakingBalance } = useSelector(
    (state: RootState) => state.playercoins,
  )
  const getAllMessageReply = () => {
    dispatch(
      getMessagesReply({
        playerContract: player1contract || player2contract,
        parent: message?.parent,
      }),
    )
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
      const getAvailability =
        await getNextAvailability.getNextAvailabilityForActivity(type)
      const value = parseInt(getAvailability._hex)
      setGetAvailability(value)
      const currentBlockNumber = await provider.getBlockNumber()
      setBlockNumber(currentBlockNumber)
      setLoader(false)
      console.log('getAvailabilityMessages', {
        getAvailability,
        value,
        currentBlockNumber,
      })
    } catch (error) {
      console.log('error', error)
    }
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
    getAllMessageReply()
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (loginInfo) {
      setLoader(true)
      checkAvailability()
      checkVotingBalance()
    }
  }, [])

  // useEffect(() => {
  //   if (isGetMessagesSuccess.length > 0) {
  //     // setMessages(isGetMessagesSuccess)
  //   }
  // }, [isGetMessagesSuccess])
  console.log({ isGetMessagesSuccess, msgIndex })

  const handleAddComment = () => {
    if (loginId || loginInfo) {
      if (loader) {
        // toast.error('Please wait while loading staking balance')
      } else if (stakingBalance >= 1) {
        if (blockNumber > getAvailability) {
          setIsPostMode(true)
        } else {
          toast.error('You can only post once within a 24-hour period.')
        }
      } else {
        toast.error('Staked token required')
      }
    } else {
      dispatch(showSignupForm())
    }
  }
  const initialValues = {
    username: 'FootballTrader401',
    replied_at: 'a few minutes ago',
    body: '',
    reply_count: 0,
  }
  const submitForm = (values: any) => {
    if (values.body.trim()) {
      const reqParams = {
        avatar: null,
        username: initialValues.username,
        replied_at: initialValues.replied_at,
        body: values.body.trim(),
        voting_count: 0,
      }
      // setIsPostMode(false)
      // setReplyList([...replyList, reqParams])
      if (loginId) {
        return
      }
      if (loginInfo) {
        setShowBottomPopup(true)
        // console.log('trim body', reqParams?.body)
        const promise = callWeb3Method(
          'writeMessage',
          stakingcontract,
          stakingcontractabi,
          ['', reqParams?.body, message?.parent],
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
  }
  const handleClose = () => {
    if (txnHash) {
      setIsPostMode(false)
      if (loginInfo) {
        dispatch(getMessages(player1contract || player2contract))
        dispatch(
          getMessagesReply({
            playerContract: player1contract || player2contract,
            parent: message?.parent,
          }),
        )
        checkVotingBalance()
        checkAvailability()
      }
    }
    setShowBottomPopup(false)
    setTxnError('')
    setTxnHash('')
  }
  const handleClaimApi = (user_secret: any) => {
    console.log('login with Internal')
  }
  const handleVote = (param, parent, sub) => {
    console.log('handleVote message', { param, parent, sub })
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
        toast.error(t('insufficient voting balance'))
      }
    } else {
      dispatch(showSignupForm())
    }
  }

  // const [bodyError, setBodyError] = useState('')

  return (
    <>
      <section className="fullwidth message-container box-wrapper">
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

        {isPostMode ? (
          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            onSubmit={submitForm}
            validationSchema={Yup.object().shape({
              body: Yup.string().required(t('content required')),
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

              const [currentNumberBody, setCurrentNumberBody] = useState(
                values.body
                  ? maxMessageBodyLength - values.body.length
                  : maxMessageBodyLength,
              )
              const [disableFlagBody, setDisableFlagBody] = useState(false)

              return (
                <form autoComplete="off" onSubmit={handleSubmit}>
                  <div className="field-wrapper">
                    <label>
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
                        if (length > maxMessageBodyLength) {
                          setDisableFlagBody(true)
                        } else {
                          setDisableFlagBody(false)
                        }
                        // const inputValue = e.target.value
                        // // Trim the input value to remove spaces at the beginning and end
                        // const trimmedValue = inputValue.trim()
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
                      <div className="input-feedback">{errors.body}</div>
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
                      isDisabled={disableFlagBody}
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
        ) : null}
        <div className="message-content">
          <div className="message-posted">
            <div>
              {t('Posted by')} {message?.username}
            </div>
            <div>•</div>
            <div>{timeAgo(message?.createdsecago)}</div>
          </div>
          <div className="message-title">{message?.title}</div>
          <div className="message-body">{message?.body}</div>
          <div className="message-actions">
            <div
              className="message-action-voting"
              onClick={e => e.stopPropagation()}
            >
              <ThumbUpIcon
                onClick={() => {
                  vote(false, message?.parent, message?.sub)
                }}
                style={{ color: 'var(--profit-color)' }}
              />
              {/* <div className="voting-count">{message?.upvotes}</div> */}
              <div className="voting-count">
                {isGetMessagesSuccess.length > 0
                  ? isGetMessagesSuccess[msgIndex]?.upvotes
                  : message?.upvotes}
              </div>
              <ThumbDownIcon
                onClick={() => {
                  vote(true, message?.parent, message?.sub)
                }}
                style={{ color: 'var(--loss-color)' }}
              />
              {/* <div className="voting-count">{message?.downvotes}</div> */}

              <div className="voting-count">
                {isGetMessagesSuccess.length > 0
                  ? isGetMessagesSuccess[msgIndex]?.downvotes
                  : message?.downvotes}
              </div>
            </div>
            <div className="message-action-reply">
              <ReplyIcon />
              <p style={{ marginBottom: '12px' }}>{message?.replies}</p>
            </div>
          </div>
          {!isPostMode ? (
            <div className="comment-btn-wrapper" onClick={handleAddComment}>
              <div>+ {t('Add a Comment')}</div>
            </div>
          ) : null}
        </div>
        <div className="comments-container">
          {isLoadingMessagesReply ? (
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
          ) : isGetMessagesReplySuccess.length > 0 ? (
            <>
              {isGetMessagesReplySuccess.map((item, index) => {
                return (
                  <div className="comment-container" key={index}>
                    <div className="comment-header">
                      <div className="comment-avatar">
                        <div className="image-border">
                          <div
                            className={classNames(
                              'nft-image',
                              item?.avatar ?? 'group-0',
                            )}
                          />
                        </div>
                      </div>
                      <div className="comment-username">{item?.username}</div>
                      <div>•</div>
                      <div className="comment-created">
                        {timeAgo(item?.createdsecago)}
                      </div>
                    </div>
                    <div className="comment-content">
                      <div className="message-body">{item?.body}</div>
                      <div className="message-actions">
                        <div
                          className="message-action-voting"
                          onClick={e => e.stopPropagation()}
                        >
                          <ThumbUpIcon
                            onClick={() => {
                              vote(false, item?.parent, item?.sub)
                            }}
                            style={{ color: 'var(--profit-color)' }}
                          />
                          <div className="voting-count">{item?.upvotes}</div>
                          <ThumbDownIcon
                            onClick={() => {
                              vote(true, item?.parent, item?.sub)
                            }}
                            style={{ color: 'var(--loss-color)' }}
                          />
                          <div className="voting-count">{item?.downvotes}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </>
          ) : (
            <div className="alert-wrapper" style={{ margin: '0px' }}>
              <div
                style={{
                  textAlign: 'center',
                  width: '100%',
                  height: 'auto',
                  fontSize: '54px',
                  lineHeight: '3.25rem',
                  marginBottom: '20px',
                }}
                className="heading-title unverified-alert"
              >
                {t('No Comments')}
              </div>
            </div>
          )}
        </div>
        <div style={{ position: 'absolute', bottom: '-48px', right: '0' }}>
          <ReturnIcon width="35px" height="35px" onClick={() => onBack()} />
        </div>
      </section>
    </>
  )
}

export default Message
