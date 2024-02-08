import React, { useEffect } from 'react'
import { isMobile } from '@utils/helpers'
import '@assets/css/pages/About.css'
import { useTranslation } from 'react-i18next'
import GalleryIcon from '@assets/images/gallery-icon.webp'
import classNames from 'classnames'
import { NewsGroups } from '@root/constants'
import { useSelector, useDispatch } from 'react-redux'
import {
  getWalletDetails,
  showWalletForm,
} from '@root/apis/onboarding/authenticationSlice'
import { RootState } from '@root/store/rootReducers'
import ImageComponent from '@components/ImageComponent'
interface ListItemProps {
  title: string
  children: React.ReactNode
  containerClass?: string
  index?: number
}

const ListItem: React.FC<ListItemProps> = ({
  title,
  children,
  containerClass = '',
  index,
}) => {
  return (
    <div className={classNames('list-item', containerClass)}>
      <div className="list-item-heading">
        {index ? (
          <div className="get-index">
            <div>{index}</div>
          </div>
        ) : (
          <ImageComponent loading="lazy" src={GalleryIcon} />
        )}
        <div className="terms-subtitle">{title}</div>
      </div>
      {children}
    </div>
  )
}

const AboutUsEn: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const accessToken = localStorage.getItem('accessToken')
  const { isNoWallet, userName, walletDetailAddress } = authenticationData

  useEffect(() => {
    if (userName) {
      if (accessToken && !walletDetailAddress) {
        dispatch(getWalletDetails()) // COMMENTED FOR PROD
      }
    }
  }, [userName])

  useEffect(() => {
    if (isNoWallet && !localStorage.getItem('loginInfo')) {
      dispatch(showWalletForm({ isMandatory: true }))
    }
  }, [isNoWallet])
  const getTranslation = (text: string) => {
    const translation = t(text)
    if (translation === text) {
      return text
    } else {
      return translation
    }
  }
  return (
    <>
      <div className="about-us-container">
        <div className="about-container col-reverse">
          <div className="about-txt-container">
            <div className="ct-h1 about-intro-heading">
              {getTranslation('empowering players and fans')}
            </div>
            <p className="m-0 ct-p1">
              {getTranslation('we created meCarreira to celebrate')}
            </p>
            <p className="ct-p1">
              {getTranslation('found by swiss enterpreneurs')}
            </p>
          </div>
          <div className="circle-block"></div>
        </div>
      </div>
      <section className="values-container h-none">
        <div className="about-container our-values-container">
          <div className="values-header about-txt-container">
            <div className="ct-h1 p-0 m-0">{t('our values')}</div>
            <p className="ct-p1">{t('these values are our beliefs')}</p>
          </div>
        </div>
        <div className="about-container">
          <div className="quad-block first-pic"></div>
          <div className="about-txt-container">
            <ListItem title={t('focussed')} containerClass="ct-h3" index={1}>
              <div className="terms-content text-left ct-p1 mt-5">
                {getTranslation('focus max clarity')} <br />{' '}
                {getTranslation('you dont get results')}
              </div>
            </ListItem>
            <ListItem
              title={t('Independent')}
              containerClass="mt-40 ct-h3"
              index={2}
            >
              <div className="terms-content text-left ct-p1 mt-5">
                {getTranslation('we honor independency')}
                <br /> {getTranslation('find yourself')}
              </div>
            </ListItem>
            <ListItem
              title={t('cutting-edge')}
              containerClass="mt-40 ct-h3"
              index={3}
            >
              <div className="terms-content text-left ct-p1 mt-5">
                {getTranslation('we cutting edge')}
                <br /> {getTranslation('being on edge not safe')}
              </div>
            </ListItem>
          </div>
        </div>
      </section>
      <section className="values-container h-none purpose-section">
        <div className="about-container our-values-container">
          <div className="values-header about-txt-container purpose-container">
            <div className="ct-h1 p-0 m-0">{t('our purpose')}</div>
            <p className="ct-h4 mb-0">{t('make full use of your potential')}</p>
            <p className="ct-p1">
              {getTranslation('our aim is empowering players')}{' '}
            </p>
            <p className="ct-h4 mb-0">
              {t('each talent has the power to create a career')}
            </p>
            <p className="ct-p1">
              {getTranslation('whether you are professional player')}
            </p>
          </div>
        </div>
        <div className="about-container purpose-block">
          <div className="quad-block"></div>
          <div className="about-txt-container">
            <ListItem title={t('players')} containerClass="ct-h3" index={1}>
              <div className="terms-content text-left ct-p1 mt-5">
                {getTranslation('players can extend market')}
              </div>
            </ListItem>
            <ListItem title={t('fans')} containerClass="mt-40 ct-h3" index={2}>
              <div className="terms-content text-left ct-p1 mt-5">
                {getTranslation('everybody that loves football')}
              </div>
            </ListItem>
            <ListItem
              title={t('talents')}
              containerClass="mt-40 ct-h3"
              index={3}
            >
              <div className="terms-content text-left ct-p1 mt-5">
                {getTranslation('new generation of talented players')}
              </div>
            </ListItem>
          </div>
        </div>
      </section>
      {/* -------------------- */}
      <section className="values-container h-none">
        <div
          className={classNames(
            'ct-h1 p-0',
            isMobile() ? 'news-item-header text-center' : '',
          )}
        >
          {t('what others write about us')}
        </div>
        <div className={classNames('team-display', isMobile() ? '' : 'mt-20')}>
          <div className="team-container h-none news-list-container">
            {NewsGroups.map(item => (
              <div className={classNames('news-item-container')}>
                <a href={item.link} target="_blank">
                  <ImageComponent
                    className={classNames(
                      'news-item-img',
                      item.img ? '' : 'hidden',
                    )}
                    src={item.img}
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default AboutUsEn
