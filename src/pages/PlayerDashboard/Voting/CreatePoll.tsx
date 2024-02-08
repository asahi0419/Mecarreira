import FormInput from '@components/Form/FormInput'
import SubmitButton from '@components/Button/SubmitButton'
import { useEffect, useState } from 'react'
import { monthSet } from '@root/constants'
import { useTranslation } from 'react-i18next'
import { FieldArray, Formik, ErrorMessage } from 'formik'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import * as Yup from 'yup'
import { isMobile } from '@utils/helpers'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import Web3BottomPopup from '@components/Dialog/Web3BottomPopup'
import {
  getBlockdeadline,
  getOpenVoteList,
  resetBlockdeadline,
  createVote,
} from '@root/apis/playerCoins/playerCoinsSlice'
import ApiBottomPopup from '@components/Dialog/ApiBottomPopup'
import { useWalletHelper } from '@utils/WalletHelper'

const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const today = new Date()
const targetDate = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate(),
)
interface Years {
  id: number
  value: number
  title: number
}

const initialValues = {
  daySelected: '',
  monthSelected: '',
  yearSelected: '',
  question: '',
  answer: ['', ''],
}

interface Props {
  onClose: any
}
const CreatePoll: React.FC<Props> = ({ onClose }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [yearSet, setYearSet] = useState<Years[]>([])
  const [daysSet, setDaysSet] = useState<Years[]>([])
  const [showBottomPopup, setShowBottomPopup] = useState<boolean>(false)
  const [txnHash, setTxnHash] = useState<string>('')
  const [txnErr, setTxnErr] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')

  const playerCoinData = useSelector((state: RootState) => state.playercoins)

  const {
    selectedPlayer,
    player1contract,
    stakingcontract,
    stakingcontractabi,
    staking2contract,
    staking2contractabi,
    isGetBlockdeadlineSuccess,
    blockdeadline,
  } = playerCoinData

  const { getStakingContract } = useWalletHelper()

  useEffect(() => {
    window.scrollTo(0, 0)
    setDate(targetDate)
    setYears(20)
  }, [])

  function setDate(date: any) {
    setDays(date.getMonth())
  }

  function setDays(monthIndex: number) {
    const optionCount = 0
    const daysCount = daysInMonth[monthIndex]
    const daysArr: any[] = []
    if (optionCount < daysCount) {
      for (let i = optionCount; i < daysCount; i++) {
        daysArr.push({
          id: i + 1,
          value: i + 1,
          title: i + 1,
        })
      }
      setDaysSet(daysArr)
    }
  }

  function setYears(val: number) {
    const year = targetDate.getFullYear()
    const yearArr: any[] = []
    for (let i = 0; i < val; i++) {
      yearArr.push({
        id: i + 1,
        value: year + i,
        title: year + i,
      })
    }
    setYearSet(yearArr)
  }

  const handleMonthChange = (evt: any) => {
    setDays(evt.target.value)
  }

  const validate = (values: any) => {
    const errors: any = {}
    if (
      new Date(
        values.yearSelected +
          '-' +
          (parseInt(values.monthSelected) + 1) +
          '-' +
          values.daySelected,
      ).getTime() < new Date().getTime()
    ) {
      errors.yearSelected = t('the closing voting date')
    }
    if (
      new Date(
        values.yearSelected +
          '-' +
          (parseInt(values.monthSelected) + 1) +
          '-' +
          values.daySelected,
      ).getTime() > new Date(new Date().getTime() + 86400000 * 30).getTime()
    ) {
      errors.yearSelected = t('the closing voting date must be less')
    }
    return errors
  }

  const handleClose = () => {
    setShowBottomPopup(false)
    setTxnErr('')
    setTxnHash('')
    dispatch(getOpenVoteList(player1contract))
    onClose()
  }

  const handleCreatePoll = (values: any) => {
    console.log('stakingCOntract', {
      values,
      stakingcontract,
      stakingcontractabi,
      staking2contract,
      staking2contractabi,
    })
    if (!stakingcontract) {
      console.log('staking Contract not there')
      return
    }
    setQuestion(values.question)
    setAnswer(values.answer)
    dispatch(
      getBlockdeadline(
        values.yearSelected +
          '-' +
          (parseInt(values.monthSelected) + 1) +
          '-' +
          values.daySelected,
      ),
    )
  }

  const handleCreatePollUsingContract = async () => {
    if (isGetBlockdeadlineSuccess) {
      setShowBottomPopup(true)
      dispatch(resetBlockdeadline())
      if (localStorage.getItem('loginId')) {
        return
      }
      const stakingContract = await getStakingContract(
        stakingcontract,
        stakingcontractabi,
      )
      console.log({ stakingContract })
      stakingContract
        ?.createPoll(question, answer, blockdeadline)
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
  }

  useEffect(() => {
    handleCreatePollUsingContract()
  }, [isGetBlockdeadlineSuccess])

  const handleCreatePollApi = (user_secret: any) => {
    const formData = new FormData()
    formData.append('text', question)
    formData.append('options', answer)
    formData.append('end_block', blockdeadline)
    formData.append('user_secret', user_secret)
    formData.append('contract', selectedPlayer?.playercontract)
    dispatch(createVote(formData))
  }

  return (
    <>
      {showBottomPopup &&
        (localStorage.getItem('loginInfo') ? (
          <Web3BottomPopup
            showPopup={showBottomPopup}
            txnHash={txnHash}
            txnErr={txnErr}
            onClose={handleClose}
            customClass={isMobile() ? 'exwallet-bottomwrapper' : ''}
          />
        ) : (
          <ApiBottomPopup
            showPopup={showBottomPopup}
            onSubmit={handleCreatePollApi}
            onClose={handleClose}
            customClass="purchase-pc-bottomwrapper"
          />
        ))}
      <div className="createpoll-input-container">
        <div className="nft-tab-title">{t('create a new voting poll')}</div>
        <Formik
          initialValues={initialValues}
          onSubmit={handleCreatePoll}
          validate={validate}
          validationSchema={Yup.object().shape({
            daySelected: Yup.string().required(t('date is required')),
            monthSelected: Yup.string().required(t('month is required')),
            yearSelected: Yup.string().required(t('year is required')),
            question: Yup.string().required(t('question is required')),
            answer: Yup.array().of(
              Yup.string().required(t('answer is required')),
            ),
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
            const [questionLen, setQuestionLen] = useState(
              values.question ? 80 - values.question.length : 80,
            )
            const [answersLen, setAnswersLen] = useState<any[]>(
              Array(6).fill(25),
            )
            return (
              <form autoComplete="off" onSubmit={handleSubmit}>
                <div className="createpoll-input-item">
                  <div className="input-label">{t('vote closes on')}</div>
                  <div className="birthday" style={{ marginTop: '6px' }}>
                    <select
                      id="select-day"
                      className="dob-select"
                      value={values.daySelected}
                      name="daySelected"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option>DD</option>
                      {daysSet.map(({ value, title }, index) => (
                        <option key={index} value={value}>
                          {title}
                        </option>
                      ))}
                    </select>
                    <select
                      id="select-month"
                      className="dob-select"
                      value={values.monthSelected}
                      name="monthSelected"
                      onChange={(event: any) => {
                        handleChange(event)
                        handleMonthChange(event)
                      }}
                      onBlur={handleBlur}
                    >
                      <option>MM</option>
                      {monthSet.map(({ value, title }, index) => (
                        <option key={index} value={value}>
                          {title}
                        </option>
                      ))}
                    </select>
                    <select
                      id="select-year"
                      className="dob-select"
                      value={values.yearSelected}
                      name="yearSelected"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option>YYYY</option>
                      {yearSet.map(({ value, title }, index) => (
                        <option key={index} value={value}>
                          {title}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.daySelected && touched.daySelected && (
                    <div className="input-feedback">{errors.daySelected}</div>
                  )}
                  {errors.yearSelected && touched.yearSelected && (
                    <div className="input-feedback">{errors.monthSelected}</div>
                  )}
                  {errors.yearSelected && touched.yearSelected && (
                    <div className="input-feedback">{errors.yearSelected}</div>
                  )}
                </div>
                <div className="createpoll-input-item">
                  <div className="input-label">{t('voting question')}</div>
                  <textarea
                    className="createpoll-textarea"
                    placeholder={t('enter voting question')}
                    name="question"
                    maxLength={80}
                    value={values.question}
                    onChange={(e: any) => {
                      const length = e.target.value.length
                      setQuestionLen(80 - length)
                      handleChange(e)
                    }}
                    onBlur={handleBlur}
                  ></textarea>
                </div>
                {questionLen < 80 && questionLen >= 0 && (
                  <div className="gallery-current-number">
                    {t('characters left')}: {questionLen}
                  </div>
                )}
                {errors.question && touched.question && (
                  <div className="input-feedback">{errors.question}</div>
                )}
                <FieldArray
                  name="answer"
                  render={arrayHelpers => (
                    <div>
                      {values.answer.map((item, index) => (
                        <div key={index}>
                          <div className="createpoll-input-item">
                            <div className="input-label">
                              {t('answer')}
                              {index + 1}
                            </div>
                            <FormInput
                              type="text"
                              placeholder={t('enter answer')}
                              name={`answer.${index}`}
                              maxLength={25}
                              value={values.answer[index]}
                              handleChange={(e: any) => {
                                setAnswersLen(
                                  answersLen.map((item, i) =>
                                    i === index
                                      ? 25 - e.target.value.length
                                      : item,
                                  ),
                                )
                                handleChange(e)
                              }}
                              onBlur={handleBlur}
                            />
                            {index > 0 && (
                              <DeleteForeverOutlinedIcon
                                onClick={() => arrayHelpers.remove(index)}
                              />
                            )}
                          </div>
                          {answersLen[index] < 25 && answersLen[index] >= 0 && (
                            <div className="gallery-current-number">
                              {t('characters left')}: {answersLen[index]}
                            </div>
                          )}
                          <ErrorMessage
                            name={`answer.${index}`}
                            component="div"
                            className="input-feedback"
                          />
                          {index === values.answer.length - 1 && index <= 4 && (
                            <div
                              className="createpoll-answer-addbtn"
                              onClick={() => arrayHelpers.insert(index + 1, '')}
                            >
                              {t('add more answers')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                />
                <SubmitButton
                  isDisabled={false}
                  title={t('create voting poll')}
                  className="createpoll-createbtn"
                  onPress={handleSubmit}
                />
              </form>
            )
          }}
        </Formik>
      </div>
    </>
  )
}

export default CreatePoll
