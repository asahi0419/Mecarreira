import axios from 'axios'
import { API_CONSTANTS as constants } from '@root/constants'
import store from '@root/store/store'
import {
  cloudFlareCheck,
  cloudFlareTokenReset,
} from './onboarding/authenticationSlice'

const axiosClient = axios.create()

axiosClient.defaults.baseURL = constants.HOST_URL

axiosClient.interceptors.request.use(function (config) {
  const token = null //store.getState().authentication.isAccessToken
  const accessToken = localStorage.getItem('accessToken')
  if (accessToken) {
    config.headers.Authorization = `Bearer ${token || accessToken}`
  }
  return config
})

// To share cookies to cross site domain, change to true.
axiosClient.defaults.withCredentials = true

export function getRequestAuth(URL) {
  return axiosClient.get(`/${URL}`).then(response => response)
}

export function getRequest(URL) {
  return axiosClient.get(`/${URL}`).then(response => response)
}

export function postRequestAuth(URL, payload = {}) {
  console.log('PAR--', { payload })
  const cloudflareToken = localStorage.getItem('cloudflare_token')
  if (cloudflareToken) {
    payload.HTTP_X_CLOUDFLARE_TOKEN = cloudflareToken
  }
  return axiosClient
    .post(`/${URL}`, payload)
    .then(response => {
      store.dispatch(cloudFlareTokenReset(true))
      return response
    })
    .catch(error => {
      // Check if the error response has a 406 status code
      if (error.response && error.response.status === 406) {
        // console.error('Error 406: Not Acceptable', error.response.data.error)
        if (error.response.data.error) {
          store.dispatch(cloudFlareCheck(error.response.data.error))
        }
      }
      throw error // Re-throw the error to be caught by the caller
    })
}

export function patchRequestAuth(URL, payload) {
  return axiosClient.patch(`/${URL}`, payload).then(response => response)
}

export function putRequestAuth(URL, payload = {}) {
  const cloudflareToken = localStorage.getItem('cloudflare_token')
  if (cloudflareToken) {
    payload.HTTP_X_CLOUDFLARE_TOKEN = cloudflareToken
  }
  return axiosClient
    .put(`/${URL}`, payload)
    .then(response => {
      store.dispatch(cloudFlareTokenReset(true))
      return response
    })
    .catch(error => {
      // Check if the error response has a 406 status code
      if (error.response && error.response.status === 406) {
        // console.error('Error 406: Not Acceptable', error.response.data.error)
        if (error.response.data.error) {
          store.dispatch(cloudFlareCheck(error.response.data.error))
        }
      }
      throw error // Re-throw the error to be caught by the caller
    })
}

export function deleteRequestAuth(URL, payload) {
  return axiosClient
    .delete(`/${URL}`, { data: payload })
    .then(response => response)
}
