import { THEME_COLORS } from '@root/constants'

interface Props {
  onClick?: () => any
  isPlayerCard?: boolean
}
const ArrowDownFilled: React.FC<Props> = ({ onClick }) => {
  return (
    <svg
      width="15px"
      height="9px"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      className="arrow-down"
      onClick={onClick}
    >
      <path
        fill={THEME_COLORS['Default']['Loss']}
        d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569l9 13z"
      />
    </svg>
  )
}

export default ArrowDownFilled
