import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  formActive?: string
  isOpen: boolean
  contentClass?: string
  closeBtnClass?: string
  parentClass?: string
  isMandatory?: boolean
  onClose: () => void
}

const CookiePolicySetting: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useTranslation()

  return (
    <div
      className={`modal cookie-setting-modal ${
        isOpen ? 'show-modal' : 'hide-modal'
      }`}
    >
      <div className="cookie-setting-modal-root">
        <div className="cookie-setting-modal-header">
          <div className="cookie-setting-modal-title">Cookie Policy</div>
          <div className="cookie-setting-modal-header-buttons">
            <div className="cookie-policy-banner-custom-btn cookie-policy-banner-btn">
              {t("Don't enable all")}
            </div>
            <div className="cookie-policy-banner-custom-btn cookie-policy-banner-btn">
              {t('Enable all')}
            </div>
            <button className="cookie-setting-modal-close-btn">
              <span onClick={onClose}>&times;</span>
            </button>
          </div>
        </div>
        <div className="cookie-setting-modal-content">
          <div className="cookie-setting-modal-text">
            We use cookies to help improve your experience of our website at{' '}
            <span className="cookie-policy-link-text">
              https://mecarreira.com
            </span>{' '}
            and its subdomains. This cookie policy is part of meCarreira AG's
            privacy policy. It covers the use of cookies between your device and
            our site.
          </div>
          <div className="cookie-setting-modal-text">
            We also provide basic information on third-party services we may
            use, who may also use cookies as part of their service. This policy
            does not cover their cookies.
          </div>
          <div className="cookie-setting-modal-text">
            If you don’t wish to accept cookies from us, you should instruct
            your browser to refuse cookies from{' '}
            <span className="cookie-policy-link-text">
              https://mecarreira.com.
            </span>{' '}
            In such a case, we may be unable to provide you with some of your
            desired content and services.
          </div>
          <div className="cookie-setting-modal-subtitle">What is a cookie?</div>
          <div className="cookie-setting-modal-text">
            A cookie is a small piece of data that a website stores on your
            device when you visit. It typically contains information about the
            website itself, a unique identifier that allows the site to
            recognize your web browser when you return, additional data that
            serves the cookie’s purpose, and the lifespan of the cookie itself.
          </div>
          <div className="cookie-setting-modal-text">
            Cookies are used to enable certain features (e.g. logging in), track
            site usage (e.g. analytics), store your user settings (e.g. time
            zone, notification preferences), and to personalize your content
            (e.g. advertising, language).
          </div>
          <div className="cookie-setting-modal-text">
            Cookies set by the website you are visiting are usually referred to
            as first-party cookies. They typically only track your activity on
            that particular site.
          </div>
          <div className="cookie-setting-modal-text">
            Cookies set by other sites and companies (i.e. third parties) are
            called third-party cookies They can be used to track you on other
            websites that use the same third-party service.
          </div>
          <div className="cookie-setting-modal-subtitle">
            Types of cookies and how we use them
          </div>
          <div className="cookie-setting-modal-subtitle">Essential cookies</div>
          <div className="cookie-setting-modal-text">
            Essential cookies are crucial to your experience of a website,
            enabling core features like user logins, account management,
            shopping carts, and payment processing.
          </div>
          <div className="cookie-setting-modal-text">
            We use essential cookies to enable certain functions on our website
            and without those cookies the website cannot function. None of those
            cookies contains any personal or any other form of data that could
            identify an individual person.
          </div>
          <div className="cookie-setting-modal-subtitle">
            Performance cookies
          </div>
          <div className="cookie-setting-modal-text">
            Performance cookies track how you use a website during your visit.
            Typically, this information is anonymous and aggregated, with
            information tracked across all site users. They help companies
            understand visitor usage patterns, identify and diagnose problems or
            errors their users may encounter, and make better strategic
            decisions in improving their audience’s overall website experience.
            These cookies may be set by the website you’re visiting
            (first-party) or by third-party services. They do not collect
            personal information about you.
          </div>
          <div className="cookie-setting-modal-text">
            We use performance cookies on our site.
          </div>
          <div className="cookie-setting-modal-subtitle">
            Functionality cookies
          </div>
          <div className="cookie-setting-modal-text">
            Functionality cookies are used to collect information about your
            device and any settings you may configure on the website you’re
            visiting (like language and time zone settings). With this
            information, websites can provide you with customized, enhanced, or
            optimized content and services. These cookies may be set by the
            website you’re visiting (first-party) or by third-party services.
          </div>
          <div className="cookie-setting-modal-text">
            We use functionality cookies for selected features on our site.
          </div>
          <div className="cookie-setting-modal-subtitle">
            Targeting/advertising cookies
          </div>
          <div className="cookie-setting-modal-text">
            Targeting/advertising cookies help determine what promotional
            content is most relevant and appropriate to you and your interests.
            Websites may use them to deliver targeted advertising or limit the
            number of times you see an advertisement. This helps companies
            improve the effectiveness of their campaigns and the quality of
            content presented to you. These cookies may be set by the website
            you’re visiting (first-party) or by third-party services.
          </div>
          <div className="cookie-setting-modal-text">
            Targeting/advertising cookies set by third-parties may be used to
            track you on other websites that use the same third-party service.
          </div>
          <div className="cookie-setting-modal-text">
            We use performance cookies on our site.
          </div>
        </div>
      </div>
    </div>
  )
}

export default CookiePolicySetting
