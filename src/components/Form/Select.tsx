import React, { useEffect } from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import '@assets/css/components/Select.css'
import { ThemeProvider, createTheme } from '@mui/material/styles'
interface option {
  id: number | string
  name: string
}
interface Props {
  data?: option[]
  disabled?: boolean
  opacityDisable?: boolean
  fieldName?: string
  onChange?: any
  handleBlur?: any
  title: string
  defaultValue?: string
  countryCode?: string
  onSetValue?: any
}

const SelectBox: React.FC<Props> = ({
  data = [],
  disabled = false,
  fieldName = undefined,
  onChange = null,
  handleBlur = null,
  title,
  defaultValue = '',
  countryCode = '',
  onSetValue,
  opacityDisable = false,
}) => {
  const [value, setValue] = React.useState('')

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    onChange(event)
    setValue(event.target.value as string)
  }

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue)
    }
  }, [defaultValue])

  useEffect(() => {
    if (countryCode) {
      onSetValue && onSetValue(countryCode)
      setValue(countryCode)
    }
  }, [countryCode])

  const theme = createTheme({
    components: {
      MuiList: {
        styleOverrides: {
          root: {
            backgroundColor: 'red',
          },
        },
      },
    },
  })

  return (
    <FormControl style={opacityDisable ? { opacity: '0.4' } : {}}>
      {!value && <p className="select-placeholder">{title}</p>}
      <ThemeProvider theme={theme}>
        <Select
          name={fieldName}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
        >
          {data.map((item: any) => (
            <MenuItem key={item.iso2 || item.id} value={item.iso2 || item.id}>
              {item.countryname || item.name}
            </MenuItem>
          ))}
        </Select>
      </ThemeProvider>
    </FormControl>
  )
}

export default SelectBox
