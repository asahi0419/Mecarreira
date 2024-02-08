import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoading: false,
  isGetNotificationsError: '',
  isGetNotificationsSuccess: '',
  notificationsList: [],
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    getNotifications(state) {
      state.isLoading = true
      state.isGetNotificationsError = ''
      state.notificationsList = []
    },
    getNotificationsSuccess(state, action) {
      state.isLoading = false
      state.isGetNotificationsSuccess = action.payload.message
      state.notificationsList = action.payload.data.notifications
    },
    getNotificationsFailure(state, action) {
      state.isLoading = false
      state.isGetNotificationsError = action.payload.response.data.detail
    },
  },
})

export const {
  getNotifications,
  getNotificationsSuccess,
  getNotificationsFailure,
} = notificationSlice.actions
export default notificationSlice.reducer
