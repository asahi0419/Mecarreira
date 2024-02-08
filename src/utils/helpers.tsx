import {
  countriesData,
  countriesDataNew,
  MOBILE_MAX_WIDTH,
  PUBLIC_KEY,
} from '@root/constants'
import { ethers } from 'ethers'
import { t } from 'i18next'
import forge from 'node-forge'
import TagManager from 'react-gtm-module'
import { tagManagerArgs } from '@root/constants'
import Cookies from 'universal-cookie'

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const isNumeric = (str: string) => {
  if (typeof str != 'string') {
    return false
  } // we only process strings!
  return !isNaN(parseFloat(str)) && !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

export const asyncLocalStorage = {
  setItem: function (key: string, value: string) {
    return Promise.resolve().then(function () {
      localStorage.setItem(key, value)
    })
  },
  getItem: function (key: string) {
    return Promise.resolve().then(function () {
      return localStorage.getItem(key)
    })
  },
  removeItem: function (key: string) {
    return Promise.resolve().then(function () {
      return localStorage.removeItem(key)
    })
  },
}

export const isMobile = () => {
  return window.innerWidth <= MOBILE_MAX_WIDTH
}

export const truncateDecimals = (number: number, digits: number) => {
  const multiplier = Math.pow(10, digits),
    adjustedNum = number * multiplier,
    truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum)
  return truncatedNum / multiplier
}

export const truncateDecimalsStr = (number: number, digits: number) => {
  const multiplier = Math.pow(10, digits),
    adjustedNum = number * multiplier,
    truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum)
  return truncatedNum || !digits
    ? (truncatedNum / multiplier).toString()
    : '0.'.padEnd(digits + 2, '0')
}

export const truncateDecimals2 = (number: any, digits: any) => {
  const multiplier = Math.pow(10, digits),
    adjustedNum = number * multiplier,
    truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum)
  return truncatedNum / multiplier
}

export const encrypt = (text?: string) => {
  if (!text) {
    return ''
  }
  const publicKey = forge.pki.publicKeyFromPem(PUBLIC_KEY)
  const encrypted = publicKey.encrypt(text, 'RSA-OAEP', {
    md: forge.md.sha256.create(),
  })
  return forge.util.encode64(encrypted)
}

export const decrypt = (text?: string) => {
  if (!text) {
    return ''
  }
  return text
  // const privateKey = forge.pki.privateKeyFromPem(PRIVATE_KEY)
  // const encryptedSecretKey = forge.util.decode64(text ?? '')
  // return privateKey.decrypt(encryptedSecretKey, 'RSA-OAEP', {
  //   md: forge.md.sha256.create(),
  // })
}

export const convertToFixed = (exp: any) => {
  if (Math.abs(exp) < 1.0) {
    const e = parseInt(exp.toString().split('e-')[1])
    if (e) {
      exp *= Math.pow(10, e - 1)
      exp = '0.' + new Array(e).join('0') + exp.toString().substring(2)
    }
  } else {
    let e = parseInt(exp.toString().split('+')[1])
    if (e > 20) {
      e -= 20
      exp /= Math.pow(10, e)
      exp += new Array(e + 1).join('0')
    }
  }
  return truncateDecimals(parseInt(exp), 2)
}

export const pad = (num: any) => ('0' + num).slice(-2) // or use padStart
export const getTimeFromDate = (timestamp: any) => {
  const date = new Date(timestamp * 1000)
  const hours = date.getHours(),
    minutes = date.getMinutes(),
    seconds = date.getSeconds()
  return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
}

export function toFixedTrunc(x: any, n: number) {
  const v = (typeof x === 'string' ? x : x.toString()).split('.')
  if (n <= 0) return v[0]
  let f = v[1] || ''
  if (f.length > n) return `${v[0]}.${f.substr(0, n)}`
  while (f.length < n) f += '0'
  return `${v[0]}.${f}`
}
export const getPlayerLevelName = (playerLevelId: number) => {
  if (playerLevelId === 5) {
    return 'Diamond'
  } else if (playerLevelId === 4) {
    return 'Gold'
  } else if (playerLevelId === 3) {
    return 'Silver'
  } else if (playerLevelId === 2) {
    return 'Bronze'
  } else if (playerLevelId === 1) {
    return 'None'
  } else if (playerLevelId === 0) {
    return 'Launching'
  } else if (playerLevelId === null) {
    return 'Coming Soon'
  }
  return 'Coming Soon'
}
export const getPlayerLevelClassName = (playerLevelId: number) => {
  if (playerLevelId === 5) {
    return 'player_level_diamond'
  } else if (playerLevelId === 4) {
    return 'player_level_gold'
  } else if (playerLevelId === 3) {
    return 'player_level_silver'
  } else if (playerLevelId === 2) {
    return 'player_level_bronze'
  } else {
    return 'player_level_none'
  }
}

