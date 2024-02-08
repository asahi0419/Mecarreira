/* eslint-disable @typescript-eslint/no-non-null-assertion */
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { isMobile } from '@utils/helpers'
import Logo from '@assets/images/logo-min.webp'
import Spinner from '@components/Spinner'
import { useParams } from 'react-router-dom'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { useTranslation } from 'react-i18next'

const FactSheetDownload: React.FC = () => {
  const { fileName } = useParams()
  const [downloaded, setDownloaded] = useState(false)
  const { t } = useTranslation()
  useEffect(() => {
    console.log('param', fileName)
    // Download the document when the component mounts
    const downloadDocument = async () => {
      // Replace 'YOUR_DOCUMENT_URL' with the actual URL of your document file.
      const documentUrl = `${process.env.REACT_APP_HOST_URL}/meCarreira_backend/media/files/${fileName}`
      const response = await fetch(documentUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      // Create a temporary anchor element and trigger the download
      const link = document.createElement('a')
      link.href = url
      link.download = `${fileName}` // You can set the desired file name here.
      link.click()

      // Mark the document as downloaded
      setDownloaded(true)
    }

    downloadDocument()
  }, [])

  return (
    <div className="main_content_wrapper">
      <div
        className={classNames(
          'main_content',
          isMobile() ? 'main_content_mobile' : 'main_content_desktop',
        )}
      >
        <div>
          <img src={Logo} style={{ width: '120px' }} alt="" />
        </div>
        {downloaded ? (
          <>
            <div className="access_denied_heading">
              {t('download completed')}
            </div>
            <div>
              <CheckCircleOutlineIcon
                style={{ color: '#6bc909', fontSize: '60px' }}
              />
            </div>
          </>
        ) : (
          <>
            <div className="access_denied_heading">{t('downloading')}...</div>
            <div style={{ marginTop: '-40px' }}>
              <Spinner spinnerStatus={true} title={''} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default FactSheetDownload
