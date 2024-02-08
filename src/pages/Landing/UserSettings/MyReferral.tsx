import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import maticIcon from '@assets/images/matic-token-icon.webp'
import { t } from 'i18next'
import SubmitButton from '@components/Button/SubmitButton'
import { isMobile } from '@utils/helpers'
import { useDispatch, useSelector } from 'react-redux'
import {
  getReferralData,
  postReferralPayout,
  setSharePopWallet,
} from '@root/apis/onboarding/authenticationSlice'
import { RootState } from '@root/store/rootReducers'
import LinkIcon from '@mui/icons-material/Link'
import ContentCopy from '@mui/icons-material/ContentCopy'
import { truncateDecimals } from '@utils/helpers'
import { useTranslation } from 'react-i18next'
import ApiActionPrompt from '@components/Dialog/ApiActionprompt'
import DialogBox from '@components/Dialog/DialogBox'
import ImageComponent from '@components/ImageComponent'
import CopyIcon from '@components/Svg/CopyIcon'
import { Input } from '@components/Form'
import InfoIcon from '../../../assets/icons/icon/infoIcon.svg'
// import ShareIcon from '@assets/icons/icon/shareIcon.svg'
// import ShareIconBlack from '@assets/icons/icon/ShareIconBlack.svg'
import PersonIcon from '@mui/icons-material/Person'
import PercentIcon from '@mui/icons-material/Percent'
import InfoIconM from '@mui/icons-material/Info'
import classNames from 'classnames'
import { ShareSocial } from 'react-share-social'
import TooltipLabel from '@components/TooltipLabel'
import ShareIcon from '@components/Svg/ShareIcon'
interface Props {
  mode?: string
}