export const getDeliveryMode = (deliveryId: number) => {
  if (deliveryId === 1) {
    return 'postal'
  } else if (deliveryId === 2) {
    return 'digital'
  } else {
    return ''
  }
}
export const getCountryNameNew = countryId => {
  if (countryId) {
    const countryIndex = countriesDataNew.findIndex(
      country => country.countryid === countryId,
    )
    return countriesDataNew[countryIndex]?.countrynamenice
  }
  return ' '
}

export const getCountryCodeNew = countryId => {
  if (countryId) {
    const countryIndex = countriesDataNew.findIndex(
      country => country.countryid === countryId,
    )
    return countriesDataNew[countryIndex]?.iso2
  }
  return ' '
}
export const getCountryCode = countryId => {
  if (countryId) {
    const countryIndex = countriesDataNew.findIndex(
      country => country.countryid === countryId,
    )
    return countriesDataNew[countryIndex]?.iso2.toLowerCase()
  }
  return ' '
}
export const getCountryId = countryCode => {
  if (countryCode) {
    const countryIndex = countriesDataNew.findIndex(
      country => country.iso2 === countryCode,
    )
    return countriesDataNew[countryIndex]?.countryid
  }
  return 0
}
export const getCountryName = (iso: string, countries) => {
  if (iso) {
    if (countries.length === 0) {
      const countryIndex = countriesData.findIndex(
        country => country.iso === iso.toUpperCase(),
      )
      return countriesData[countryIndex]?.country
    } else {
      const countryIndex = countries.findIndex(
        country => country.iso2 === iso.toUpperCase(),
      )
      return countries[countryIndex]?.countrynamenice
    }
  }
  return ' '
}

export function getFlooredFixed(v: number, d: number) {
  return (Math.floor(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d)
}

export function getRoundedFixed(v: number, d: number) {
  return (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d)
}

export function toNumberFormat(v: string) {
  const numberFormatter = Intl.NumberFormat('en-US')
  if (!v) {
    return '0'
  }
  v = v.toString()
  return (
    numberFormatter.format(Number.parseInt(v.split('.')[0])) +
    (v.split('.').length > 1 ? '.' + v.split('.')[1] : '')
  )
}

export function toUsd(value, rate) {
  if (!value || !rate) {
    return 0
  }
  return value * rate
}

export function toXPNumberFormat(value: string | number) {
  let number = typeof value === 'string' ? parseInt(value) : Math.round(value)
  if (Math.abs(number) > 9999) {
    const suffix = 'K'
    let num = number / 1000
    num = Math.floor(num)
    return num + suffix
  } else if (number < 0) {
    number = 0
  }

  return number.toString()
}

export function toKPINumberFormat(value: string | number) {
  const number = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(number) || number <= 0) {
    return '0.00'
  }

  let formattedNumber: string
  if (Math.abs(number) >= 10000) {
    if (Math.abs(number) >= 1000000) {
      formattedNumber = (number / 1000000).toFixed(2).toLocaleString() + 'M'
    } else if (Math.abs(number) >= 1000) {
      formattedNumber = (number / 1000).toFixed(2).toLocaleString() + 'K'
    } else {
      formattedNumber = number.toFixed(2)
    }
  } else {
    formattedNumber = (
      Math.floor(number * Math.pow(10, 2)) / Math.pow(10, 2)
    ).toFixed(2)
  }
  // Add commas for thousands separator
  formattedNumber = formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  // Remove decimal if zero
  // formattedNumber = formattedNumber.replace('.00', '')
  return formattedNumber
}

export function toKPINumberFormatFourDecimal(value: string | number) {
  const number = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(number) || number <= 0) {
    return '0.00'
  }

  let formattedNumber: string
  if (Math.abs(number) >= 10000) {
    if (Math.abs(number) >= 1000000) {
      formattedNumber = (number / 1000000).toFixed(4).toLocaleString() + 'M'
    } else if (Math.abs(number) >= 1000) {
      formattedNumber = (number / 1000).toFixed(4).toLocaleString() + 'K'
    } else {
      formattedNumber = number.toFixed(4)
    }
  } else {
    formattedNumber = (
      Math.floor(number * Math.pow(10, 4)) / Math.pow(10, 4)
    ).toFixed(4)
  }
  // Add commas for thousands separator
  formattedNumber = formattedNumber.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
  // Remove decimal if zero
  formattedNumber = formattedNumber.replace('.0000', '')
  return formattedNumber
}

