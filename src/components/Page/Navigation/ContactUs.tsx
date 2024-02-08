import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ContactUs as ContactUsItems } from '@root/constants'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import classNames from 'classnames'
import { useLocation } from 'react-router-dom'
import {
  handleLandingNavigate,
  openSideMenu,
  setShowTourModal,
} from '@root/apis/onboarding/authenticationSlice'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { isMobile } from '@utils/helpers'
interface Props {
  isFooter?: boolean
}
const ContactUs: React.FC<Props> = ({ isFooter }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location: any = useLocation()
  const pathname = location.pathname
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { selectedThemeRedux, openMenu, isTourXPClaimed } = authenticationData

  const includeLanding = !window.location.href.includes('/app')

  const openService = (item: any) => {
    if (item.title === 'product tour') {
      dispatch(setShowTourModal(true))
    }
    navigate(item.path, { state: { from: '/' } })
  }

  const handleClick = (
    event: React.MouseEvent<HTMLDivElement | HTMLAnchorElement>,
    id: string,
  ) => {
    window.history.replaceState(null, 'Buy', '/')
    if (pathname !== '/' || !includeLanding) {
      dispatch(
        handleLandingNavigate({
          landingNavigateIndex: id === '#about-us' ? 6 : 7,
        }),
      )
      window.scrollTo(0, 0)
      navigate('/' + id)
    } else {
      const anchor = (
        (event.target as HTMLDivElement).ownerDocument || document
      ).querySelector(id)

      if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }
  const closeMenu = () => {
    dispatch(openSideMenu({ openMenu: false }))
    return
  }
  const loginId = localStorage.getItem('loginId')
  const loginInfo = localStorage.getItem('loginInfo')
  const [optionsMenu, setOptionsMenu] = useState(ContactUsItems)
  useEffect(() => {
    if (!loginInfo && !loginId) {
      const menuTemp = ContactUsItems.filter(
        item =>
          !['freeXp'].includes(item.title) &&
          !['product tour'].includes(item.title),
      )
      setOptionsMenu(menuTemp)
    }
    // if (isTourXPClaimed || !isMobile()) {
    //   // Consider if collected XP or not
    //   const menuTemp = ContactUsItems.filter(
    //     item => !['product tour'].includes(item.title),
    //   )
    //   setOptionsMenu(menuTemp)
    // }
  }, [loginInfo, loginId])

  const getItemClass = () => {
    if (selectedThemeRedux === 'Black') {
      if (isFooter) {
        return 'h-black'
      } else {
        return 'page-link h-4'
      }
    }
    return 'page-link h-4'
  }

  return (
    <div className="App" onClick={closeMenu}>
      {optionsMenu.map((item, index) => (
        <React.Fragment key={`cus${index}`}>
          {item.title === 'about us' || item.title === `faq's` ? (
            <div
              key={index}
              className={
                item.title === `faq's` && openMenu
                  ? includeLanding
                    ? 'pt-24'
                    : 'pt-16'
                  : ''
              }
            >
              <a
                className="text-primary-color"
                onClick={evt =>
                  handleClick(
                    evt,
                    item.title === 'about us' ? '#about-us' : '#faq',
                  )
                }
                style={{
                  textDecoration: 'none',
                }}
              >
                {openMenu ? (
                  <div className="flex-space-between">
                    <div className={classNames('page-link h-4')}>
                      {t(item.title)}
                    </div>
                    <div className="selected-value-row">
                      <div className="grey-color">
                        <ArrowForwardIosIcon style={{ fontSize: '12px' }} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={classNames(`${getItemClass()} mt-30`)}>
                    {t(item.title)}
                  </div>
                )}
              </a>
            </div>
          ) : (
            <div key={index}>
              {openMenu ? (
                <div className="flex-space-between">
                  <div
                    className={classNames(
                      item.title === 'freeXp' || item.title === 'product tour'
                        ? includeLanding
                          ? 'hidden'
                          : item.title === 'freeXp'
                          ? 'glow'
                          : 'glow-gold'
                        : getItemClass(),
                    )}
                    key={index}
                    onClick={() => openService(item)}
                  >
                    {t(item.title)}
                  </div>
                  <div
                    className={classNames(
                      'selected-value-row',
                      (item.title === 'freeXp' ||
                        item.title === 'product tour') &&
                        includeLanding
                        ? 'hidden'
                        : '',
                    )}
                  >
                    <div className="grey-color">
                      <ArrowForwardIosIcon style={{ fontSize: '12px' }} />
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={classNames(
                    item.title === 'freeXp' || item.title === 'product tour'
                      ? 'hidden'
                      : getItemClass(),
                  )}
                  key={index}
                  onClick={() => openService(item)}
                >
                  {item.id === 9 ? (
                    <>
                      <img src="/img/cookie.png" className="cookie-icon"></img>
                      {t(item.title)}
                    </>
                  ) : (
                    t(item.title)
                  )}
                </div>
              )}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default ContactUs
