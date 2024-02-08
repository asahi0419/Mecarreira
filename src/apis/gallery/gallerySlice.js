/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'
import {
  checkForAuthNotProvided,
  checkForStatusZero,
  checkInviteNotLinked,
} from '@utils/helpers'

const initialState = {
  isLoading: false,
  isGalleryLoading: false,
  isGalleryLoadingEnded: false,
  isUpdateNftStatus: false,
  tokenExpired: false,
  galleryData: [],
  isFetchGalleryDataError: '',
  nftData: null,
  winChances: [],
  traitsData: [],
  isFetchNFTDataSuccess: false,
  isFetchGenesisNFTData: null,
  isFetchGenesisNFTDataSuccess: false,
  isFetchGenesisNFTDataError: null,
  isFetchNFTDataError: '',
  mintedNFTList: [],
  isFetchMintedNFTListError: '',
  isCreateTraitSuccess: false,
  isCreateTraitFailure: '',
  isDeleteTraitSuccess: false,
  isDeleteTraitFailure: '',
  isUpdateTraitSuccess: false,
  isUpdateTraitFailure: '',
  isUploadNFTSuccess: false,
  isUploadNFTFailure: '',
  isUpdateNFTSuccess: false,
  isUpdateNFTFailure: '',
  isUpdateNftStatusSuccess: false,
  isUpdateNftStatusFailure: '',
  isGalleryFormVisible: false,
  isGalleryDetailVisible: false,
  isGalleryOffset: 0,
}

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    resetGalleryData(state) {
      state.galleryData = []
    },
    fetchGalleryData(state, action) {
      state.isGalleryLoading = true
      state.isFetchGalleryDataError = ''
      state.isGalleryLoadingEnded = false
      state.isDeleteNFTSuccess = false
      state.isDeleteNFTFailure = false
      const urlParams = new URLSearchParams(action.payload)
      state.isGalleryOffset = urlParams.get('offset') ?? 0
    },
    fetchGalleryDataSuccess(state, action) {
      state.isGalleryLoading = false
      if (action.payload.data.length === 0) {
        state.isGalleryLoadingEnded = true
      } else {
        if (state.isGalleryOffset === 0) {
          state.galleryData = action.payload.data
        } else {
          state.galleryData = [...state.galleryData, ...action.payload.data]
        }
      }
    },
    fetchGalleryDataFailure(state, action) {
      state.isGalleryLoading = false
      state.isFetchGalleryDataError = action.payload.response.data.detail
      if (
        action.payload.response.status === '403' ||
        action.payload.response.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    fetchNFTData(state, action) {
      state.isLoading = true
      state.isFetchNFTDataError = ''
      state.isFetchNFTDataSuccess = false
      state.nftData = null
    },
    fetchNFTDataSuccess(state, action) {
      state.isLoading = false
      state.isFetchNFTDataSuccess = true
      state.nftData = action.payload.data
      state.winChances = action.payload.win_chance
      state.traitsData = action.payload.data.trait
    },
    fetchNFTDataFailure(state, action) {
      state.isLoading = false
      state.isFetchNFTDataError = action.payload.response.data.detail
      if (
        action.payload.response.status === '403' ||
        action.payload.response.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    resetNftData(state) {
      state.nftData = null
    },
    fetchGenesisNFTData(state, action) {
      state.isLoading = true
      state.isFetchGenesisNFTDataSuccess = false
      state.isFetchGenesisNFTDataError = null
      state.isFetchGenesisNFTData = null
      state.nftData = null
    },
    fetchGenesisNFTDataSuccess(state, action) {
      state.isLoading = false
      state.isFetchGenesisNFTDataSuccess = true
      state.isFetchGenesisNFTData = action.payload.data
      state.isFetchGenesisNFTDataError = null
    },
    fetchGenesisNFTDataFailure(state, action) {
      console.log({ action })
      state.isLoading = false
      state.isFetchGenesisNFTDataSuccess = false
      state.isFetchGenesisNFTData = null
      state.isFetchGenesisNFTDataError = '' //action.payload.response.data.detail
      if (
        action.payload.response.status === '403' ||
        action.payload.response.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    resetGenesisNFTData(state) {
      state.isLoading = false
      state.isFetchGenesisNFTDataSuccess = false
      state.isFetchGenesisNFTDataError = null
      state.isFetchGenesisNFTData = null
      state.nftData = null
    },
    fetchMintedNFTList(state) {
      state.isLoading = true
      state.isFetchMintedNFTListError = ''
      state.mintedNFTList = []
    },
    fetchMintedNFTListSuccess(state, action) {
      state.isLoading = false
      state.mintedNFTList = action.payload.data.player_minted_nfts
    },
    fetchMintedNFTListFailure(state, action) {
      state.isLoading = false
      state.isFetchMintedNFTListError = action.payload.response.data.detail
      if (
        action.payload.response.status === '403' ||
        action.payload.response.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    createTrait(state, action) {
      state.isLoading = true
      state.isCreateTraitSuccess = false
      state.isCreateTraitFailure = ''
    },
    createTraitSuccess(state, action) {
      state.isLoading = false
      state.isCreateTraitSuccess = true
      state.isCreateTraitFailure = ''
      state.traitsData = action.payload.data
    },
    createTraitFailure(state, action) {
      state.isLoading = false
      state.isCreateTraitFailure =
        action.payload.response.data.detail ?? 'unknown'
      if (
        action.payload.response.status === '403' ||
        action.payload.response.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    deleteTrait(state, action) {
      // state.isLoading = true
      state.isDeleteTraitSuccess = false
      state.isDeleteTraitFailure = ''
    },
    deleteTraitSuccess(state, action) {
      // state.isLoading = false
      state.isDeleteTraitSuccess = true
      state.isDeleteTraitFailure = ''
    },
    deleteTraitFailure(state, action) {
      // state.isLoading = false
      state.isDeleteTraitFailure = action.payload.response.data.detail
      if (
        action.payload.response.status === '403' ||
        action.payload.response.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    updateTrait(state, action) {
      state.isLoading = true
      state.isUpdateTraitSuccess = false
      state.isUpdateTraitFailure = ''
    },
    updateTraitSuccess(state, action) {
      state.isLoading = false
      state.isUpdateTraitSuccess = true
      state.isUpdateTraitFailure = ''
      state.traitsData = state.traitsData.map(c =>
        c.id === action.payload.data.id ? action.payload.data : c,
      )
    },
    updateTraitFailure(state, action) {
      state.isLoading = false
      state.isUpdateTraitFailure = action.payload.response.data.detail
      if (
        action.payload.response.status === '403' ||
        action.payload.response.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    uploadNFT(state, action) {
      state.isLoading = true
      state.isUploadNFTSuccess = false
      state.isUploadNFTFailure = ''
    },
    uploadNFTSuccess(state, action) {
      state.isLoading = false
      state.isUploadNFTSuccess = true
      state.isUploadNFTFailure = ''
      state.nftData = action.payload.data
    },
    uploadNFTFailure(state, action) {
      state.isLoading = false
      state.isUploadNFTFailure = action.payload.response.data.detail
      if (
        action.payload.response.status === '403' ||
        action.payload.response.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    updateNFT(state, action) {
      state.isGalleryLoading = true
      state.isUpdateNFTSuccess = false
      state.isUpdateNFTFailure = ''
    },
    updateNFTSuccess(state, action) {
      state.isGalleryLoading = false
      state.isUpdateNFTSuccess = true
      state.isUpdateNFTFailure = ''
      state.nftData = action.payload.data
    },
    updateNFTFailure(state, action) {
      state.isGalleryLoading = false
      state.isUpdateNFTFailure = action.payload.response.data.message
      // if (state.isUpdateNFTFailure.toLowerCase().includes('duplicate entry')) {
      //   state.isUpdateNFTFailure = 'duplicate_entry'
      // } else {
      //   state.isUpdateNFTFailure = 'unknown exception'
      // }
      if (
        action.payload.response.status === '403' ||
        action.payload.response.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    updateNFTInit(state) {
      state.isUpdateNFTSuccess = false
      state.isUpdateNFTFailure = ''
    },
    updateNftStatus(state, action) {
      state.isUpdateNftStatus = true
      state.isUpdateNftStatusSuccess = false
      state.isUpdateNftStatusFailure = ''
    },
    updateNftStatusSuccess(state, action) {
      state.isUpdateNftStatus = false
      state.isUpdateNftStatusSuccess = true
      state.isUpdateNftStatusFailure = ''
    },
    updateNftStatusFailure(state, action) {
      state.isUpdateNftStatus = false
      state.isUpdateNftStatusFailure =
        action.payload.response.data.detail ?? 'unknown'
      if (
        action.payload.response.status === '403' ||
        action.payload.response.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
    showGalleryForm(state, action) {
      state.isGalleryFormVisible = action.payload
    },
    showGalleryDetail(state, action) {
      state.isGalleryDetailVisible = action.payload
    },
    deleteNFT(state, action) {
      state.isLoading = true
      state.isDeleteNFTSuccess = false
      state.isDeleteNFTFailure = false
    },
    deleteNFTSuccess(state, action) {
      state.isLoading = false
      state.isDeleteNFTSuccess = true
    },
    deleteNFTFailure(state, action) {
      state.isLoading = false
      state.isDeleteNFTFailure = true
      if (
        action.payload.response.status === '403' ||
        action.payload.response.status === 403
      ) {
        // if (checkInviteNotLinked(action) && checkForStatusZero(action)) {
        //   state.tokenExpired = true
        // }
        if (checkForAuthNotProvided(action)) {
          state.tokenExpired = true
        }
      }
    },
  },
})

export const {
  resetGalleryData,
  fetchGalleryData,
  fetchGalleryDataSuccess,
  fetchGalleryDataFailure,
  fetchNFTData,
  fetchNFTDataSuccess,
  fetchNFTDataFailure,
  fetchGenesisNFTData,
  fetchGenesisNFTDataSuccess,
  fetchGenesisNFTDataFailure,
  resetGenesisNFTData,
  resetNftData,
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
  updateNFTInit,
  updateNftStatus,
  updateNftStatusSuccess,
  updateNftStatusFailure,
  showGalleryForm,
  showGalleryDetail,
  deleteNFT,
  deleteNFTSuccess,
  deleteNFTFailure,
} = gallerySlice.actions
export default gallerySlice.reducer
