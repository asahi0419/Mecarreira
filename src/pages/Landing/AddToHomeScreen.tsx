import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import classnames from 'classnames'
import Logo from '@assets/images/logo-min.webp'
import Home from '@assets/icons/icon/home.webp'
import DownloadDesktopApp from '@assets/images/desktop_min.webp'
import DownloadMobileApp from '@assets/images/mobile_min.webp'
import ImageComponent from '@components/ImageComponent'
import { isMobile, getBrowserName } from '@utils/helpers'
import classNames from 'classnames'

interface Props {
  onCancel: () => void
  onAccept: () => void
  promptEvt: any
}
let deferredPrompt
const AddToHomeScreen: React.FC<Props> = ({
  onCancel,
  onAccept,
  promptEvt,
}) => {
  const { t } = useTranslation()
  const currentBrowser = getBrowserName()
  // const [supportsPWA, setSupportsPWA] = useState(false)
  // const [promptInstall, setPromptInstall] = useState(null)

  // useEffect(() => {
  //   const handler = e => {
  //     try {
  //       e.preventDefault()
  //       // Save the event because you'll need to trigger it later.
  //       deferredPrompt = e
  //       console.log('we are being triggered :D')
  //       setSupportsPWA(true)
  //       setPromptInstall(e)
  //     } catch (error) {
  //       console.error('handlerErr', error)
  //     }
  //   }
  //   window.addEventListener('beforeinstallprompt', handler)
  //   return () => window.removeEventListener('transitionend', handler)
  // }, [])

  const getTranslation = (text: string) => {
    const translation = t(text)
    if (translation === text) {
      return text
    } else {
      return translation
    }
  }

  // const onGetPWA = evt => {
  //   try {
  //     evt.preventDefault()
  //     if (!promptEvt) {
  //       return
  //     }
  //     promptEvt.prompt()
  //     // promptInstall.prompt()
  //     promptEvt.userChoice.then(choiceResult => {
  //       if (choiceResult.outcome === 'accepted') {
  //         console.log('User accepted the A2HS prompt')
  //         localStorage.setItem('added_home', 'yes')
  //         localStorage.setItem(
  //           'a2hsprompt_hidden',
  //           new Date().getTime().toString(),
  //         )
  //         onAccept()
  //       } else {
  //         console.log('User dismissed the A2HS prompt')
  //       }
  //       promptEvt = null
  //     })
  //     /*
  //     // hide our user interface that shows our A2HS button
  //     btnAdd.style.display = 'none';
  //     // Show the prompt
  //     deferredPrompt.prompt();
  //     // Wait for the user to respond to the prompt
  //     deferredPrompt.userChoice
  //       .then((choiceResult) => {
  //         if (choiceResult.outcome === 'accepted') {
  //           console.log('User accepted the A2HS prompt');
  //         } else {
  //           console.log('User dismissed the A2HS prompt');
  //         }
  //         deferredPrompt = null;
  //       });
  //     */
  //   } catch (error) {
  //     console.error('clickBait--', error)
  //   }
  // }

  const onSuccess = async evt => {
    // await onGetPWA(evt)
    console.log('')
    // onAccept()
  }

  return (
    <div className="newsletter-wrapper">
      <ImageComponent
        loading="lazy"
        // src={Logo}
        src={isMobile() ? DownloadMobileApp : DownloadDesktopApp}
        alt=""
        className="homescreen-logo"
      />
      <span
        className={classnames('blog-title ct-h2', !isMobile() ? 'mt-20' : '')}
      >
        {t('add to homescreen')}
      </span>
      <div className="bottom-caption-wrapper">
        <span
          className={classnames(
            'blog-content mt-20',
            !isMobile() ? 'installation-msg' : '',
          )}
          // style={{ width: isMobile() ? '100vw' : '100%' }}
        >
          {getTranslation('add this app to homescreen')}
        </span>
      </div>
      {currentBrowser === 'Safari' ? (
        <div className="addhome-btn-wrapper">
          <div className="bottom-caption-wrapper">
            <span
              className={classnames(
                'blog-content mt-20',
                !isMobile() ? 'installation-msg' : '',
              )}
              // style={{ width: isMobile() ? '100vw' : '100%' }}
            >
              {t('tap on share option safari') + ' ' + t('add to home')}
            </span>
          </div>
          <span className={classnames('newsletter-submit')}>
            <div
              onClick={() => onCancel()}
              className="button-box submit-btn-box"
            >
              {t('not now')}
            </div>
          </span>
        </div>
      ) : (
        <div className="addhome-btn-wrapper">
          <span className={classnames('newsletter-submit')}>
            <div
              className="button-box submit-btn-box active-btn-launch"
              onClick={onAccept}
              // onClick={onSuccess}
            >
              {t('yes')}
            </div>
          </span>
          <span className={classnames('newsletter-submit')}>
            <div
              onClick={() => onCancel()}
              className="button-box submit-btn-box"
            >
              {t('not now')}
            </div>
          </span>
        </div>
      )}
    </div>
  )
}

export default AddToHomeScreen
