import { THEME_COLORS } from '@root/constants'
import { RootState } from '@root/store/rootReducers'
import { useSelector } from 'react-redux'

interface Props {
  onClick?: () => any
  width?: string
  height?: string
}
const ReturnIcon: React.FC<Props> = ({ onClick, width, height }) => {
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { selectedThemeRedux } = authenticationData
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      style={{ width, height, cursor: 'pointer' }}
      onClick={onClick}
      fill={THEME_COLORS[selectedThemeRedux]['PrimaryForeground']}
    >
      <path
        fill-rule="evenodd"
        d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z"
      />
    </svg>
  )
}

export default ReturnIcon
