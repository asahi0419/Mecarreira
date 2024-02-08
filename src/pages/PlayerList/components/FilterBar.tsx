/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import classNames from 'classnames'
import FilterListIcon from '@mui/icons-material/FilterList'
import '@assets/css/components/SearchBarPlayerList.css'
import { useTranslation } from 'react-i18next'
import { displayDate, getCountryId } from '@utils/helpers'
import classnames from 'classnames'
// mui
import Stack from '@mui/material/Stack'
import Checkbox from '@mui/material/Checkbox'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { Dayjs } from 'dayjs'
import TextField from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import Dialog from '@mui/material/Dialog'
import '@assets/css/components/FilterModal.css'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import toast from 'react-hot-toast'
import HotToaster from '@components/HotToaster'
import CountrySelect from '@components/CountryDropdown'

const label = { inputProps: { 'aria-label': 'Checkbox demo' } }

const makeDateForApi = (originDate: Dayjs): string => {
  const d = new Date(originDate.toDate().toString())
  const month =
    d.getMonth() < 9 ? '0' + (d?.getMonth() + 1).toString() : d?.getMonth() + 1
  const date =
    d.getDate() < 10 ? '0' + d.getDate().toString() : d.getDate().toString()

  return d?.getFullYear() + '-' + month + '-' + date
}

const statusLabels = ['', '', 'bronze', 'silver', 'gold', 'diamond']