const MyReferral: React.FC<Props> = props => {
  const { mode = '' } = props
  const styleShare = {
    root: {
      width: '40%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 'auto',
      height: '60px',
      padding: '5px',
      background: 'transparent',
      borderRadius: 3,
      border: 0,
      color: 'white',
    },
    copyContainer: {
      display: 'none',
      border: '1px solid blue',
      background: 'rgb(0,0,0,0.7)',
    },
    title: {
      color: 'aquamarine',
      fontStyle: 'italic',
    },
  }
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    referralDataLoader,
    referralDataSuccess,
    selectedThemeRedux,
    sharePopWallet,
    QualificationSettingData,
  } = authenticationData
  const [isAddressCopied, setAddressCopied] = useState(false)
  const [copiedCode, setCopiedCode] = useState('')

  const [inviteCode, setInviteCode] = useState('')
  const handleCopy = () => {
    setAddressCopied(!isAddressCopied)
    // navigator.clipboard.writeText(
    //   `${referralDataSuccess?.referral_link}` ?? 's',
    // )
    navigator.clipboard.writeText(
      referralDataSuccess?.referral_link?.replace('referral', 'invite'),
    )
  }

  const [inviteLink, setInviteLink] = useState('')
  const handleCopyCode = property => {
    setAddressCopied(!isAddressCopied)
    setCopiedCode(property)
    navigator.clipboard.writeText(property)
  }
  const handleCopyLink = (property, code) => {
    setAddressCopied(!isAddressCopied)
    setCopiedCode(code)
    navigator.clipboard.writeText(property)
  }
  // const handleCopyReferralCode = (code: any, mode: string) => {
  //   if (mode === 'link') {
  //     setAddressCopied(!isAddressCopied)
  //     setCopiedCode(code)
  //     navigator.clipboard.writeText(
  //       `https://devlanding.mecarreira.com/referral/${code}` ?? 's',
  //     )
  //   } else if (mode === 'code') {
  //     setAddressCopied(!isAddressCopied)
  //     setCopiedCode(code)
  //     navigator.clipboard.writeText(code ?? 's')
  //   }
  // }

  const [promptDialog, setPromptDialog] = useState('')
  const [isRemovePropmt, setRemovePrompt] = useState<boolean>(false)
  const payMeOut = () => {
    dispatch(postReferralPayout({}))
  }
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
  useEffect(() => {
    dispatch(getReferralData())
  }, [])
  useEffect(() => {
    if (referralDataSuccess?.referral_link) {
      setInviteCode(referralDataSuccess?.referral_link?.split('/')?.pop())
    }
  }, [referralDataSuccess])
  // const [sharePop, setSharePop] = useState(false)
  const handleClosePop = () => {
    // setSharePop(false)
    dispatch(setSharePopWallet(false))
  }

  const handleClearTooltip = () => {
    setAddressCopied(false)
    setCopiedCode('')
  }

  return referralDataLoader ? (
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
  ) : sharePopWallet ? (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <p
        style={{
          fontFamily: 'Rajdhani-bold',
          fontWeight: '400',
          fontSize: '20px',
          textAlign: 'center',
          marginTop: '200px',
        }}
      >
        {t('share with your friends')}
      </p>
      <ShareSocial
        url={inviteLink}
        socialTypes={['whatsapp', 'facebook', 'twitter', 'telegram']}
        style={styleShare}
        onSocialButtonClicked={data => console.log(data)}
      />
      <p style={{ marginBottom: '100px' }}></p>
    </div>
  ) : (
    <>
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
          <div
            id="myReferralSettings"
            style={{ minHeight: '470px' }}
            // className="dlg-content mt-20 mb-10"
            className={classNames(
              'dlg-content mb-10',
              mode === 'wallet' ? '' : 'mt-20',
            )}
            // style={mode === 'wallet' ? { overflow: 'auto', height: '480px' } : {}}
          >
            {mode === 'wallet' ? (
              <>
                <a
                  href={'/blog/the-invitation-program'}
                  target="_blank"
                  className="invitation-info"
                >
                  <InfoIconM className="info_Icon_wallet" />
                  <div className="early-access-desc">
                    {t('More Information')}
                  </div>
                </a>
                <div className="level_wrapper">
                  <div>
                    <p
                      className={classnames(
                        'level_labels',
                        mode === 'wallet' ? 'text-left' : '',
                      )}
                    >
                      {t('Level 1')}
                    </p>
                    <div className="my_user_setting_input_wrapper">
                      <input
                        style={{
                          caretColor: 'transparent',
                          textAlign: 'center',
                        }}
                        disabled
                        className="my_user_setting_input"
                        placeholder={t('')}
                        type="type"
                        defaultValue={
                          referralDataSuccess?.level1_users_percentage === null
                            ? `0`
                            : `${referralDataSuccess?.level1_users_percentage}`
                        }
                      />
                      <PercentIcon
                        style={{
                          color: '#989898',
                          marginRight: '20px',
                          width: '20px',
                          height: '20px',
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <p
                      className={classnames(
                        'level_labels',
                        mode === 'wallet' ? 'text-left' : '',
                      )}
                    >
                      {t('Level 2')}
                    </p>
                    <div className="my_user_setting_input_wrapper">
                      <input
                        style={{
                          caretColor: 'transparent',
                          textAlign: 'center',
                        }}
                        disabled
                        className="my_user_setting_input"
                        placeholder={t('')}
                        type="type"
                        defaultValue={
                          referralDataSuccess?.level2_users_percentage === null
                            ? `0`
                            : `${referralDataSuccess?.level2_users_percentage}`
                        }
                      />
                      <PercentIcon
                        style={{
                          color: '#989898',
                          marginRight: '20px',
                          width: '20px',
                          height: '20px',
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="level_wrapper">
                  <div>
                    {/* <p className="level_labels">{t('level_1_prc')}</p> */}
                    <div className="my_user_setting_input_wrapper">
                      <input
                        style={{
                          caretColor: 'transparent',
                          textAlign: 'center',
                        }}
                        disabled
                        className="my_user_setting_input"
                        placeholder={t('')}
                        type="type"
                        defaultValue={`${referralDataSuccess?.level1_users}`}
                      />
                      <PersonIcon
                        style={{ color: '#989898', marginRight: '20px' }}
                      />
                    </div>
                  </div>
                  <div>
                    {/* <p className="level_labels">{t('level_2_prc')}</p> */}
                    <div className="my_user_setting_input_wrapper">
                      <input
                        style={{
                          caretColor: 'transparent',
                          textAlign: 'center',
                        }}
                        disabled
                        className="my_user_setting_input"
                        placeholder={t('')}
                        type="type"
                        defaultValue={`${referralDataSuccess?.level2_users}`}
                      />
                      <PersonIcon
                        style={{ color: '#989898', marginRight: '20px' }}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="level_wrapper">
                  <div>
                    <p
                      className={classnames(
                        'level_labels',
                        mode === 'wallet' ? 'text-left' : '',
                      )}
                    >
                      {t('level_1_users')}
                    </p>
                    <input
                      style={{
                        caretColor: 'transparent',
                        textAlign: 'center',
                      }}
                      disabled
                      className="my_user_setting_input"
                      placeholder={t('')}
                      type="type"
                      defaultValue={`${referralDataSuccess?.level1_users}`}
                    />
                  </div>
                  <div>
                    <p className="level_labels">{t('level_2_users')}</p>
                    <input
                      style={{
                        caretColor: 'transparent',
                        textAlign: 'center',
                      }}
                      disabled
                      className="my_user_setting_input"
                      placeholder={t('')}
                      type="type"
                      defaultValue={`${referralDataSuccess?.level2_users}`}
                    />
                  </div>
                </div>

                <div className="level_wrapper">
                  <div>
                    <p className="level_labels">{t('level_1_prc')}</p>
                    <input
                      style={{
                        caretColor: 'transparent',
                        textAlign: 'center',
                      }}
                      disabled
                      className="my_user_setting_input"
                      placeholder={t('')}
                      type="type"
                      defaultValue={
                        referralDataSuccess?.level1_users_percentage === null
                          ? `0%`
                          : `${referralDataSuccess?.level1_users_percentage}%`
                      }
                    />
                  </div>
                  <div>
                    <p className="level_labels">{t('level_2_prc')}</p>
                    <input
                      style={{
                        caretColor: 'transparent',
                        textAlign: 'center',
                      }}
                      disabled
                      className="my_user_setting_input"
                      placeholder={t('')}
                      type="type"
                      defaultValue={
                        referralDataSuccess?.level2_users_percentage === null
                          ? `0%`
                          : `${referralDataSuccess?.level2_users_percentage}%`
                      }
                    />
                  </div>
                </div>
              </>
            )}
            {mode === 'wallet' ? (
              <>
                <p
                  className={classnames('level_labels text-left')}
                  style={{ margin: '25px 14px 0px' }}
                >
                  {t('my_invitation_codes')}
                </p>
                {referralDataSuccess?.invite_code_list.map((el, ind) => (
                  <div key={ind}>
                    <div className="referral_code_wrapper">
                      {/* <div className="tooltip-seed">
                    <span
                      className={
                        isAddressCopied && copiedCode === item.code
                          ? 'tooltiptext tooltip-visible'
                          : 'tooltiptext'
                      }
                      style={{ marginTop: '25px' }}
                    >
                      {t('copied')}
                    </span>
                  </div> */}
                      <div className="tooltip-seed">
                        <span
                          className={
                            isAddressCopied && copiedCode === el?.invite_code
                              ? 'tooltiptext tooltip-visible'
                              : 'tooltiptext'
                          }
                          style={{ marginTop: '25px' }}
                        >
                          {t('copied')}
                        </span>
                      </div>
                      <div className="textinput-wrappers">
                        <Input
                          id="wallet_referral_code"
                          name="wallet_referral_code"
                          type="text"
                          className="text-center my_user_setting_input w-120"
                          disabled
                          value={el?.invite_code}
                          maxLength={12}
                        />
                      </div>
                      <div className="copy_share_icon_wrapper">
                        <div className="share_wrapper">
                          <TooltipLabel title="Copy Code">
                            <ContentCopy
                              onClick={() => {
                                handleCopyCode(el?.invite_code)
                              }}
                              className="share_icon"
                              // style={{
                              //   color:
                              //     selectedThemeRedux === 'Black'
                              //       ? 'white'
                              //       : 'black',
                              // }}
                              onMouseLeave={() => handleClearTooltip()}
                            />
                          </TooltipLabel>
                        </div>
                        <div className="share_wrapper">
                          <TooltipLabel title="Copy Link">
                            <LinkIcon
                              onClick={() => {
                                handleCopyLink(el?.invite_link, el?.invite_code)
                              }}
                              className="share_icon"
                              // style={{
                              //   color:
                              //     selectedThemeRedux === 'Black'
                              //       ? 'white'
                              //       : 'black',
                              // }}
                              onMouseLeave={() => handleClearTooltip()}
                            />
                          </TooltipLabel>
                        </div>
                        <TooltipLabel title="Share Code">
                          <div
                            className="share_wrapper share-code-btn"
                            onClick={() => {
                              setInviteLink(el?.invite_link)
                              dispatch(setSharePopWallet(true))
                            }}
                          >
                            <ShareIcon />
                          </div>
                        </TooltipLabel>
                        <span
                          className={
                            isAddressCopied
                              ? 'tooltiptext tooltip-visible'
                              : 'tooltiptext'
                          }
                          style={{ marginLeft: '220px', marginTop: '5px' }}
                        >
                          {t('copied')}
                        </span>
                      </div>
                    </div>
                    {[0, 1].includes(QualificationSettingData) ? (
                      <div className="referral_code_wrapper">
                        {/* <div className="referral_code_disabled">ac95df4r</div> */}
                        <div className="textinput-wrappers">
                          <Input
                            id="invite_remaining"
                            name="remaining_invites"
                            type="text"
                            className="text-center my_user_setting_input w-120"
                            disabled
                            value={el?.invites_remaining}
                            maxLength={12}
                          />
                        </div>
                        <div className="referral_player_info level_labels">
                          <span>{t('invites_remaining')}</span>
                        </div>
                      </div>
                    ) : null}
                    {ind <
                      referralDataSuccess?.invite_code_list?.length - 1 && (
                      <div
                        style={{
                          borderBottom: '0.5px solid #56596a',
                          margin: '14px 14px 14px 14px',
                        }}
                      ></div>
                    )}
                  </div>
                ))}
              </>
            ) : null}

            {mode !== 'wallet' ? (
              <>
                <div className="referral_desc">{t('my_referral_desc')}</div>
                <div className="tooltip-seed" style={{ width: '100%' }}>
                  <p className="referral_labels">{t('share_this_link')}</p>
                  <div className="share_link_ref_box">
                    <input
                      style={{
                        padding: '12px 5px 12px 20px',
                        borderRadius: '4px 0px 0px 4px',
                        caretColor: 'transparent',
                      }}
                      disabled
                      className="my_user_setting_input"
                      placeholder={t(
                        'https:https://mecarreira.com/ref=refmenfb12cs',
                      )}
                      type="type"
                      defaultValue={`${referralDataSuccess?.referral_link?.replace(
                        'referral',
                        'invite',
                      )}`}
                    />
                    <p className="copy_share_link">
                      <CopyIcon
                        width="25px"
                        height="25px"
                        onClick={() => {
                          handleCopy()
                        }}
                        onMouseLeave={() => handleClearTooltip()}
                      />
                      <span
                        className={
                          isAddressCopied
                            ? 'tooltiptext tooltip-visible'
                            : 'tooltiptext'
                        }
                        style={{ marginLeft: '200px', marginTop: '50px' }}
                      >
                        {t('copied')}
                      </span>
                    </p>
                  </div>
                </div>
              </>
            ) : null}

            {/* <div className="level_wrapper mb-0">
              <div>
                {mode === 'wallet' ? (
                  <p className="level_labels text-left">{t('My earnings')}</p>
                ) : (
                  <p className="level_labels">{t('referral_fee_earned')}</p>
                )}
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
                      textAlign: 'center',
                    }}
                    className="my_user_setting_input"
                    placeholder={t('')}
                    type="type"
                    value={
                      referralDataSuccess?.referral_fees === null
                        ? ' 0.00000'
                        : `${referralDataSuccess?.referral_fees?.toFixed(5)}`
                    }
                  />
                </div>
                <p className="approx_dollar">
                  approx.{' '}
                  {referralDataSuccess?.referral_fees_usd === null ? (
                    <span style={{ color: 'var(--primary-foreground-color)' }}>
                      ${truncateDecimals(0, 5)}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--primary-foreground-color)' }}>
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
                  marginTop: mode === 'wallet' ? '10px' : '',
                }}
              >
                <SubmitButton
                  isDisabled={referralDataSuccess?.blockpayout}
                  title={mode === 'wallet' ? t('cash out') : t('pay_me_out')}
                  className={classnames(
                    'pay_me_out',
                    mode === 'wallet' ? 'm-0' : '',
                  )}
                  onPress={handleSuccessPrompt}
                />
              </div>
            </div> */}
            {/* {referralDataSuccess?.payout?.length > 0 ? (
              <div
                className={classnames(mode === 'wallet' ? 'insideWallet' : '')}
              >
                <p
                  className={classnames(
                    'level_labels',
                    mode === 'wallet' ? 'text-left' : '',
                  )}
                >
                  {t('payouts')}
                </p>
                {referralDataSuccess?.payout?.length > 0
                  ? referralDataSuccess?.payout?.map(el => {
                      return (
                        <div
                          style={{
                            borderRadius: '4px 4px 4px 4px',
                            caretColor: 'transparent',
                            textAlign: 'center',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                          className="my_user_setting_input"
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
            ) : null} */}
            {/* <div>
          <p className="level_labels">{t('payouts')}</p>
          {referralDataSuccess?.payout?.length > 0 ? (
            referralDataSuccess?.payout?.map(el => {
              return (
                // <p className="payouts_date">
                //   {el?.time && el?.time.substring(0, 19).replace('T', ' ')}
                //   &nbsp;&nbsp;&nbsp;
                //   {el?.amount.toFixed(5)}
                // </p>
                // <input
                //   style={{
                //     borderRadius: '0px 4px 4px 0px',
                //     caretColor: 'transparent',
                //     textAlign: 'center',
                //   }}
                //   className="my_user_setting_input"
                //   placeholder={t('')}
                //   type="type"
                //   value={` ${
                //     el?.time && el?.time.substring(0, 19).replace('T', ' ')
                //   }
                //               ${el?.amount.toFixed(5)}`}
                // />
                <div
                  style={{
                    borderRadius: '4px 4px 4px 4px',
                    caretColor: 'transparent',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  className="my_user_setting_input"
                >
                  <div>
                    {el?.time && el?.time.substring(0, 19).replace('T', ' ')}
                  </div>
                  <div>{el?.amount.toFixed(5)}</div>
                </div>
              )
            })
          ) : (
            <p className="no_paid_items">{t('no_history')}</p>
          )}
        </div> */}
          </div>
        </>
      ) : (
        <>
          <a
            href={'/blog/the-invitation-program'}
            target="_blank"
            className="invitation-info"
          >
            <InfoIconM className="info_Icon_wallet" />
            <div className="early-access-desc">{t('More Information')}</div>
          </a>
          <div
            className="blog-title yellow-color mt-30"
            style={{
              width: '100%',
              minHeight: '450px',
              fontSize: '40px',
              textTransform: 'uppercase',
            }}
          >
            {t('No Invitations generated yet')}
          </div>
        </>
      )}
    </>
  )
}

export default MyReferral
