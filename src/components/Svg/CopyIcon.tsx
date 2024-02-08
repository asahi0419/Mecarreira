import { THEME_COLORS } from '@root/constants'
import { RootState } from '@root/store/rootReducers'
import { useSelector } from 'react-redux'

interface Props {
  onClick?: () => any
  onMouseLeave?: () => any
  width?: string
  height?: string
}
const CopyIcon: React.FC<Props> = ({
  onClick,
  onMouseLeave,
  width,
  height,
}) => {
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { selectedThemeRedux } = authenticationData
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      style={{ width, height, cursor: 'pointer' }}
    >
      <path
        onClick={onClick}
        onMouseLeave={onMouseLeave}
        fill={THEME_COLORS[selectedThemeRedux]['PrimaryForeground']}
        d="M224 0c-35.3 0-64 28.7-64 64V288c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H224zM64 160c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H288c35.3 0 64-28.7 64-64V384H288v64H64V224h64V160H64z"
      />
    </svg>
  )
}

export default CopyIcon
