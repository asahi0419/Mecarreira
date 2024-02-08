import React from 'react'

// function CloudFlareCaptcha(props) {
//   return (
//     <div
//       className="cf-turnstile"
//       data-sitekey="0x4AAAAAAAJ5Gf7pdvorG9Na"
//       data-theme="dark"
//     ></div>
//   )
// }

import { Turnstile } from '@marsidev/react-turnstile'
import { useDispatch } from 'react-redux'
import { cloudFlareTokenReset } from '@root/apis/onboarding/authenticationSlice'

function TurnStileWidget() {
  // console.log('tswidgetCalled')
  const dispatch = useDispatch()
  return (
    <Turnstile
      siteKey={process.env.REACT_APP_CLOUDFLARE_SITE_KEY}
      // siteKey="1x00000000000000000000AA"
      options={{
        // action: 'submit-form',
        // theme: 'light',
        size: 'invisible',
        // language: 'fr',
      }}
      onSuccess={token => {
        console.log('TSTOK--', { token })
        localStorage.setItem('cloudflare_token', token)
        dispatch(cloudFlareTokenReset(false))
      }}
      onError={err => {
        localStorage.removeItem('cloudflare_token')
      }}
    />
  )
}

export default TurnStileWidget