type CloseFunction = (_v: boolean | undefined) => void
type handleFilterFunction = (_v: any | undefined) => void
interface Props {
  isFilterDisabled?: boolean | null
  containerClass?: string
  onClose: CloseFunction
  activeTab?: string
  playerLevelId?: number
  handleFilter: handleFilterFunction
}
const FilterBar: React.FC<Props> = ({
  isFilterDisabled,
  containerClass = '',
  onClose,
  activeTab = '',
  playerLevelId,
  handleFilter,
}) => {
  const { t } = useTranslation()
  const [isOpenFilterModal, setIsOpenFilterModal] = useState(false)

  // fillter
  const [countryName, setCountryName] = useState<any>()
  const [fromDate, setFromDate] = useState<Dayjs | null>(null)
  const [toDate, setToDate] = useState<Dayjs | null>(null)
  const [status, setStatus] = useState(0)
  // chechbox
  const [checkCountry, setCheckCountry] = useState<boolean>(false)
  const [checkStatus, setCheckStatus] = useState<boolean>(false)
  const [checkDate, setCheckDate] = useState<boolean>(false)
  // click close filter item event
  const [clickCloseEvent, setClickCloseEvent] = useState<boolean>(false)

  const handleClose = () => {
    onClose(true)
  }

  useEffect(() => {
    if (playerLevelId) {
      setTimeout(() => {
        setStatus(playerLevelId)
        setCheckStatus(true)
      }, 500)
    }
  }, [playerLevelId])

  useEffect(() => {
    if (activeTab) {
      handleClose()
    }
  }, [activeTab])

  const openFilterModal = () => {
    setIsOpenFilterModal(true)
  }

  const closeFilterModal = () => {
    if (checkCountry && !countryName?.code) {
      setCheckCountry(false)
    }
    if (checkDate && !(fromDate || toDate)) {
      setCheckDate(false)
    }
    if (checkStatus && !status) {
      setCheckStatus(false)
    }
    resetFilter()
    setIsOpenFilterModal(false)
  }

  const resetFilter = () => {
    // reset states
    setFromDate(null)
    setToDate(null)
    setStatus(0)
    setCountryName(null)
    setCheckCountry(false)
    setCheckDate(false)
    setCheckStatus(false)
  }

  useEffect(() => {
    if (countryName) {
      setCheckCountry(true)
    } else {
      setCheckCountry(false)
    }
  }, [countryName])

  useEffect(() => {
    if (fromDate || toDate) {
      setCheckDate(true)
    } else {
      setCheckDate(false)
    }
  }, [fromDate, toDate])

  const handleChangeStatus = (event: SelectChangeEvent) => {
    setStatus(Number(event.target.value))
    if (Number(event.target.value) === 0) {
      setCheckStatus(false)
    } else {
      setCheckStatus(true)
    }
  }

  useEffect(() => {
    if (!checkCountry) {
      setCountryName(null)
    }
    if (!checkDate) {
      setFromDate(null)
      setToDate(null)
    }
    if (!checkStatus) {
      setStatus(0)
    }
  }, [checkCountry, checkDate, checkStatus])

  const confirmFilter = () => {
    const tempStatus: number[] = []

    if (!(checkCountry || checkDate || checkStatus)) {
      setIsOpenFilterModal(false)
      onClose(true)
      return
    }
    if (checkCountry && !countryName?.code) {
      toast.error(t('select country'))
      return
    }
    if (checkDate && !(fromDate || toDate)) {
      toast.error(t('select date'))
      return
    }
    if (checkStatus && !status) {
      toast.error(t('select player level'))
      return
    }
    if (checkDate && fromDate && toDate) {
      const d1 = new Date(fromDate?.toDate().toString())
      const d2 = new Date(toDate?.toDate().toString())
      if (d1.getTime() > d2.getTime()) {
        toast.error(t('the from date must'))
        return
      }
    }

    tempStatus.push(status)
    const filterValue: any = {
      country_id: checkCountry ? getCountryId(countryName?.code) : null,
      player_level: checkStatus && status ? tempStatus : null,
      date_min: checkDate && fromDate ? makeDateForApi(fromDate) : null,
      date_max: checkDate && toDate ? makeDateForApi(toDate) : null,
    }
    setIsOpenFilterModal(false)
    handleFilter(filterValue)
  }

  useEffect(() => {
    clickCloseEvent && confirmFilter()

    return () => {
      setClickCloseEvent(false)
    }
  }, [clickCloseEvent])

  return (
    <div className={classNames('search-bar-player-list', containerClass)}>
      <HotToaster />
      {(checkCountry || checkDate || checkStatus) && (
        <div className="search-filter-show">
          <div className="search-filter-show">
            {checkCountry && countryName && countryName.code && (
              <div className="search-filter-show-item">
                <div>{countryName?.label && countryName?.label}</div>
                <IconButton
                  aria-label="delete"
                  onClick={() => {
                    setCheckCountry(false)
                    setClickCloseEvent(true)
                  }}
                >
                  <CloseIcon
                    sx={{ color: 'var(--primary-foreground-color)' }}
                  />
                </IconButton>
              </div>
            )}
            {checkStatus && status ? (
              <div className="search-filter-show-item">
                <div>{t(statusLabels[status])}</div>
                <IconButton
                  aria-label="delete"
                  onClick={() => {
                    setCheckStatus(false)
                    setClickCloseEvent(true)
                  }}
                >
                  <CloseIcon
                    sx={{ color: 'var(--primary-foreground-color)' }}
                  />
                </IconButton>
              </div>
            ) : null}
            {checkDate && fromDate && (
              <div className="search-filter-show-item">
                <div>
                  <span style={{ color: '#abacb5' }}>From : </span>
                  {displayDate(fromDate?.toDate().toString())}
                </div>
                <IconButton
                  aria-label="delete"
                  onClick={() => {
                    setFromDate(null)
                    !toDate && setCheckDate(false)
                    setClickCloseEvent(true)
                  }}
                >
                  <CloseIcon
                    sx={{ color: 'var(--primary-foreground-color)' }}
                  />
                </IconButton>
              </div>
            )}
            {checkDate && toDate && (
              <div className="search-filter-show-item">
                <div>
                  <span style={{ color: '#abacb5' }}>To : </span>
                  {displayDate(toDate?.toDate().toString())}
                </div>
                <IconButton
                  aria-label="delete"
                  onClick={() => {
                    setToDate(null)
                    !fromDate && setCheckDate(false)
                    setClickCloseEvent(true)
                  }}
                >
                  <CloseIcon
                    sx={{ color: 'var(--primary-foreground-color)' }}
                  />
                </IconButton>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="search-filter-section justify-end">
        {!isFilterDisabled && (
          <FilterListIcon
            sx={{
              color:
                checkStatus || checkDate || checkCountry
                  ? 'var(--primary-foreground-color)'
                  : '',
            }}
            className="filter-icon"
            onClick={openFilterModal}
          />
        )}
      </div>
      <Dialog
        open={isOpenFilterModal}
        onClose={closeFilterModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          backdropFilter: 'blur(10px)',
        }}
        fullWidth={true}
        maxWidth={'md'}
        className="filter-modal"
      >
        <button className={classnames('filter-close')}>
          <span onClick={closeFilterModal}>&times;</span>
        </button>
        <div className="filter-modal-body" style={{ position: 'relative' }}>
          <Stack direction="column" gap={5} alignItems="flex-start">
            <Stack
              direction="row"
              alignItems={'center'}
              justifyContent={'flex-start'}
              className="status-section"
              gap={10}
            >
              <Stack direction={'row'} gap={2} alignItems={'center'}>
                <Checkbox
                  {...label}
                  sx={{
                    color: 'var(--primary-foreground-color)',
                    '&.Mui-checked': {
                      color: 'var(--primary-foreground-color)',
                    },
                  }}
                  checked={checkCountry}
                  onChange={e => setCheckCountry(e.target.checked)}
                />
                <div className="filter-label-color">{t('country: ')}</div>
              </Stack>

              <CountrySelect
                countryName={countryName}
                setCountry={setCountryName}
              />
            </Stack>
            <Stack
              direction="row"
              alignItems={'center'}
              justifyContent={'flex-start'}
              className="status-section"
              gap={4.2}
            >
              <Stack direction={'row'} gap={2} alignItems={'center'}>
                <Checkbox
                  {...label}
                  sx={{
                    color: 'var(--primary-foreground-color)',
                    '&.Mui-checked': {
                      color: 'var(--primary-foreground-color)',
                    },
                  }}
                  checked={checkStatus}
                  onChange={e => setCheckStatus(e.target.checked)}
                />
                <div className="filter-label-color">{t('player level: ')}</div>
              </Stack>

              <Select
                value={status.toString()}
                onChange={handleChangeStatus}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                sx={{
                  color: 'var(--primary-foreground-color)',
                  width: '200px',
                  '&:before': {
                    borderColor: 'orange',
                  },
                  '&:after': {
                    borderColor: 'green',
                  },
                }}
                style={{
                  color: 'white !important',
                  fontWeight: 'bold !important',
                }}
              >
                <MenuItem value={0}>{t('choose a level')}</MenuItem>
                <MenuItem value={2}>{t('bronze')}</MenuItem>
                <MenuItem value={3}>{t('silver')}</MenuItem>
                <MenuItem value={4}>{t('gold')}</MenuItem>
                <MenuItem value={5}>{t('diamond')}</MenuItem>
              </Select>
            </Stack>
            <Stack
              direction="row"
              alignItems={'center'}
              justifyContent={'flex-start'}
              gap={3}
              className="status-section"
            >
              <Stack direction={'row'} gap={2} alignItems={'center'}>
                <Checkbox
                  {...label}
                  sx={{
                    color: 'var(--primary-foreground-color)',
                    '&.Mui-checked': {
                      color: 'var(--primary-foreground-color)',
                    },
                  }}
                  checked={checkDate}
                  onChange={e => setCheckDate(e.target.checked)}
                />
                <div className="filter-label-color">{t('launched date: ')}</div>
              </Stack>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="From"
                  value={fromDate}
                  onChange={(newValue: any) => {
                    setFromDate(newValue)
                  }}
                  renderInput={(params: any) => <TextField {...params} />}
                  className="fieldset"
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="To"
                  value={toDate}
                  onChange={(newValue: any) => {
                    setToDate(newValue)
                  }}
                  renderInput={(params: any) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Stack>
            <Stack
              direction={'row'}
              alignItems={'center'}
              justifyContent={'flex-end'}
              sx={{ width: '100%' }}
              className="status-section button-row"
            >
              <Stack direction={'row'} alignItems={'center'} gap={3}>
                <div
                  className="form-submit-btn btn-disabled btn-flex"
                  onClick={resetFilter}
                >
                  {t('clear')}
                </div>
                <div
                  className="form-submit-btn btn-flex"
                  onClick={confirmFilter}
                >
                  {t('apply')}
                </div>
              </Stack>
            </Stack>
          </Stack>
        </div>
      </Dialog>
    </div>
  )
}

export default FilterBar
