/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from 'react'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import FireIcon from '@assets/images/fire_icon.webp'
import OverviewIcon from '@assets/images/overview_icon.webp'
import NewIcon from '@assets/images/new_icon.webp'
import AllIcon from '@assets/images/all_icon.webp'
import DigitalIcon from '@assets/images/digital.webp'
import PhysicalIcon from '@assets/images/physical.webp'
import New1Icon from '@assets/images/new1.webp'
import { isMobile } from '@utils/helpers'
import { RootState } from '@root/store/rootReducers'
import { useSelector } from 'react-redux'
import SearchInput from '@components/Form/SearchInput'
import SearchIcon from '@mui/icons-material/Search'
import ImageComponent from '@components/ImageComponent'

type EditFunction = (v: string | undefined) => void
type CloseFunction = (v: boolean | undefined) => void
interface Props {
  scrollTo: number
  defaultTab?: string
  tabSet: string[]
  tabClassName?: string
  getSwitchedTab: (tab: string) => void
  inactiveIndices?: number[]
  getScrollIndex?: any
  hotTabClass?: string
  isHot?: boolean
  hasSearchBar?: boolean
  onEdit?: EditFunction
  onClose?: CloseFunction
}

const PlayerListTabGroup: React.FC<Props> = ({
  tabSet,
  isHot = false,
  defaultTab,
  tabClassName = '',
  getSwitchedTab,
  inactiveIndices = [],
  getScrollIndex,
  scrollTo,
  hotTabClass = 'tab-item',
  hasSearchBar,
  onEdit,
  onClose,
}) => {
  const listInnerRef = useRef<any>()
  const [selectedTab, setSelectedTab] = useState(defaultTab)
  const { t } = useTranslation()
  const handleTabSelect = (title: string) => {
    if (title === 'my card') {
      console.log('my card disabled')
    } else {
      setSelectedTab(title)
      getSwitchedTab(title)
    }
  }
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { selectedThemeRedux } = authenticationData
  useEffect(() => {
    setSelectedTab(defaultTab?.toLowerCase())
  }, [defaultTab])

  const [isSearchEnabled, setSearchEnabled] = useState(false)

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollLeft } = listInnerRef.current
      getScrollIndex(scrollLeft)
    }
  }

  useEffect(() => {
    if (scrollTo) {
      listInnerRef?.current?.scrollTo({
        left: scrollTo,
        behavior: 'auto',
      })
    }
  }, [scrollTo])

  const handleClose = () => {
    setSearchEnabled(false)
    onClose && onClose(true)
  }

  const handleSearch = () => {
    setSearchEnabled(true)
  }

  const tabIcon = i => {
    if (tabSet[0] === 'new') {
      return i === 0
        ? New1Icon
        : i === 1
        ? DigitalIcon
        : i === 2
        ? PhysicalIcon
        : AllIcon
    }
    if (tabSet[0] === 'season') {
      return i === 0 ? FireIcon : OverviewIcon
    }
    return i === 0
      ? OverviewIcon
      : i === 1
      ? FireIcon
      : i === 2
      ? NewIcon
      : AllIcon
  }

  return (
    <div
      className={classnames(
        'tabs-container',
        window.innerWidth < 700 ? 'players-list-tab' : '',
      )}
      ref={listInnerRef}
      onScroll={onScroll}
    >
      {isSearchEnabled ? (
        <SearchInput
          type="text"
          placeholder={t('please enter the search words.')}
          className="in-menu-search"
          onChange={e => {
            onEdit && onEdit(e)
          }}
          onClose={handleClose}
        />
      ) : (
        <>
          {hasSearchBar && (
            <SearchIcon
              className="icon-color"
              onClick={handleSearch}
              style={{
                margin: '22px 10px 22px 0',
              }}
            />
          )}
          {tabSet.map((title, i) => (
            <div
              className={classnames(
                'tab-item-test',
                selectedTab === title.toLowerCase()
                  ? 'tab-active'
                  : inactiveIndices.length > 0 && inactiveIndices.includes(i)
                  ? 'disabled'
                  : '',
                tabClassName,
              )}
              key={i}
              onClick={() => handleTabSelect(title)}
            >
              {isHot ? (
                <>
                  <ImageComponent
                    src={tabIcon(i)}
                    alt=""
                    style={{
                      width: '20px',
                      marginRight: '5px',
                    }}
                  />
                  <button
                    className={
                      selectedTab === title.toLowerCase()
                        ? `${hotTabClass}`
                        : inactiveIndices.length > 0 &&
                          inactiveIndices.includes(i)
                        ? `${hotTabClass} disabled`
                        : `${hotTabClass}`
                    }
                    style={{
                      width: '100%',
                    }}
                  >
                    {t(title)}
                  </button>
                </>
              ) : (
                <button
                  className={
                    selectedTab === title.toLowerCase()
                      ? ''
                      : inactiveIndices.length > 0 &&
                        inactiveIndices.includes(i)
                      ? 'disabled'
                      : ''
                  }
                  style={title === 'my card' ? { opacity: '0.5' } : {}}
                >
                  {t(title)}
                </button>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default PlayerListTabGroup
