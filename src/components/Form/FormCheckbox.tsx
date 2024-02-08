import React, { useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox'
import '@assets/css/components/FormCheckbox.css'
import { useTranslation } from 'react-i18next'

const GreenCheckbox = withStyles({
  root: {
    color: 'var(--primary-foreground-color)',
    '&$checked': {
      color: 'var(--primary-foreground-color)',
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />)
interface FormSelectProps {
  onChange: any
  defaultChecked?: boolean
  notDisabled?: boolean
}

export default function FormCheckbox(props: FormSelectProps) {
  const [state, setState] = React.useState({
    checked: false,
  })
  const { t } = useTranslation()
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked })
    props.onChange(event.target.checked)
  }

  useEffect(() => {
    if (props.defaultChecked) {
      setState({ ...state, checked: props.defaultChecked })
    }
  }, [props.defaultChecked])

  return (
    <FormControlLabel
      control={
        <GreenCheckbox
          checked={state.checked}
          onChange={handleChange}
          name="checked"
        />
      }
      label={t('')}
      disabled={props.notDisabled}
      // disabled={!props.notDisabled && props.defaultChecked}
    />
  )
}
