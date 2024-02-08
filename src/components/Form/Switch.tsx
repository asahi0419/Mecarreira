import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch, { SwitchClassKey, SwitchProps } from '@material-ui/core/Switch'

interface Styles extends Partial<Record<SwitchClassKey, string>> {
  focusVisible?: string
}

interface Props extends SwitchProps {
  classes: Styles
}

const IOSSwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 42,
      height: 26,
      padding: 0,
      margin: theme.spacing(1),
    },
    switchBase: {
      padding: 1,
      '&$checked': {
        transform: 'translateX(16px)',
        color: theme.palette.common.white,
        '& + $track': {
          backgroundColor: 'var(--primary-foreground-color)',
          opacity: 1,
          border: 'none',
        },
      },
      '&$focusVisible $thumb': {
        color: 'var(--primary-foreground-color)',
        border: '6px solid var(--primary-foreground-color)',
      },
    },
    thumb: {
      width: 24,
      height: 24,
    },
    track: {
      borderRadius: 26 / 2,
      border: `1px solid var(--third-background-color)`,
      backgroundColor: 'var(--third-background-color)', //theme.palette.grey[50],
      opacity: 1,
      transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
  }),
)(({ classes, ...props }: Props) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  )
})

interface PropsSwitch {
  label: string
  onSwitch?: any
  isChecked?: boolean
}

const CustomizedSwitches: React.FC<PropsSwitch> = ({
  label,
  onSwitch,
  isChecked = false,
}) => {
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: false,
    checkedC: true,
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked })
    onSwitch(event.target.checked)
  }

  return (
    <FormControlLabel
      style={
        state.checkedB
          ? { color: 'var(--primary-foreground-color)' }
          : { color: '#ABACB5' }
      }
      control={
        <IOSSwitch
          checked={isChecked || state.checkedB}
          onChange={handleChange}
          name="checkedB"
        />
      }
      label={label}
    />
  )
}

export default CustomizedSwitches
