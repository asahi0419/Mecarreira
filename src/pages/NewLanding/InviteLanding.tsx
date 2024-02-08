import React, { useEffect } from 'react'
import Landing from '../NewLanding/index'

interface Props {
  mode?: number
}

const InviteLanding: React.FC<Props> = props => {
  useEffect(() => {
    if (window.location.pathname.includes('invite')) {
      const inviteId = window.location?.pathname?.split('/')?.pop()
      if (
        inviteId.length === 8 &&
        localStorage.getItem('invite_code') !== inviteId
      ) {
        localStorage.setItem('invite_code', inviteId)
      }
    }
  }, [])
  return (
    <>
      <Landing />
    </>
  )
}

export default InviteLanding
