interface exchangeRate {
  fromticker: string
  rate: number
  ratetimestamp: number
  toticker: string
}
export interface IPlayerCard {
  sharetype: any
  playerstatusid: any
  country_id: any
  nationality_id: any
  exlistingon: boolean
  playerlevelid: number
  id?: number
  pricechangepct: any
  exchangeRateUSD: exchangeRate
  name: string
  surname: string
  givenname: string
  dateofbirth: string
  ticker: string
  nationality: any
  country_code: string
  ethPrice?: number
  matic_price: number
  matic: number
  usd_price: number
  '24h_change': number
  coin_issued: number
  price: number
  playercontractsubscriptionstart: number,
  time: string
  img: string
  playerpicture: string
  playerpicturethumb: string
  playercontract: string
  playerPicture: string
  profileLink: string
  changedPrice: string
  coinIssued: number
  coin_issue: number
  holders: number
  coinholders: number
  detailpageurl: string
  subscriptionstartdate: number
}