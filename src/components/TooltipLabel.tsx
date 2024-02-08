/* eslint-disable no-unused-vars */
import React from 'react'
import Tooltip from '@mui/material/Tooltip'
import { makeStyles } from '@material-ui/core/styles'

interface Props {
  title: string
  children?: any //React.ReactNode|undefined
  openTooltip?: any
}

const useStyles = makeStyles(() => ({
  customTooltip: {
    // I used the rgba color for the standard "secondary" color
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  customArrow: {
    color: 'rgba(0, 0, 0, 0.8)',
  },
}))

const TooltipLabel: React.FC<Props> = ({
  title,
  children,
  openTooltip = false,
}) => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(openTooltip)

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }
  return (
    <Tooltip
      title={title}
      placement="top"
      arrow
      classes={{
        tooltip: classes.customTooltip,
        arrow: classes.customArrow,
      }}
      // open={open || openTooltip}
      open={open}
      onClose={handleClose}
      onOpen={handleOpen}
    >
      {children}
    </Tooltip>
  )
}

export default TooltipLabel
