/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useRef } from 'react'
import { AppLayout } from '@components/index'
import { useParams } from 'react-router-dom'
import WestIcon from '@mui/icons-material/West'
import { RootState } from '@root/store/rootReducers'
import '@assets/css/pages/Blog.css'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Spinner from '@components/Spinner'
import { getBlog } from '@root/apis/blog/blogSlice'

const BlogDetail: React.FC = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const ref = useRef<HTMLDivElement>(null)

  const { blogData, isGetBlogSuccess } = useSelector(
    (state: RootState) => state.blog,
  )

  useEffect(() => {
    dispatch(getBlog(slug))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (ref.current && isGetBlogSuccess) {
      ref.current.innerHTML = blogData.content
      document.querySelector('title')!.innerText = blogData.title
      document
        .querySelector("meta[name='description']")!
        .setAttribute('content', blogData.summary)
    }
  }, [isGetBlogSuccess])

  return (
    <>
      <AppLayout headerClass="home" footerStatus="footer-status">
        <div className="blog-container">
          {isGetBlogSuccess ? (
            <div className="blogdetail-main-content">
              <div
                className="blogdetail-back-btn"
                onClick={() => navigate('/blog')}
              >
                <WestIcon />
                {t('back to blog')}
              </div>
              <div className="blogdetail-wrapper">
                <div className="blogdetail-image">
                  <img
                    src={
                      !blogData.featuredImage
                        ? 'https://cdn.dropinblog.com/34246531/files/featured/meCarreira_1400x800.png'
                        : blogData.featuredImage
                    }
                    alt="blogdetail"
                  ></img>
                </div>
                <div className="blogdetail-text-container">
                  <div className="blogdetail-title">{blogData.title}</div>
                  <div className="blogdetail-desc">{blogData.summary}</div>
                  <div
                    className="blogdetail-category"
                    onClick={() =>
                      navigate(`/blog?category=${blogData.categories[0].slug}`)
                    }
                  >
                    {blogData.categories[0].title}
                  </div>
                  <div className="blogdetail-update-time">
                    {blogData.updatedAt} &nbsp; {blogData.readtime}
                  </div>
                  <div className="blogdetail-text" ref={ref} />
                </div>
              </div>
              <div
                className="blogdetail-back-btn"
                onClick={() => navigate('/blog')}
              >
                <WestIcon />
                {t('back to blog')}
              </div>
            </div>
          ) : (
            <div className="blogdetail-main-content flex-center">
              <Spinner title={''} spinnerStatus={true} />
            </div>
          )}
        </div>
      </AppLayout>
    </>
  )
}

export default BlogDetail
