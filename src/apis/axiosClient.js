import axios from 'axios'
import { API_CONSTANTS as constants } from '@root/constants'
import store from '@root/store/store'
import {
  cloudFlareCheck,
  cloudFlareTokenReset,
} from './onboarding/authenticationSlice'
const axiosClient = axios.create()

axiosClient.defaults.baseURL = constants.HOST_URL

// axiosClient.defaults.headers = {
//   Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
// }
// To share cookies to cross site domain, change to true.
axiosClient.defaults.withCredentials = true

export function getRequest(URL) {
  const jph = localStorage.getItem('accessToken')
  console.log({ jph })
  if (jph) {
    return axiosClient
      .get(`/${URL}`, { Authorization: `Bearer ${jph}` })
      .then(response => response)
  }
  return axiosClient.get(`/${URL}`).then(response => response)
}

export function postRequest(URL, payload) {
  console.log({ payload })
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

export function patchRequest(URL, payload) {
  return axiosClient.patch(`/${URL}`, payload).then(response => response)
}

export function deleteRequest(URL) {
  return axiosClient.delete(`/${URL}`).then(response => response)
}

export const makeGetRequest = async (url, data = null) => {
  const headers = {}
  if (localStorage.getItem('accessToken')) {
    headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
  }

  try {
    return axiosClient({
      method: 'GET',
      url,
      data,
      headers,
    })
  } catch (error) {
    console.error(error)
  }
}

export const makeGetRequestAdvance = (url, data = null) => {
  let axiosClient = null
  if (url.includes(constants.HOST_URL)) {
    axiosClient = axios.create()
  } else {
    axiosClient = axios.create({
      baseURL: constants.HOST_URL,
    })
  }
  const headers = {}
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
  try {
    // return axiosClient({
    //   method: 'GET',
    //   url,
    //   data,
    //   headers,
    // })
    return axiosClient.get(url)
  } catch (error) {
    // Handle errors here
    console.error('MGRA::', error)
  }
}
