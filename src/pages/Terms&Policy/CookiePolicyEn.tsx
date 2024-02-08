import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '@assets/css/pages/Terms&Conditions.css'
import Clause from './components/Clause'
import { useSelector, useDispatch } from 'react-redux'
import {
  getWalletDetails,
  showWalletForm,
} from '@root/apis/onboarding/authenticationSlice'
import { RootState } from '@root/store/rootReducers'
import Cookies from 'universal-cookie'
import { isMobile } from '@utils/helpers'

const CookiePolicyEn: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { isNoWallet, userName, walletDetailAddress } = authenticationData
  const [cookieStates, setCookieStates] = useState({
    targetCookie: false,
    functionalityCookie: false,
    performanceCookie: false,
  })
  const cookies = new Cookies()

  useEffect(() => {
    try {
      const cookies = new Cookies()
      const storedCookies = Array.isArray(cookies.get('cookieAccepted'))
        ? cookies.get('cookieAccepted')
        : []
      if (storedCookies.includes('TC')) {
        setCookieStates(prevStates => ({ ...prevStates, targetCookie: true }))
      }
      if (storedCookies.includes('FC')) {
        setCookieStates(prevStates => ({
          ...prevStates,
          functionalityCookie: true,
        }))
      }
      if (storedCookies.includes('PC')) {
        setCookieStates(prevStates => ({
          ...prevStates,
          performanceCookie: true,
        }))
      }
    } catch (error) {
      console.error('cookies_error::', error)
    }
  }, [])

  useEffect(() => {
    if (userName && localStorage.getItem('loginInfo') && !walletDetailAddress) {
      dispatch(getWalletDetails())
    }
  }, [userName])

  useEffect(() => {
    if (isNoWallet && !localStorage.getItem('loginInfo')) {
      dispatch(showWalletForm({ isMandatory: true }))
    }
  }, [isNoWallet])

  useEffect(() => {
    const storedCookies = Array.isArray(cookies.get('cookieAccepted'))
      ? cookies.get('cookieAccepted')
      : []
    if (storedCookies.length === 0) {
      cookies.remove('cookieAccepted', {
        path: '/',
        domain: '.mecarreira.com',
      })
    }
  }, [cookieStates])

  return (
    <div
      className={`terms-container ${
        !window.location.href.includes('/app') && !isMobile() ? 'mt-120' : ''
      }`}
    >
      <div className="mt-20 mb-20 policy-container">
        <Clause
          title={t('cookie policy')}
          fontStyle="text-left ct-h1"
          isMainTitle
        >
          <div className="terms-content">
            <p className="ct-p1">
              We use cookies to help improve your experience of our website
              at https://mecarreira.com and its subdomains. This cookie policy
              is part of meCarreira AG's privacy policy. It covers the use of
              cookies between your device and our site.
            </p>
            <p className="ct-p1">
              We also provide basic information on third-party services we may
              use, who may also use cookies as part of their service. This
              policy does not cover their cookies.
            </p>
            <p className="ct-p1">
              If you don’t wish to accept cookies from us, you should instruct
              your browser to refuse cookies from https://mecarreira.com. In
              such a case, we may be unable to provide you with some of your
              desired content and services.
            </p>
          </div>
        </Clause>
        <Clause title={t('What is a cookie?')} fontStyle="h-2">
          <div className="terms-content">
            <p className="ct-p1">
              A cookie is a small piece of data that a website stores on your
              device when you visit. It typically contains information about the
              website itself, a unique identifier that allows the site to
              recognize your web browser when you return, additional data that
              serves the cookie’s purpose, and the lifespan of the cookie
              itself.
            </p>
            <p className="ct-p1">
              Cookies are used to enable certain features (e.g. logging in),
              track site usage (e.g. analytics), store your user settings (e.g.
              time zone, notification preferences), and to personalize your
              content (e.g. advertising, language).
            </p>
            <p className="ct-p1">
              Cookies set by the website you are visiting are usually referred
              to as first-party cookies. They typically only track your activity
              on that particular site.
            </p>
            <p className="ct-p1">
              Cookies set by other sites and companies (i.e. third parties) are
              called third-party cookies They can be used to track you on other
              websites that use the same third-party service.
            </p>
          </div>
        </Clause>
        <Clause
          title={t('Types of cookies and how we use them')}
          fontStyle="h-3"
        >
          <></>
        </Clause>
        <Clause title={t('Essential cookies')} fontStyle="h-3">
          <div className="terms-content">
            <p className="ct-p1">
              Essential cookies are crucial to your experience of a website,
              enabling core features like user logins, account management,
              shopping carts, and payment processing.
            </p>
            <p className="ct-p1">
              We use essential cookies to enable certain functions on our
              website and without those cookies the website cannot function.
              None of those cookies contains any personal or any other form of
              data that could identify an individual person.
            </p>
            <p className="ct-p1">
              <i>MUST BE ENABLED</i>
            </p>
            <table className="cookie-table" border="1">
              <tr>
                <th>Name</th>
                <th>Provider</th>
                <th>Usage</th>
              </tr>
              <tr>
                <td>csrftoken</td>
                <td>meCarreira</td>
                <td>
                  The csrftoken cookie is an essential component of Django's
                  security measures against Cross-Site Request Forgery (CSRF)
                  attacks. When a user accesses a web page, the corresponding
                  view generates a unique CSRF token for that user's session.
                  When the user submits the form or makes the request, the
                  server checks whether the received CSRF token matches the
                  expected value for that session and action. This verification
                  prevents unauthorized actions and ensures that the request
                  originated from the intended source.
                </td>
              </tr>
              <tr>
                <td>sessionid</td>
                <td>meCarreira</td>
                <td>
                  The sessionid cookie is crucial for managing user sessions
                  within Django web applications. Sessions enable the server to
                  maintain state and user-specific data across multiple requests
                  from the same user. When a user accesses a Django application,
                  the server generates a unique session ID and associates it
                  with the user's session data. This session ID is stored in the
                  sessionid cookie. As the user interacts with the application,
                  the session ID is used to track and retrieve their session
                  data on the server. This enables the server to maintain
                  personalized data and settings for the user throughout their
                  visit to the application.
                </td>
              </tr>
              <tr>
                <td>device_id</td>
                <td>meCarreira</td>
                <td>
                  The device_id plays a critical role in Mecarreira's security
                  strategy. Upon a user's login to our platform, a unique
                  device_id is generated and subsequently stored as a cookie.
                  This specific cookie undergoes validation during each
                  authenticated user request. This stringent validation process
                  occurs independently of the user's access token, even if it
                  were to be compromised. This approach serves as an additional
                  layer of protection, thwarting unauthorized actions and
                  maintaining security standards across the board.
                </td>
              </tr>
            </table>
          </div>
        </Clause>
        <Clause title={t('Performance cookies')} fontStyle="h-3">
          <div className="terms-content">
            <p className="ct-p1">
              Performance cookies track how you use a website during your visit.
              Typically, this information is anonymous and aggregated, with
              information tracked across all site users. They help companies
              understand visitor usage patterns, identify and diagnose problems
              or errors their users may encounter, and make better strategic
              decisions in improving their audience’s overall website
              experience. These cookies may be set by the website you’re
              visiting (first-party) or by third-party services. They do not
              collect personal information about you.
            </p>
            <p className="ct-p1">We use performance cookies on our site.</p>
            <div className="cookie-checkbox">
              <p className="ct-p1">Enable</p>
              <input
                type="checkbox"
                checked={cookieStates.performanceCookie}
                onChange={() => {
                  const oneYearFromNow = new Date()
                  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)
                  const updateCookiesData = cookies.get('cookieAccepted') || []
                  if (!cookieStates.performanceCookie) {
                    updateCookiesData.push('PC')
                    cookies.set('cookieAccepted', updateCookiesData, {
                      path: '/',
                      expires: oneYearFromNow,
                      domain: '.mecarreira.com',
                    })
                  } else if (cookieStates.performanceCookie) {
                    const index = updateCookiesData.indexOf('PC')
                    cookies.set(
                      'cookieAccepted',
                      updateCookiesData.filter((_, i: number) => i !== index),
                      {
                        path: '/',
                        expires: oneYearFromNow,
                        domain: '.mecarreira.com',
                      },
                    )
                  }
                  setCookieStates(prevStates => ({
                    ...prevStates,
                    performanceCookie: !cookieStates.performanceCookie,
                  }))
                }}
              />
            </div>
            <table className="cookie-table" border="1">
              <tr>
                <th>Name</th>
                <th>Provider</th>
                <th>Usage</th>
              </tr>
              <tr>
                <td>_ga</td>
                <td>Google, Google Tag Manager, Google Analytics</td>
                <td>
                  Used for web analytics provided to us by Google Analytics. The
                  cookies distinguish site visitors and store website traffic
                  information, such as timestamps for site entry and exit, how
                  visitors reached the site, and the number of times a visitor
                  has been to the site.
                </td>
              </tr>
              <tr>
                <td>_gid</td>
                <td>Google, Google Tag Manager, Google Analytics</td>
                <td>
                  Used for web analytics provided to us by Google Analytics. The
                  cookies distinguish site visitors and store website traffic
                  information, such as timestamps for site entry and exit, how
                  visitors reached the site, and the number of times a visitor
                  has been to the site.
                </td>
              </tr>
              <tr>
                <td>_gat</td>
                <td>Google, Google Tag Manager, Google Analytics</td>
                <td>
                  Used for web analytics provided to us by Google Analytics. The
                  cookies distinguish site visitors and store website traffic
                  information, such as timestamps for site entry and exit, how
                  visitors reached the site, and the number of times a visitor
                  has been to the site.
                </td>
              </tr>
              <tr>
                <td>_gat_UA</td>
                <td>Google, Google Tag Manager, Google Analytics</td>
                <td>
                  Used for web analytics provided to us by Google Analytics. The
                  cookies distinguish site visitors and store website traffic
                  information, such as timestamps for site entry and exit, how
                  visitors reached the site, and the number of times a visitor
                  has been to the site.
                </td>
              </tr>
            </table>
          </div>
        </Clause>
        <Clause title={t('Functionality cookies')} fontStyle="h-3">
          <div className="terms-content">
            <p className="ct-p1">
              Functionality cookies are used to collect information about your
              device and any settings you may configure on the website you’re
              visiting (like language and time zone settings). With this
              information, websites can provide you with customized, enhanced,
              or optimized content and services. These cookies may be set by the
              website you’re visiting (first-party) or by third-party services.
            </p>
            <p className="ct-p1">
              We use functionality cookies for selected features on our site.
            </p>
            <div className="cookie-checkbox">
              <p className="ct-p1">Enable</p>
              <input
                type="checkbox"
                checked={cookieStates.functionalityCookie}
                onChange={() => {
                  const oneYearFromNow = new Date()
                  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)
                  const updateCookiesData = cookies.get('cookieAccepted') || []
                  if (!cookieStates.functionalityCookie) {
                    updateCookiesData.push('FC')
                    cookies.set('cookieAccepted', updateCookiesData, {
                      path: '/',
                      expires: oneYearFromNow,
                      domain: '.mecarreira.com',
                    })
                  } else if (cookieStates.functionalityCookie) {
                    const index = updateCookiesData.indexOf('FC')
                    cookies.set(
                      'cookieAccepted',
                      updateCookiesData.filter((_, i: number) => i !== index),
                      {
                        path: '/',
                        expires: oneYearFromNow,
                        domain: '.mecarreira.com',
                      },
                    )
                  }
                  setCookieStates(prevStates => ({
                    ...prevStates,
                    functionalityCookie: !cookieStates.functionalityCookie,
                  }))
                }}
              />
            </div>
            <table className="cookie-table" border="1">
              <tr>
                <th>Name</th>
                <th>Provider</th>
                <th>Usage</th>
              </tr>
              <tr>
                <td>_gcl_au</td>
                <td>Google</td>
                <td>
                  Used to help tags measure click data so that conversions are
                  measured effectively.
                </td>
              </tr>
            </table>
          </div>
        </Clause>
        <Clause title={t('Targeting/advertising cookies')} fontStyle="h-3">
          <div className="terms-content mb-40">
            <p className="ct-p1">
              Targeting/advertising cookies help determine what promotional
              content is most relevant and appropriate to you and your
              interests. Websites may use them to deliver targeted advertising
              or limit the number of times you see an advertisement. This helps
              companies improve the effectiveness of their campaigns and the
              quality of content presented to you. These cookies may be set by
              the website you’re visiting (first-party) or by third-party
              services.
            </p>
            <p className="ct-p1">
              Targeting/advertising cookies set by third-parties may be used to
              track you on other websites that use the same third-party service.
            </p>
            <p className="ct-p1">We use performance cookies on our site.</p>
            <div className="cookie-checkbox">
              <p className="ct-p1">Enable</p>
              <input
                type="checkbox"
                checked={cookieStates.targetCookie}
                onChange={() => {
                  const oneYearFromNow = new Date()
                  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)
                  const updateCookiesData = cookies.get('cookieAccepted') || []
                  if (!cookieStates.targetCookie) {
                    updateCookiesData.push('TC')
                    cookies.set('cookieAccepted', updateCookiesData, {
                      path: '/',
                      expires: oneYearFromNow,
                      domain: '.mecarreira.com',
                    })
                  } else if (cookieStates.targetCookie) {
                    const index = updateCookiesData.indexOf('TC')
                    cookies.set(
                      'cookieAccepted',
                      updateCookiesData.filter((_, i: number) => i !== index),
                      {
                        path: '/',
                        expires: oneYearFromNow,
                        domain: '.mecarreira.com',
                      },
                    )
                  }
                  setCookieStates(prevStates => ({
                    ...prevStates,
                    targetCookie: !cookieStates.targetCookie,
                  }))
                }}
              />
            </div>
            <table className="cookie-table" border="1">
              <tr>
                <th>Name</th>
                <th>Provider</th>
                <th>Usage</th>
              </tr>
              <tr>
                <td width={50}>
                  __Secure-*, SAPISID, SSID, HSID, APISID, SIDCC, SID, NID,
                  CONSENT, 1P_JAR, DV, OTZ, DSID, IDE, RUL
                </td>
                <td>Google Privacy</td>
                <td>
                  Used to re-engage visitors that are likely to convert to
                  customers based on the visitor's online behaviour across
                  websites.
                </td>
              </tr>
            </table>
          </div>
        </Clause>
      </div>
    </div>
  )
}

export default CookiePolicyEn
