import React, { useEffect } from 'react'
import MRoutes from '@navigation/routes'
import '@assets/css/global/Style.css'
import '@assets/css/global/Font.css'
import store from '@root/store/store'
import { Provider as ReduxProvider, useDispatch } from 'react-redux'
import Cookies from 'universal-cookie'
// import AddToHomeScreen from '@ideasio/add-to-homescreen-react'
// import { clearCacheData } from '@utils/helpers'

function App() {
  const localStorageVersion = '1.3'
  const deploymentVersion = '0.33'
  const cookies = new Cookies()

  useEffect(() => {
    const storedVersion = localStorage.getItem('appVersion')
    const Cookies = document.cookie.split(';')
    if (storedVersion !== localStorageVersion) {
      localStorage.clear()
      localStorage.setItem('appVersion', localStorageVersion)
      for (let i = 0; i < Cookies.length; i++) {
        document.cookie = Cookies[i] + '=; expires=' + new Date(0).toUTCString()
      }
    }
    if (localStorage.getItem('deployment_version') !== deploymentVersion) {
      localStorage.setItem('deployment_version', deploymentVersion)
    }
    console.log('for test app')
    // const cookieLoginData = cookies.get('authInfo')
    // // if  first rendering with login : login
    // if (cookieLoginData !== undefined) {
    //   console.log('========= loaded Cookie info ==========')
    //   const decodedCookieValue = decodeURIComponent(cookieLoginData)
    //   const cookieData = JSON.parse(decodedCookieValue)
    //   console.log(
    //     '========= loaded Cookie infoJSON ==========' +
    //       JSON.stringify({
    //         cookieData,
    //         localStorageToken: localStorage.getItem('accessToken'),
    //       }),
    //   )
    //   // check if accessToken is changed
    //   if (localStorage.getItem('accessToken') !== cookieData.accessToken) {
    //     let isLoggedIn = false
    //     if (!localStorage.getItem('accessToken')) {
    //       isLoggedIn = true
    //     }
    //     localStorage.setItem('accessToken', cookieData.accessToken)
    //     localStorage.setItem('loginInfo', cookieData.loginInfo)
    //     localStorage.setItem('wallet', cookieData.wallet)
    //     localStorage.setItem(
    //       'externalWalletAddress',
    //       cookieData.externalWalletAddress,
    //     )
    //     localStorage.setItem(
    //       'privy:token',
    //       cookieData.privyToken === 'null' ? '' : cookieData.privyToken,
    //     )
    //     localStorage.setItem(
    //       'privy:refresh_token',
    //       cookieData.privyRefreshToken,
    //     )
    //     localStorage.setItem('privy:connections', cookieData.privyConnections)
    //     // dispatch(loginWithWalletCookie())
    //     // if privy login from other domain, it has to refresh since hook values are not updated after update of localstorage
    //     if (cookieData.wallet === 'Privy' && isLoggedIn) {
    //       // window.location.reload()  //temporarily
    //     }
    //   } else {
    //     console.log('cookieToken_matches_localStorage_token')
    //   }
    // }
  }, [])

  return (
    <div className="App">
      {/* <AddToHomeScreen hideClass="d-none" startAutomatically={false} /> */}
      <ReduxProvider store={store}>
        <MRoutes />
      </ReduxProvider>
    </div>
  )
}

export default App
