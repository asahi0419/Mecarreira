import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import maticIcon from '@assets/images/matic-token-icon.webp'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { truncateDecimals } from '@utils/helpers'
import SubmitButton from '@components/Button/SubmitButton'
import classnames from 'classnames'
import DialogBox from '@components/Dialog/DialogBox'
import ApiActionPrompt from '@components/Dialog/ApiActionprompt'
import ImageComponent from '@components/ImageComponent'
import {
  getReferralData,
  postReferralPayout,
} from '@root/apis/onboarding/authenticationSlice'

function Earnings() {
  const { t } = useTranslation()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { referralDataSuccess, referralDataLoader } = authenticationData
  const dispatch = useDispatch()
  const [promptDialog, setPromptDialog] = useState('')
  const [isRemovePropmt, setRemovePrompt] = useState<boolean>(false)
  useEffect(() => {
    dispatch(getReferralData())
  }, [])
  const handleSuccessPrompt = () => {
    setPromptDialog(
      t('are you sure want to transfer this amount into your wallet'),
    )
    setRemovePrompt(true)
  }

  const handleRemovePrompt = () => {
    setRemovePrompt(false)
    setPromptDialog('')
    dispatch(getReferralData())
  }

  const payMeOut = () => {
    dispatch(postReferralPayout({}))
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '450px',
        marginBottom: '20px',
      }}
    >
      {referralDataLoader ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div className="loading-spinner" style={{ margin: '120px 0px' }}>
            <div className="spinner"></div>
          </div>
        </div>
      ) : (
        <div className="">
          {referralDataSuccess?.hasOwnProperty('referral_link') ? (
            <>
              {isRemovePropmt && (
                <DialogBox
                  isOpen={isRemovePropmt}
                  onClose={handleRemovePrompt}
                  contentClass="onboarding-popup"
                >
                  <ApiActionPrompt
                    promptText={promptDialog}
                    walletAddress={`${referralDataSuccess?.referral_fees?.toFixed(
                      5,
                    )}`}
                    hideWalletAddress={true}
                    onSuccess={payMeOut}
                    onClose={handleRemovePrompt}
                    myReferralClass="box_padding"
                  />
                </DialogBox>
              )}
              <div className="level_wrapper mb-0">
                <div>
                  <p className="level_labels text-left">{t('My earnings')}</p>
                  <div className="matic_earn_box">
                    <p className="matic_Icon">
                      <ImageComponent
                        src={maticIcon}
                        alt=""
                        style={{ width: '25px', height: '25px' }}
                      />
                    </p>
                    <input
                      style={{
                        borderRadius: '0px 4px 4px 0px',
                        caretColor: 'transparent',
                      }}
                      disabled
                      className="my_user_setting_input"
                      placeholder={t('')}
                      type="type"
                      defaultValue={
                        referralDataSuccess?.referral_fees === null
                          ? ' 0.00'
                          : `${referralDataSuccess?.referral_fees?.toFixed(2)}`
                      }
                    />
                  </div>
                  <p className="approx_dollar">
                    approx.{' '}
                    {referralDataSuccess?.referral_fees_usd === null ? (
                      <span
                        style={{ color: 'var(--primary-foreground-color)' }}
                      >
                        ${truncateDecimals(0, 5)}
                      </span>
                    ) : (
                      <span
                        style={{ color: 'var(--primary-foreground-color)' }}
                      >
                        $
                        {truncateDecimals(
                          referralDataSuccess?.referral_fees_usd,
                          5,
                        )}
                      </span>
                    )}
                  </p>
                </div>
                <div
                  style={{
                    width: '50% !important',
                    marginTop: '10px',
                  }}
                >
                  <SubmitButton
                    isDisabled={referralDataSuccess?.blockpayout}
                    title={t('cash out')}
                    className={classnames('pay_me_out', 'm-0')}
                    onPress={handleSuccessPrompt}
                  />
                </div>
              </div>
              {referralDataSuccess?.payout?.length > 0 ? (
                <div
                  className={classnames('insideWallet')}
                  style={{ padding: '0 15px' }}
                >
                  <p className={classnames('level_labels', 'text-left')}>
                    {t('payouts')}
                  </p>
                  {referralDataSuccess?.payout?.length > 0
                    ? referralDataSuccess?.payout?.map((el, index) => {
                        return (
                          <div
                            key={index}
                            style={{
                              borderRadius: '4px 4px 4px 4px',
                              caretColor: 'transparent',
                              textAlign: 'center',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                            className="my_user_setting_input mt-10"
                          >
                            <div>
                              {el?.time === null ? (
                                <p
                                  style={{
                                    color: 'var(--primary-foreground-color)',
                                  }}
                                >
                                  {t('pending')}
                                </p>
                              ) : (
                                <p>
                                  {el?.time.substring(0, 19)?.replace('T', ' ')}
                                </p>
                              )}
                            </div>
                            <div>{el?.amount.toFixed(5)}</div>
                          </div>
                        )
                      })
                    : null}
                </div>
              ) : null}
            </>
          ) : (
            <div
              className="blog-title yellow-color mt-30"
              style={{
                width: '100%',
                minHeight: '450px',
                fontSize: '40px',
                textTransform: 'uppercase',
              }}
            >
              {t('no earnings generated yet')}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Earnings
