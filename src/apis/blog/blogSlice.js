/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoadingBlogs: true,
  isGetBlogsError: '',
  isGetBlogsSuccess: false,
  blogsData: [],
  isLoadingBlog: true,
  isGetBlogError: '',
  isGetBlogSuccess: false,
  blogData: null,
}

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    getBlogs(state, action) {
      state.isLoadingBlogs = true
      state.isGetBlogsSuccess = false
      state.isGetBlogsError = ''
      state.blogsData = []
    },
    getBlogsSuccess(state, action) {
      state.isLoadingBlogs = false
      state.isGetBlogsSuccess = true
      state.blogsData = action.payload?.data?.posts
    },
    getBlogsFailure(state, action) {
      state.isLoadingBlogs = false
      state.isGetBlogsError = 'Error'
      if (
        action.payload.response.status === '403' ||
        action.payload.response.status === 403
      ) {
        state.isGetBlogsError = ''
      }
    },
    getBlog(state, action) {
      state.isLoadingBlog = true
      state.isGetBlogSuccess = false
      state.isGetBlogError = ''
      state.blogData = null
    },
    getBlogSuccess(state, action) {
      state.isLoadingBlog = false
      state.isGetBlogSuccess = true
      state.blogData = action.payload?.data?.post
    },
    getBlogFailure(state, action) {
      state.isLoadingBlog = false
      state.isGetBlogError = 'Error'
      if (
        action.payload.response.status === '403' ||
        action.payload.response.status === 403
      ) {
        state.isGetBlogError = ''
      }
    },
  },
})

export const {
  getBlogs,
  getBlogsSuccess,
  getBlogsFailure,
  getBlog,
  getBlogSuccess,
  getBlogFailure,
} = blogSlice.actions
export default blogSlice.reducer
