import { THEME_COLORS } from '@root/constants'
import { RootState } from '@root/store/rootReducers'
import { useSelector } from 'react-redux'

interface Props {
  onClick?: () => any
  customFill?: string
}
const ArrowUp: React.FC<Props> = ({ onClick, customFill = null }) => {
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { selectedThemeRedux } = authenticationData
  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 330 330"
      width="15px"
      height="9px"
      xmlSpace="preserve"
      onClick={onClick}
      className="flip arrow-up"
    >
      <path
        fill={
          customFill || THEME_COLORS[selectedThemeRedux]['PrimaryForeground']
        }
        id="XMLID_225_"
        d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393
        c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393
        s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
      />
    </svg>
  )
}

export default ArrowUp
