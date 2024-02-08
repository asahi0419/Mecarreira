import { THEME_COLORS } from '@root/constants'
import { RootState } from '@root/store/rootReducers'
import * as React from 'react'
import Switch from 'react-ios-switch'
import { useSelector } from 'react-redux'

export default function ToggleSwitch(props: any) {
  const { onToggle, isCheckedSetting, isDisabled = false } = props
  const [isChecked, setChecked] = React.useState(isCheckedSetting)
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { selectedThemeRedux } = authenticationData

  const onChange = (checked: boolean) => {
    setChecked(checked)
    onToggle(checked)
  }
  return (
    <Switch
      checked={isChecked}
      offColor="#56596A"
      onColor={THEME_COLORS[selectedThemeRedux]['PrimaryForeground']}
      onChange={onChange}
      disabled={isDisabled}
    />
  )
}