export function fourDecimalWithoutRoundOff(v: number, d: number): string {
  const result = (Math.floor(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d)
  return parseFloat(result).toString()
}

export function toKPIIntegerFormat(value: string | number) {
  const number = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(number) || number <= 0) {
    return '0'
  }

  let formattedNumber: string
  if (Math.abs(number) >= 10000) {
    if (Math.abs(number) >= 1000000) {
      formattedNumber = (number / 1000000).toFixed(0).toLocaleString() + 'M'
    } else if (Math.abs(number) >= 1000) {
      formattedNumber = (number / 1000).toFixed(0).toLocaleString() + 'K'
    } else {
      formattedNumber = number.toFixed(0)
    }
  } else {
    formattedNumber = number.toFixed(0)
  }
  // Add commas for thousands separator
  formattedNumber = formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  // Remove decimal if zero
  formattedNumber = formattedNumber.replace('.00', '')
  return formattedNumber
}

export function getFlooredNumber(v: number) {
  return Math.floor(v).toLocaleString()
}

export function getFlooredAnyFixed(v: number, d: number): string {
  const result = (Math.floor(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d)
  return parseFloat(result).toString()
}

export const getCircleColor = (playerStatus: number) => {
  if (playerStatus === 5) {
    return 'linear-gradient(#c879f9 ,#d0deec,#c879f9)'
  } else if (playerStatus === 4) {
    return 'linear-gradient(#f5b933 ,#fbe9b3,#f5b933)'
  } else if (playerStatus === 3) {
    return 'linear-gradient(#95979a ,#e7e7e8,#95979a)'
  } else if (playerStatus === 2) {
    return 'linear-gradient(#c37b47 ,#feddc4,#c37b47)'
  } else if (playerStatus < 2) {
    const value = localStorage.getItem('theme')
    if (value === 'Dark' || !value) {
      return 'linear-gradient(to top, #ffffff, #ffffff, #ffffff)'
    } else {
      return 'linear-gradient(black, black,black)'
    }
  }
}
export const timeAgo = seconds => {
  let interval = Math.floor(seconds / 31536000)

  if (interval > 1) {
    return `${interval} years ago`
  }
  interval = Math.floor(seconds / 2592000)
  if (interval > 1) {
    return `${interval} months ago`
  }
  interval = Math.floor(seconds / 86400)
  if (interval > 1) {
    return `${interval} days ago`
  }
  interval = Math.floor(seconds / 3600)
  if (interval > 1) {
    return `${interval} hours ago`
  }
  interval = Math.floor(seconds / 60)
  if (interval > 1) {
    return `${interval} minutes ago`
  }
  return `${Math.floor(seconds)} seconds ago`
}
export const getVotePercentage = (item: any) => {
  return item?.votesumtotal !== 0
    ? ((item?.votesumselection / item?.votesumtotal) * 100)
        .toFixed(2)
        .toString()
    : '0.00'
}

export const isUserWallet = (walletAddress: string) => {
  if (walletAddress) {
    return (
      localStorage.getItem('loginInfo')?.toLowerCase() ===
        walletAddress.toLowerCase() ||
      localStorage.getItem('userWalletAddress')?.toLowerCase() ===
        walletAddress.toLowerCase()
    )
  }
  return false
}

// custom
export const displayDate = (date: string) => {
  const tempDate = new Date(date)
  return (
    tempDate.getDate() +
    '/' +
    (tempDate.getMonth() + 1) +
    '/' +
    tempDate.getFullYear()
  )
}

export const startAndEnd = (str: string) => {
  if (str.length > 35) {
    return str.substr(0, 20) + '...' + str.substr(str.length - 10, str.length)
  }
  return str
}

export const displayDateTime = (date: number | string) => {
  const tempDate = new Date(date)
  return (
    tempDate.getDate() +
    '/' +
    (tempDate.getMonth() + 1) +
    '/' +
    tempDate.getFullYear() +
    ',' +
    tempDate.toLocaleTimeString()
  )
}

export const getMarketValue = (
  matic: number,
  rate: number,
  coinsIssued: number,
) => {
  const currency = matic * rate
  return isNaN(currency) || coinsIssued < 0 ? 0 : coinsIssued * currency
}

export const getUsdFromMatic = (playerData: any) => {
  if (!playerData?.exchangeRateUSD) {
    return {
      usdOld: 0.0,
      usdNow: 0.0,
    }
  }
  const usdNow =
    (playerData?.matic ?? playerData?.matic_price) *
    playerData?.exchangeRateUSD['rate']
  const usdOld =
    playerData['24h_change'] * playerData?.exchangeRateUSD['24h_rate']

  return {
    usdOld: !isNaN(usdOld) ? usdOld : 0.0,
    usdNow: !isNaN(usdNow) ? usdNow : 0.0,
  }
}

export const getPercentageEst = (player: any) => {
  if (!player?.exchangeRateUSD) {
    return {
      oldNumber: 0.0,
      newNumber: 0.0,
      percentage: 0.0,
    }
  }
  const oldNumber = player['24h_change'] * player?.exchangeRateUSD['24h_rate']
  const newNumber = player['matic'] * player?.exchangeRateUSD['rate']
  const decreaseValue = oldNumber - newNumber
  const percentage = (Math.abs(decreaseValue) / oldNumber) * 100
  return {
    oldNumber,
    newNumber,
    percentage: isFinite(percentage) ? percentage : 0.0,
  }
}

export function IntervalTimer(timerId, callback, interval) {
  let startTime,
    remaining = 0
  let state = 0 //  0 = idle, 1 = running, 2 = paused, 3= resumed

  this.pause = function () {
    if (state !== 1) return

    remaining = interval - (new Date() - startTime)
    clearInterval(timerId)
    state = 2
  }

  this.resume = function () {
    if (state !== 2) return

    state = 3
    setTimeout(this.timeoutCallback, remaining)
  }

  this.timeoutCallback = function () {
    if (state !== 3) return

    callback()

    startTime = new Date()
    timerId = setInterval(callback, interval)
    state = 1
  }

  startTime = new Date()
  timerId = setInterval(callback, interval)
  state = 1
}

export const checkTokenId = resp => {
  if (![null, undefined].includes(resp)) {
    if (resp > -1) {
      return `#${resp}`
    }
  } else {
    return ''
  }
}

export const initTagManager = () => {
  const cookies = new Cookies()
  const storedCookies = cookies.get('cookieAccepted')
  if (storedCookies !== undefined && storedCookies?.includes('PC')) {
    TagManager.initialize(tagManagerArgs)
  }
}

export const clearCacheData = () => {
  caches.keys().then(names => {
    names.forEach(name => {
      caches.delete(name)
    })
  })
  console.log('Complete Cache Cleared')
}

// export const checkInviteNotLinked = action => {
//   console.log('CINL--', { action })
//   return (
//     !(action.payload?.response?.data?.detail || '').includes(
//       'invite_not_linked',
//     ) ||
//     !(action.payload?.response?.data?.detail || '').includes(
//       'You do not have permission to perform this action.',
//     )
//   )
// }

export const checkInviteNotLinked = action => {
  console.log('CINL--', { action })
  return !(action.payload?.response?.data?.detail || '').includes(
    'invite_not_linked',
  )
}

export const checkForStatusZero = action => {
  console.log('CFSZ--', { action })
  return !(action.payload?.response?.data?.detail || '').includes(
    'You do not have permission to perform this action.',
  )
}

export const checkForAuthNotProvided = action => {
  console.log('CFANP--', { action })
  const exception = action.payload?.response?.data?.detail || ''
  // return (action.payload?.response?.data?.detail || '').includes(
  //   'Authentication credentials were not provided.',
  // )
  // access_token expired
  // if (exception.includes('Authentication credentials were not provided.')) {
  //   return true
  // } else if (exception.includes('access_token expired')) {
  //   return true
  // }
  if (exception.includes('access_token expired')) {
    return true
  }
  return false
}

export const truncateFloat = (number, decimalPlaces) => {
  // Convert the number to a string
  const numberStr = number.toString()
  let truncStr

  // Split the string at the dot
  const [integerPart, decimalPart] = numberStr.split('.')

  // Check if there is a decimal part and if it's longer than decimalPlaces
  if (decimalPart && decimalPart.length > decimalPlaces) {
    // Truncate the decimal part to the specified length
    const truncatedDecimal = decimalPart.slice(0, decimalPlaces)

    // Concatenate the integer part and the truncated decimal part
    truncStr = `${integerPart}.${truncatedDecimal}`
  } else {
    // If the decimal part is shorter or doesn't exist, return the original number
    truncStr = numberStr
  }

  return Math.abs(parseFloat(truncStr))
}

export const isPwa = () => {
  return window.matchMedia('(display-mode: standalone)').matches
}

export const getBrowserName = () => {
  const browserInfo = navigator.userAgent
  let browser
  if (browserInfo.includes('Opera') || browserInfo.includes('Opr')) {
    browser = 'Opera'
  } else if (browserInfo.includes('Edg')) {
    browser = 'Edge'
  } else if (browserInfo.includes('Chrome')) {
    browser = 'Chrome'
  } else if (browserInfo.includes('Safari')) {
    browser = 'Safari'
  } else if (browserInfo.includes('Firefox')) {
    browser = 'Firefox'
  } else {
    browser = 'unknown'
  }
  return browser
}
