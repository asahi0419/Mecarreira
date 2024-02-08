import React, { useRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import classnames from 'classnames'
import { isMobile } from '@utils/helpers'
import Typed from 'typed.js'
interface Props {
  onCancel: () => void
  onAccept: () => void
}
const WelcomeTourModal: React.FC<Props> = ({ onCancel, onAccept }) => {
  const { t } = useTranslation()
  const typedRef = useRef(null)
  const typedRef1 = useRef(null)
  const typedRef2 = useRef(null)
  const typedRef3 = useRef(null)
  const typedRef4 = useRef(null)
  const [showBtn, setShowBtn] = useState(false)
  useEffect(() => {
    const options = {
      strings: [t('welcome to the product tour')],
      typeSpeed: 70,
      backSpeed: 30,
      loop: false,
      showCursor: false,
      onStringTyped: () => {
        const options1 = {
          strings: [getTranslation('this tour will guide')],
          typeSpeed: 10,
          backSpeed: 30,
          loop: false,
          showCursor: false,
          onStringTyped: () => {
            const options2 = {
              strings: [getTranslation('after completing this tour')],
              typeSpeed: 10,
              backSpeed: 30,
              loop: false,
              showCursor: false,
              onStringTyped: () => {
                const options3 = {
                  strings: ['200 XP'],
                  typeSpeed: 10,
                  backSpeed: 30,
                  loop: false,
                  showCursor: false,
                  onStringTyped: () => {
                    const options4 = {
                      strings: [getTranslation('to give you a headstart')],
                      typeSpeed: 10,
                      backSpeed: 30,
                      loop: false,
                      showCursor: false,
                      onStringTyped: () => {
                        setShowBtn(true)
                      },
                    }
                    const typed4 = new Typed(typedRef4.current, options4)
                    return () => {
                      typed4.destroy()
                    }
                  },
                }
                const typed3 = new Typed(typedRef3.current, options3)
                return () => {
                  typed3.destroy()
                }
              },
            }
            const typed2 = new Typed(typedRef2.current, options2)
            return () => {
              typed2.destroy()
            }
          },
        }
        const typed1 = new Typed(typedRef1.current, options1)
        return () => {
          typed1.destroy()
        }
      },
    }
    const typed = new Typed(typedRef.current, options)

    // Cleanup: Destroy Typed instance on component unmount
    return () => {
      typed.destroy()
    }
  }, [])

  const getTranslation = (text: string) => {
    const translation = t(text)
    if (translation === text) {
      return text
    } else {
      return translation
    }
  }

  return (
    <div className="newsletter-wrapper">
      <span
        className={classnames(
          'blog-title ct-h2 text-uppercase',
          !isMobile() ? 'mt-20' : '',
        )}
        ref={typedRef}
      ></span>
      <div className="bottom-caption-wrapper">
        <span
          className={classnames(
            'blog-content mt-20',
            !isMobile() ? 'installation-msg' : '',
          )}
          ref={typedRef1}
        ></span>
        <span
          className={classnames(
            'blog-content mt-20',
            !isMobile() ? 'installation-msg' : '',
          )}
        >
          <p>
            <span ref={typedRef2}></span>{' '}
            <span>
              <b ref={typedRef3} className="fg-primary-color"></b>
            </span>{' '}
            <span ref={typedRef4}></span>
          </p>
        </span>
      </div>
      {showBtn ? (
        <div className="addhome-btn-wrapper fade-in">
          <span className={classnames('newsletter-submit')}>
            <div
              className="button-box submit-btn-box active-btn-launch"
              onClick={onAccept}
            >
              {t('start tour')}
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
      ) : null}
    </div>
  )
}

export default WelcomeTourModal
