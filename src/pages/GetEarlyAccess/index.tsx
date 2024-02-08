/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import { AppLayout } from '@components/index'
import { useTranslation } from 'react-i18next'

const GetEarlyAccess: React.FC = () => {
  const { t } = useTranslation()
  return (
    <AppLayout headerStatus="header-status" headerClass="home">
      <div
        className="get-ealry-access-container"
        style={{ height: 'calc(100vh - 240px)' }}
      >
        <div className="heading-title unverified-alert m-auto">
          {t('not ready yet')}
        </div>
      </div>
    </AppLayout>
  )
}

export default GetEarlyAccess
