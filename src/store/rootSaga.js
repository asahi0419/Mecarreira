import { all } from 'redux-saga/effects'
import PurchaseSaga from '@root/apis/purchase/purchaseApi'
import AuthenticationSaga from '@root/apis/onboarding/authenticationApi'
import walletSaga from '@root/apis/wallet/walletApi'
import PlayerCoinsSaga from '@root/apis/playerCoins/playerCoinsApi'
import PlayerStatsSaga from '@root/apis/playerStats/playerStatsApi'
import CareerSaga from '@root/apis/careers/careersApi'
import NotificationSaga from '@root/apis/notification/notificationApi'
import GallerySaga from '@root/apis/gallery/galleryApi'
import BlogSaga from '@root/apis/blog/blogApi'

// Here you can include all the saga which you write for components

export default function* rootSaga() {
  // yield all([PurchaseSaga()])
  yield all([
    AuthenticationSaga(),
    PlayerCoinsSaga(),
    PlayerStatsSaga(),
    CareerSaga(),
    PurchaseSaga(),
    NotificationSaga(),
    GallerySaga(),
    BlogSaga(),
  ])
  // yield all([PlayerCoinsSaga()])
  yield all([walletSaga()])
}
