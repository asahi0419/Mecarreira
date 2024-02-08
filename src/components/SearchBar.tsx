import { useState, useEffect } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import classNames from 'classnames'
import FilterListIcon from '@mui/icons-material/FilterList'
import SearchInput from '@components/Form/SearchInput'
import { Switch } from '@components/Form'
import '@assets/css/components/SearchBar.css'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  getEANftsBalance,
  getNftsBalance,
  toggleStakingCoins,
} from '@root/apis/playerCoins/playerCoinsSlice'
import { RootState } from '@root/store/rootReducers'
import { setSearchFieldRedux } from '@root/apis/playerCoins/playerCoinsSlice'

interface Props {
  isSwitchEnabled?: boolean | null
  isFilterDisabled?: boolean | null
  onEdit: any
  mode: string
  containerClass?: string
  onClose: any
  activeTab?: string
  onSearchEnabled?: any
}
const SearchBar: React.FC<Props> = ({
  isSwitchEnabled,
  onEdit,
  mode = '',
  isFilterDisabled,
  containerClass = '',
  onClose,
  activeTab = '',
  onSearchEnabled,
}) => {
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const { isStakingOnlySelected } = playerCoinData
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [isSearchEnabled, setSearchEnabled] = useState(false)

  const handleClose = () => {
    dispatch(setSearchFieldRedux({ searchField: false }))
    setSearchEnabled(false)
    onSearchEnabled && onSearchEnabled(false)
    onClose(true)
  }
  useEffect(() => {
    dispatch(setSearchFieldRedux({ searchField: false }))
  }, [])
  useEffect(() => {
    if (activeTab) {
      handleClose()
    }
  }, [activeTab])
  const handleSearch = () => {
    dispatch(setSearchFieldRedux({ searchField: true }))
    setSearchEnabled(true)
    onSearchEnabled && onSearchEnabled(true)
  }
  const currentURL = window.location.href
  const includesGenesis = currentURL.includes('/genesis')
  const handleToggleSwitch = (checked: boolean) => {
    console.log({ checked, mode })
    if (includesGenesis) {
      checked = true
    }
    if (mode === 'wallet') {
      dispatch(toggleStakingCoins(checked))
    } else if (mode === 'wallet_nft') {
      dispatch(toggleStakingCoins(checked))
      //COMMENTED_AS_ALEX_ASKED_FOR_GENESIS_DEFAULT_OPEN https://app.clickup.com/t/85zu0djh4
      // if (checked) {
      //   dispatch(getEANftsBalance(''))
      // } else {
      //   dispatch(getNftsBalance(''))
      // }
      return
    }
  }

  const configureSwitchTitle = () => {
    if (mode === 'wallet_nft') {
      return t('Genesis Only')
    } else {
      return t('staked tokens')
    }
  }

  return (
    <div className={classNames('search-bar', containerClass)}>
      {isSwitchEnabled && !isSearchEnabled ? (
        <Switch
          // label={t('staked tokens')}
          label={configureSwitchTitle()}
          onSwitch={handleToggleSwitch}
          isChecked={mode === 'wallet_nft' ? true : isStakingOnlySelected}
        />
      ) : (
        <div></div>
      )}
      <div
        className={classNames(
          'search-filter-section',
          !isSearchEnabled ? 'justify-end' : '',
        )}
      >
        {isSearchEnabled ? (
          <SearchInput
            type="text"
            placeholder={t('please enter the search words.')}
            className="in-menu-search"
            onChange={onEdit}
            onClose={handleClose}
          />
        ) : (
          <SearchIcon className="icon-color" onClick={handleSearch} />
        )}
        {!isFilterDisabled && <FilterListIcon className="filter-icon" />}
      </div>
    </div>
  )
}

export default SearchBar
