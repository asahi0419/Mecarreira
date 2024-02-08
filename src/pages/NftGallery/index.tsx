import { useEffect } from 'react'
import { AppLayout } from '@components/index'
import NftGalleryForm from './NftGalleryForm'

const NftGallery: React.FC = () => {
  useEffect(() => {
    window.history.replaceState(null, 'Buy', '/')
  }, [])

  return (
    <AppLayout
      headerClass="home"
      footerStatus="footer-status"
      noPageFooter={true}
    >
      <NftGalleryForm />
    </AppLayout>
  )
}

export default NftGallery
