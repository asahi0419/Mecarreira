import { THEME_COLORS } from '@root/constants'
import { RootState } from '@root/store/rootReducers'
import { useSelector } from 'react-redux'

interface Props {
  onClick?: () => any
  isPlayerCard?: boolean
}
const ArrowUpFilled: React.FC<Props> = ({ onClick, isPlayerCard = false }) => {
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { selectedThemeRedux } = authenticationData
  return (
    <svg
      width="15px"
      height="12px"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      className="arrow-down"
      onClick={onClick}
    >
      <path
        fill={
          THEME_COLORS['Default']['Profit']
          // isPlayerCard
          //   ? THEME_COLORS['Default']['Profit']
          //   : THEME_COLORS[selectedThemeRedux]['PrimaryForeground']
        }
        d="M3 19h18a1.002 1.002 0 0 0 .823-1.569l-9-13c-.373-.539-1.271-.539-1.645 0l-9 13A.999.999 0 0 0 3 19z"
      />
    </svg>
  )
}

export default ArrowUpFilled
