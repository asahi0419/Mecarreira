import { useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'

export default function useQualificationStatus() {
  const authenticationData: any = useSelector(
    (state: RootState) => state.authentication,
  )
  const {
    QualificationSettingData,
    qualifiedPublicKey,
    qualifiedInviteLinked,
  } = authenticationData

  const isInvitePropmptShown = parseInt(QualificationSettingData) === 1
  let isPageAccessRestricted

  if (parseInt(QualificationSettingData) === 0) {
    isPageAccessRestricted = true
  } else if (parseInt(QualificationSettingData) === 1) {
    if (
      !localStorage.getItem('loginInfo') &&
      !localStorage.getItem('loginId')
    ) {
      isPageAccessRestricted = true
    } else {
      // isPageAccessRestricted = false
      if (!qualifiedInviteLinked) {
        isPageAccessRestricted = true
      } else {
        isPageAccessRestricted = false
      }
    }
  } else if (parseInt(QualificationSettingData) === 2) {
    if (!qualifiedPublicKey) {
      isPageAccessRestricted = true
    } else {
      isPageAccessRestricted = false
    }
  } else if (parseInt(QualificationSettingData) === 3) {
    isPageAccessRestricted = false
  }
  // const isPageAccessRestricted = [0, 1, 2].includes(
  //   parseInt(QualificationSettingData),
  // )
  return [isInvitePropmptShown, isPageAccessRestricted]
}
