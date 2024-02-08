/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { all, call, put, takeLatest } from 'redux-saga/effects'
import {
  fetchGalleryData,
  fetchGalleryDataSuccess,
  fetchGalleryDataFailure,
  fetchNFTData,
  fetchNFTDataSuccess,
  fetchNFTDataFailure,
  fetchMintedNFTList,
  fetchMintedNFTListSuccess,
  fetchMintedNFTListFailure,
  createTrait,
  createTraitSuccess,
  createTraitFailure,
  deleteTrait,
  deleteTraitSuccess,
  deleteTraitFailure,
  updateTrait,
  updateTraitSuccess,
  updateTraitFailure,
  uploadNFT,
  uploadNFTSuccess,
  uploadNFTFailure,
  updateNFT,
  updateNFTSuccess,
  updateNFTFailure,
  updateNftStatus,
  updateNftStatusSuccess,
  updateNftStatusFailure,
  deleteNFT,
  deleteNFTSuccess,
  deleteNFTFailure,
  fetchGenesisNFTData,
  fetchGenesisNFTDataFailure,
  fetchGenesisNFTDataSuccess,
} from './gallerySlice'
import {
  getRequestAuth,
  postRequestAuth,
  putRequestAuth,
  deleteRequestAuth,
} from '../axiosClientAuth'
import { API_CONSTANTS as constants } from '@root/constants'
import axios from 'axios'
import { makeGetRequest, makeGetRequestAdvance } from '../axiosClient'

function* fetchGalleryDataAPI(action) {
  let response
  try {
    response = yield call(() =>
      makeGetRequestAdvance('players/gallery/?' + action.payload),
    )
    yield put(fetchGalleryDataSuccess(response.data))
  } catch (error) {
    yield put(fetchGalleryDataFailure(error))
  }
}

function* fetchNFTDataAPI(action) {
  try {
    const url = new URL(constants.HOST_URL + '/players/upload-NFT/')
    const searchParams = url.searchParams
    const accessToken = localStorage.getItem('accessToken')
    const paramSet = Object.keys(action.payload)
    for (let i = 0; i < paramSet.length; i++) {
      searchParams.set(paramSet[i], action.payload[paramSet[i]])
    }
    const response = yield call(() =>
      // axios.get(url.toString(), {
      //   withCredentials: true,
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      // }),
      makeGetRequestAdvance(url.toString()),
    )
    yield put(fetchNFTDataSuccess(response.data))
  } catch (error) {
    console.log({ error })
    yield put(fetchNFTDataFailure(error))
  }
}

function* fetchGenesisNFTDataAPI(action) {
  try {
    const url = new URL(constants.HOST_URL + '/accounts/genesis_nft_detail/')
    const searchParams = url.searchParams
    const accessToken = localStorage.getItem('accessToken')
    const paramSet = Object.keys(action.payload)
    for (let i = 0; i < paramSet.length; i++) {
      searchParams.set(paramSet[i], action.payload[paramSet[i]])
    }
    const response = yield call(() =>
      // axios.get(url.toString(), {
      //   withCredentials: true,
      // }),
      makeGetRequestAdvance(url.toString()),
    )
    yield put(fetchGenesisNFTDataSuccess(response.data))
  } catch (error) {
    console.log({ error })
    yield put(fetchGenesisNFTDataFailure(error))
  }
}

function* fetchMintedNFTListAPI() {
  let response
  try {
    response = yield call(() =>
      makeGetRequestAdvance('players/player_minted_nfts'),
    )
    yield put(fetchMintedNFTListSuccess(response.data))
  } catch (error) {
    yield put(fetchMintedNFTListFailure(error))
  }
}

function* createTraitAPI(action) {
  let response
  try {
    response = yield call(() =>
      postRequestAuth('players/upload-traits/', action.payload),
    )
    yield put(createTraitSuccess(response.data))
  } catch (error) {
    yield put(createTraitFailure(error))
  }
}

function* deleteTraitAPI(action) {
  let response
  try {
    response = yield call(() =>
      deleteRequestAuth('players/upload-traits/', action.payload),
    )
    yield put(deleteTraitSuccess(response.data))
  } catch (error) {
    yield put(deleteTraitFailure(error))
  }
}

function* updateTraitAPI(action) {
  let response
  try {
    response = yield call(() =>
      putRequestAuth('players/upload-traits/', action.payload),
    )
    yield put(updateTraitSuccess(response.data))
  } catch (error) {
    yield put(updateTraitFailure(error))
  }
}

function* uploadNFTAPI(action) {
  let response
  try {
    response = yield call(() =>
      putRequestAuth('players/upload-NFT/', action.payload),
    )
    yield put(uploadNFTSuccess(response.data))
  } catch (error) {
    yield put(uploadNFTFailure(error))
  }
}

function* updateNFTAPI(action) {
  let response
  try {
    response = yield call(() =>
      postRequestAuth('players/upload-NFT/', action.payload),
    )
    yield put(updateNFTSuccess(response.data))
  } catch (error) {
    yield put(updateNFTFailure(error))
  }
}

function* updateNftStatusAPI(action) {
  let response
  try {
    response = yield call(() =>
      putRequestAuth('players/nftstatus/', action.payload),
    )
    yield put(updateNftStatusSuccess(response.data))
  } catch (error) {
    yield put(updateNftStatusFailure(error))
  }
}

function* deleteNFTAPI(action) {
  let response
  try {
    response = yield call(() =>
      makeGetRequestAdvance('players/delete-nft/?id=' + action.payload),
    )
    yield put(deleteNFTSuccess(response.data))
  } catch (error) {
    yield put(deleteNFTFailure(error))
  }
}

export default function* rootSaga() {
  yield all([takeLatest(fetchGalleryData, fetchGalleryDataAPI)])
  yield all([takeLatest(fetchNFTData, fetchNFTDataAPI)])
  yield all([takeLatest(fetchGenesisNFTData, fetchGenesisNFTDataAPI)])
  yield all([takeLatest(fetchMintedNFTList, fetchMintedNFTListAPI)])
  yield all([takeLatest(createTrait, createTraitAPI)])
  yield all([takeLatest(deleteTrait, deleteTraitAPI)])
  yield all([takeLatest(updateTrait, updateTraitAPI)])
  yield all([takeLatest(uploadNFT, uploadNFTAPI)])
  yield all([takeLatest(updateNFT, updateNFTAPI)])
  yield all([takeLatest(updateNftStatus, updateNftStatusAPI)])
  yield all([takeLatest(deleteNFT, deleteNFTAPI)])
}
