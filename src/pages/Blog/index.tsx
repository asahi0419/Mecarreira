/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect } from 'react'
import { AppLayout } from '@components/index'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { RootState } from '@root/store/rootReducers'
import '@assets/css/pages/Blog.css'
import { useTranslation } from 'react-i18next'
import NewsImg from '@root/assets/images/blog/news.png'
import HowToImg from '@root/assets/images/blog/how_to.png'
import MediaImg from '@root/assets/images/blog/media.png'
import AboutUsImg from '@root/assets/images/blog/about_us.png'
import BlogCard from '@components/Card/BlogCard'
import { blogCategories } from '@root/constants'
import { getBlogs } from '@root/apis/blog/blogSlice'
import Spinner from '@components/Spinner'
import TagManager from 'react-gtm-module'
import { tagManagerArgs } from '@root/constants'
import { initTagManager } from '@utils/helpers'
import { selectedTheme } from '@root/apis/onboarding/authenticationSlice'

const Blog: React.FC = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  const searchParams = new URLSearchParams(location.search)
  const category = searchParams.get('category')
  const { blogsData, isLoadingBlogs } = useSelector(
    (state: RootState) => state.blog,
  )

  useEffect(() => {
    // TagManager.initialize(tagManagerArgs)
    initTagManager()
    document.querySelector('title')!.innerText = 'Blogs of meCarreira'
    window.scrollTo({ top: 0, behavior: 'smooth' })
    ;['Light', 'Dark', 'Gold', 'Ladies', 'Black'].forEach(theme =>
      document.body.classList.remove(theme),
    )
    dispatch(
      selectedTheme({
        selectedThemeRedux: 'Dark',
      }),
    )
  }, [])

  useEffect(() => {
    dispatch(getBlogs(category ?? 'All'))
  }, [category])

  return (
    <AppLayout headerClass="home" footerStatus="footer-status">
      <div className="blog-container">
        <div className="blog-box">
          <div className="blog-nav-content">
            <div className="blog-nav-group">
              <div
                className={
                  category === null ? 'blog-nav-item clicked' : 'blog-nav-item'
                }
                onClick={() => navigate('/blog')}
              >
                {t('all')}
              </div>
              {blogCategories.map((blogcategory, index) => (
                <div
                  className={
                    category === blogcategory
                      ? 'blog-nav-item clicked'
                      : 'blog-nav-item'
                  }
                  onClick={() => navigate(`/blog?category=${blogcategory}`)}
                  key={index}
                >
                  <img
                    alt="blog-nav-item-img"
                    src={
                      blogcategory === 'news'
                        ? NewsImg
                        : blogcategory === 'how-to'
                        ? HowToImg
                        : blogcategory === 'media'
                        ? MediaImg
                        : AboutUsImg
                    }
                  ></img>
                  <span>{t(blogcategory)}</span>
                </div>
              ))}
            </div>
          </div>
          {isLoadingBlogs ? (
            <div className="blog-card-content">
              <Spinner title={''} spinnerStatus={true} />
            </div>
          ) : (
            <div className="blog-card-content">
              {blogsData.length === 0 ? (
                <div className="blog-card-content-notfound gold-color">
                  {t('no articles found')}
                </div>
              ) : (
                blogsData.map((blogData, index) => (
                  <BlogCard
                    className={
                      window.innerWidth > 800 && index % 7 === 0
                        ? 'full-width'
                        : ''
                    }
                    title={blogData.title}
                    updatedAt={blogData.updatedAt}
                    src={blogData.featuredImage}
                    slug={blogData.slug}
                    summary={blogData.summary}
                    key={index}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}

export default Blog
