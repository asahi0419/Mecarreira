import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import ImageComponent from '@components/ImageComponent'
// import ShareIcon from '@assets/icons/icon/shareIcon.svg'
// import ShareIconBlack from '@assets/icons/icon/ShareIconBlack.svg'
import LinkIcon from '@mui/icons-material/Link'
import { Input } from '@components/Form'
import { isMobile } from '@utils/helpers'
import {
  getPlayerReferralData,
  setSharePopWallet,
} from '@root/apis/onboarding/authenticationSlice'
import InfoIconM from '@mui/icons-material/Info'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ShareIcon from '@components/Svg/ShareIcon'
import { ShareSocial } from 'react-share-social'
import TooltipLabel from '@components/TooltipLabel'
import PercentIcon from '@mui/icons-material/Percent'
interface Props {
  title: string
  address?: string
  isMaticDeposit?: boolean
  containerClassName?: string
  onClose: () => void
}

const PlayerReferral: React.FC<Props> = props => {
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
  const dispatch = useDispatch()
  const [isAddressCopied, setAddressCopied] = useState(false)
  const [copiedCode, setCopiedCode] = useState('')
  const { t } = useTranslation()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const {
    selectedThemeRedux,
    sharePopWallet,
    playerReferralDataLoader,
    playerReferralDataSuccess,
  } = authenticationData
  useEffect(() => {
    dispatch(getPlayerReferralData())
  }, [])

  const handleCopyReferralCode = (code: any, mode: string) => {
    if (mode === 'link') {
      setAddressCopied(!isAddressCopied)
      setCopiedCode(code)
      navigator.clipboard.writeText(
        `${process.env.REACT_APP_LANDING_URL}/referral/${code}` ?? 's',
      )
      // navigator.clipboard.writeText(`/referral/${code}` ?? 's')
    } else if (mode === 'code') {
      setAddressCopied(!isAddressCopied)
      setCopiedCode(code)
      navigator.clipboard.writeText(code ?? 's')
    }
  }

  const handleClearTooltip = () => {
    setAddressCopied(false)
    setCopiedCode('')
  }

  const [referralCode, setReferralCode] = useState('')
  return (
    <div
      style={{
        minHeight:
          playerReferralDataSuccess?.used_code?.length === 0 ||
          playerReferralDataSuccess?.one_time_code?.length === 0 ||
          playerReferralDataSuccess?.permanent_codes?.length === 0
            ? '450px'
            : '470px',
      }}
    >
      {playerReferralDataLoader ? (
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
            url={`${process.env.REACT_APP_LANDING_URL}/referral/${referralCode}`}
            // url={`/referral/${referralCode}`}
            socialTypes={['whatsapp', 'facebook', 'twitter', 'telegram']}
            style={styleShare}
            onSocialButtonClicked={data => console.log(data)}
          />
          <p style={{ marginBottom: '100px' }}></p>
        </div>
      ) : playerReferralDataSuccess?.used_code?.length > 0 ||
        playerReferralDataSuccess?.one_time_code?.length > 0 ||
        playerReferralDataSuccess?.permanent_codes?.length ? (
        <div>
          <a
            href={'/blog/player-referral'}
            target="_blank"
            className="invitation-info"
            style={{ margin: '10px 0px' }}
          >
            <InfoIconM className="info_Icon_wallet" />
            <div className="early-access-desc">{t('More Information')}</div>
          </a>
          <div
            style={{
              display: 'flex',
              // justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              className="my_user_setting_input_wrapper"
              style={{ margin: '14px 14px 10px 14px', width: '120px' }}
            >
              <input
                style={{
                  caretColor: 'transparent',
                  textAlign: 'center',
                  color: '#abacb5',
                }}
                disabled
                className="my_user_setting_input"
                placeholder={t('')}
                type="type"
                defaultValue={
                  playerReferralDataSuccess?.referral_prct === null
                    ? `0`
                    : `${playerReferralDataSuccess?.referral_prct}`
                }
              />
              <PercentIcon
                style={{
                  color: '#989898',
                  marginRight: '10px',
                  width: '20px',
                  height: '20px',
                }}
              />
            </div>
            <div
              className="level_labels text-left"
              style={{ marginLeft: '5px' }}
            >
              {t('my_referral_percentage')}
            </div>
          </div>
          <div
            style={{
              borderBottom: '0.5px solid #56596a',
              margin: '14px 14px 14px 14px',
            }}
          ></div>
          {playerReferralDataSuccess?.permanent_codes?.length > 0 &&
          playerReferralDataSuccess?.permanent_codes[0]?.code_usage_remaining >
            0 ? (
            <div
              className="level_labels text-left"
              style={{ margin: '25px 14px 0px 14px' }}
            >
              {t('permanent_code')}
            </div>
          ) : null}
          {playerReferralDataSuccess?.permanent_codes.map(
            (item: any, index: number) => (
              <div className="referral_code_wrapper" key={index}>
                <div className="tooltip-seed">
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
                </div>
                {item?.code_usage_remaining ? (
                  <>
                    <div
                      className="textinput-wrapper"
                      style={{ maxWidth: '155px' }}
                    >
                      <Input
                        id="wallet_referral_code"
                        name="wallet_referral_code"
                        type="text"
                        className="text-center"
                        disabled
                        value={item?.code}
                        maxLength={12}
                      />
                    </div>
                    <div className="copy_share_icon_wrapper">
                      <TooltipLabel title={t('copy code')}>
                        <div className="share_wrapper">
                          <ContentCopy
                            // onClick={() => {
                            //   handleCopyReferralCode(item.code)
                            // }}
                            onClick={() =>
                              handleCopyReferralCode(item?.code, 'code')
                            }
                            className="share_icon"
                            // style={{
                            //   color:
                            //     selectedThemeRedux === 'Black'
                            //       ? 'white'
                            //       : 'black',
                            // }}
                            onMouseLeave={() => handleClearTooltip()}
                          />
                        </div>
                      </TooltipLabel>

                      <div className="share_wrapper">
                        <TooltipLabel title={t('copy link')}>
                          <LinkIcon
                            className="share_icon"
                            // onClick={() => {
                            //   handleCopyReferralCode(
                            //     `https://devlanding.mecarreira.com/referral/${item.code}`,
                            //   )
                            // }}
                            onClick={() =>
                              handleCopyReferralCode(item?.code, 'link')
                            }
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
                      <TooltipLabel title={t('share link')}>
                        <div
                          className="share_wrapper share-code-btn"
                          onClick={() => {
                            setReferralCode(item?.code)
                            dispatch(setSharePopWallet(true))
                          }}
                        >
                          {/* <ImageComponent
                          className="share_icon"
                          src={
                            selectedThemeRedux === 'Black'
                              ? ShareIconBlack
                              : ShareIcon
                          }
                          alt=""
                        /> */}
                          {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                          >
                            <path
                              d="M352 224c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96c0 4 .2 8 .7 11.9l-94.1 47C145.4 170.2 121.9 160 96 160c-53 0-96 43-96 96s43 96 96 96c25.9 0 49.4-10.2 66.6-26.9l94.1 47c-.5 3.9-.7 7.8-.7 11.9c0 53 43 96 96 96s96-43 96-96s-43-96-96-96c-25.9 0-49.4 10.2-66.6 26.9l-94.1-47c.5-3.9 .7-7.8 .7-11.9s-.2-8-.7-11.9l94.1-47C302.6 213.8 326.1 224 352 224z"
                              fill="var(--primary-foreground-color)"
                            />
                          </svg> */}
                          <ShareIcon />
                        </div>
                      </TooltipLabel>
                    </div>
                  </>
                ) : null}
              </div>
            ),
          )}
          {playerReferralDataSuccess?.one_time_code?.length > 0 ? (
            <div
              className="level_labels text-left"
              style={{ margin: '25px 14px 0px 14px' }}
            >
              {t('one_time_use_codes')}
            </div>
          ) : null}
          {playerReferralDataSuccess?.one_time_code.map(
            (item: any, index: number) => (
              <div className="referral_code_wrapper" key={index}>
                <div className="tooltip-seed">
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
                </div>
                {item?.code_usage_remaining ? (
                  <>
                    <div
                      className="textinput-wrapper"
                      style={{ maxWidth: '155px' }}
                    >
                      <Input
                        id="wallet_referral_code"
                        name="wallet_referral_code"
                        type="text"
                        className="text-center"
                        disabled
                        value={item?.code}
                        maxLength={12}
                      />
                    </div>
                    <div className="copy_share_icon_wrapper">
                      <TooltipLabel title={t('copy code')}>
                        <div className="share_wrapper">
                          <ContentCopy
                            // onClick={() => {
                            //   handleCopyReferralCode(item.code)
                            // }}
                            onClick={() =>
                              handleCopyReferralCode(item?.code, 'code')
                            }
                            className="share_icon"
                            // style={{
                            //   color:
                            //     selectedThemeRedux === 'Black'
                            //       ? 'white'
                            //       : 'black',
                            // }}
                            onMouseLeave={() => handleClearTooltip()}
                          />
                        </div>
                      </TooltipLabel>

                      <div className="share_wrapper">
                        <TooltipLabel title={t('copy link')}>
                          <LinkIcon
                            className="share_icon"
                            // onClick={() => {
                            //   handleCopyReferralCode(
                            //     `https://devlanding.mecarreira.com/referral/${item.code}`,
                            //   )
                            // }}
                            onClick={() =>
                              handleCopyReferralCode(item?.code, 'link')
                            }
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
                      <TooltipLabel title={t('share link')}>
                        <div
                          className="share_wrapper share-code-btn"
                          onClick={() => {
                            setReferralCode(item?.code)
                            dispatch(setSharePopWallet(true))
                          }}
                        >
                          {/* <ImageComponent
                          className="share_icon"
                          src={
                            selectedThemeRedux === 'Black'
                              ? ShareIconBlack
                              : ShareIcon
                          }
                          alt=""
                        /> */}
                          {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                          >
                            <path
                              d="M352 224c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96c0 4 .2 8 .7 11.9l-94.1 47C145.4 170.2 121.9 160 96 160c-53 0-96 43-96 96s43 96 96 96c25.9 0 49.4-10.2 66.6-26.9l94.1 47c-.5 3.9-.7 7.8-.7 11.9c0 53 43 96 96 96s96-43 96-96s-43-96-96-96c-25.9 0-49.4 10.2-66.6 26.9l-94.1-47c.5-3.9 .7-7.8 .7-11.9s-.2-8-.7-11.9l94.1-47C302.6 213.8 326.1 224 352 224z"
                              fill="var(--primary-foreground-color)"
                            />
                          </svg> */}
                          <ShareIcon />
                        </div>
                      </TooltipLabel>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="textinput-wrapper opacity_disable"
                      style={{ maxWidth: '155px' }}
                    >
                      <Input
                        id="wallet_referral_code"
                        name="wallet_referral_code"
                        type="text"
                        className="text-center"
                        disabled
                        value={item?.code}
                        maxLength={12}
                      />
                    </div>
                    <div className="referral_player_info">
                      <span>{item?.player_name}</span>
                      <span>{`($${item?.player_ticker})`}</span>
                    </div>
                  </>
                )}
              </div>
            ),
          )}
          {/* {playerReferralDataSuccess?.used_code?.length > 0 ? (
            <div
              className="level_labels text-left"
              style={{ margin: '25px 14px 0px 14px' }}
            >
              {t('referred_players')}
            </div>
          ) : null} */}
          {playerReferralDataSuccess?.used_code.map(
            (item: any, index: number) => (
              <div className="referral_code_wrapper" key={index}>
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
                {item?.code_usage_remaining ? (
                  <>
                    <div
                      className="textinput-wrapper"
                      style={{ maxWidth: '155px' }}
                    >
                      <Input
                        id="wallet_referral_code"
                        name="wallet_referral_code"
                        type="text"
                        className="text-center"
                        disabled
                        value={item?.code}
                        maxLength={12}
                      />
                    </div>
                    <div className="copy_share_icon_wrapper">
                      <TooltipLabel title={t('copy code')}>
                        <div className="share_wrapper">
                          <ContentCopy
                            // onClick={() => {
                            //   handleCopyReferralCode(item.code)
                            // }}
                            onClick={() =>
                              handleCopyReferralCode(item?.code, 'code')
                            }
                            className="share_icon"
                            // style={{
                            //   color:
                            //     selectedThemeRedux === 'Black'
                            //       ? 'white'
                            //       : 'black',
                            // }}
                            onMouseLeave={() => handleClearTooltip()}
                          />
                        </div>
                      </TooltipLabel>

                      <div className="share_wrapper">
                        <TooltipLabel title={t('copy link')}>
                          <LinkIcon
                            className="share_icon"
                            // onClick={() => {
                            //   handleCopyReferralCode(
                            //     `https://devlanding.mecarreira.com/referral/${item.code}`,
                            //   )
                            // }}
                            onClick={() =>
                              handleCopyReferralCode(item?.code, 'link')
                            }
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
                      <TooltipLabel title={t('share link')}>
                        <div
                          className="share_wrapper share-code-btn"
                          onClick={() => {
                            setReferralCode(item?.code)
                            dispatch(setSharePopWallet(true))
                          }}
                        >
                          {/* <ImageComponent
                          className="share_icon"
                          src={
                            selectedThemeRedux === 'Black'
                              ? ShareIconBlack
                              : ShareIcon
                          }
                          alt=""
                        /> */}
                          {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                          >
                            <path
                              d="M352 224c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96c0 4 .2 8 .7 11.9l-94.1 47C145.4 170.2 121.9 160 96 160c-53 0-96 43-96 96s43 96 96 96c25.9 0 49.4-10.2 66.6-26.9l94.1 47c-.5 3.9-.7 7.8-.7 11.9c0 53 43 96 96 96s96-43 96-96s-43-96-96-96c-25.9 0-49.4 10.2-66.6 26.9l-94.1-47c.5-3.9 .7-7.8 .7-11.9s-.2-8-.7-11.9l94.1-47C302.6 213.8 326.1 224 352 224z"
                              fill="var(--primary-foreground-color)"
                            />
                          </svg> */}
                          <ShareIcon />
                        </div>
                      </TooltipLabel>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="textinput-wrapper opacity_disable"
                      style={{ maxWidth: '155px' }}
                    >
                      <Input
                        id="wallet_referral_code"
                        name="wallet_referral_code"
                        type="text"
                        className="text-center"
                        disabled
                        value={item?.code}
                        maxLength={12}
                      />
                    </div>
                    <div className="referral_player_info">
                      <span>{item?.player_name}</span>
                      <span>{`($${item?.player_ticker})`}</span>
                    </div>
                  </>
                )}
              </div>
            ),
          )}
        </div>
      ) : (
        // <div style={{ width: '100%' }} className="unverified-alert">
        //   {t('No referrals generated yet')}
        // </div>
        <>
          <a
            href={'/blog/player-referral'}
            target="_blank"
            className="invitation-info"
            style={{ marginTop: '5px' }}
          >
            <InfoIconM className="info_Icon_wallet" />
            <div className="early-access-desc">{t('more information')}</div>
          </a>
          <div
            className="blog-title yellow-color mt-30"
            style={{
              width: '100%',
              height: '300px',
              fontSize: '40px',
              textTransform: 'uppercase',
            }}
          >
            {t('no referrals generated yet')}
          </div>
        </>
      )}
    </div>
  )
}

export default PlayerReferral
