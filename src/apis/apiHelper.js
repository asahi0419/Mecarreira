import store from '@root/store/store'
import {
  logout,
  resetWallet,
  userEmail,
  getWalletDetails,
} from '@root/apis/onboarding/authenticationSlice'
import { asyncLocalStorage } from '@utils/helpers'
import toast from 'react-hot-toast'
import { resetPlayerData } from './playerCoins/playerCoinsSlice'

// const tokenPromise = new Promise((resolve, reject) => {
//   try {
//     const refresh = localStorage.getItem('refreshToken')
//     const access = localStorage.getItem('accessToken')
//     if (refresh) {
//       resolve(refresh)
//     } else if (access) {
//       resolve(access)
//     } else if (!refresh && !access) {
//       // throw new Error('no access or refresh found')
//     }
//   } catch (err) {
//     reject(err)
//   }
// })

export function handleException(error) {
  const { response } = error
  const loggedOut =
    !localStorage.getItem('loginInfo') && !localStorage.getItem('loginId')
  // try {
  //   loggedOut = store.getState().authentication.isLoggedOut
  // } catch (error) {
  //   loggedOut =
  //     !localStorage.getItem('loginInfo') && !localStorage.getItem('loginId')
  // }
  const tokenPromise = new Promise((resolve, reject) => {
    try {
      const refresh = localStorage.getItem('refreshToken')
      const access = localStorage.getItem('accessToken')
      if (refresh) {
        resolve(refresh)
      } else if (access) {
        resolve(access)
      } else if (!refresh && !access) {
        // throw new Error('no access or refresh found')
      }
    } catch (err) {
      reject(err)
    }
  })
  const loginId = localStorage.getItem('loginId')
  // if (loginId) {
  //   if (
  //     (response?.data?.message === 'Device Verification Failed' &&
  //       !loggedOut) ||
  //     (response?.data?.detail === 'access_token expired' && !loggedOut)
  //   ) {
  //     store.dispatch(getWalletDetails())
  //     asyncLocalStorage.getItem('refreshToken').then(token => {
  //       if (token) {
  //         toast.error('Session timed out. You were logged out')
  //         const reqParams = {
  //           refresh_token: token,
  //         }
  //         store.dispatch(resetPlayerData())
  //         store.dispatch(resetWallet())
  //         store.dispatch(logout(reqParams))
  //         localStorage.removeItem('ISLAUNCHCLICKED')
  //         localStorage.removeItem('userWalletAddress')
  //         store.dispatch(
  //           userEmail({
  //             setLoginEmail: response?.data?.email,
  //             invalidDevice:
  //               response?.data?.invalidDevice === 'True' ? true : false,
  //           }),
  //         )
  //       }
  //     })
  //     tokenPromise
  //       .then(token => {
  //         store.dispatch(getWalletDetails())
  //         if (token) {
  //           toast.error('Session timed out. You were logged out')
  //           const reqParams = {
  //             refresh_token: token,
  //           }
  //           store.dispatch(resetPlayerData())
  //           store.dispatch(resetWallet())
  //           store.dispatch(logout(reqParams))
  //           localStorage.removeItem('ISLAUNCHCLICKED')
  //           localStorage.removeItem('userWalletAddress')
  //           // store.dispatch(
  //           //   userEmail({
  //           //     setLoginEmail: response?.data?.email,
  //           //     invalidDevice:
  //           //       response?.data?.invalidDevice === 'True' ? true : false,
  //           //   }),
  //           // )
  //           //dispatch(showSignupForm())
  //         }
  //       })
  //       .catch(error => {
  //         console.log('handle Exception', error)
  //       })
  //   }
  // }
}
