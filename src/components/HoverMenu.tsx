import React from 'react'
import { Menu, MenuItem } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import MoreVertIcon from '@mui/icons-material/MoreVert'

interface Props {
  className?: string
  options: string[]
  isDisabled: boolean
  onItemPress: any
}

const HoverMenu: React.FC<Props> = props => {
  const { options, onItemPress, isDisabled } = props
  return (
    <Menu
      id="hover-modal-menu"
      menuButton={<MoreVertIcon id="more-icon" />}
      transition
    >
      {options.map((item: any, index: number) => (
        <MenuItem
          key={index}
          id="hover-modal-menuitem"
          disabled={isDisabled}
          onClick={() => onItemPress(item)}
        >
          {item}
        </MenuItem>
      ))}
    </Menu>
  )
}

export default HoverMenu
