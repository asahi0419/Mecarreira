import { useEffect, useState } from 'react'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import FireIcon from '@assets/images/fire_icon.webp'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import ImageComponent from '@components/ImageComponent'
import { resetSinglePlayersStats } from '@root/apis/playerStats/playerStatsSlice'

interface Props {
  defaultTab?: string
  tabSet: string[]
  tabClassName?: string
  hasFireIcon?: boolean
  showArrow?: boolean
  getSwitchedTab?: any
  inactiveIndices?: number[]
  fullWidth?: boolean
  transformIndices?: number[]
}

const TabGroup: React.FC<Props> = ({
  tabSet,
  defaultTab,
  tabClassName = '',
  hasFireIcon = false,
  showArrow = false,
  getSwitchedTab,
  inactiveIndices = [],
  fullWidth = false,
  transformIndices = [],
}) => {
  const dispatch = useDispatch()
  const [selectedTab, setSelectedTab] = useState(defaultTab)
  const [index, setIndex] = useState(0)
  const { t } = useTranslation()

  const handleTabSelect = async (title: string) => {
    await setSelectedTab(title)
    getSwitchedTab(title)
    // dispatch(resetSinglePlayersStats())
  }

  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const { selectedThemeRedux } = authenticationData

  useEffect(() => {
    setSelectedTab(defaultTab?.toLowerCase())
  }, [defaultTab])

  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [swipped, setSwipped] = useState(false)
  const activeClass = 'tab-active'

  function handleTouchStart(e: any) {
    setTouchStart(e.targetTouches[0].clientX)
  }

  function handleTouchMove(e: any) {
    setTouchEnd(e.targetTouches[0].clientX)
    setSwipped(true)
  }

  function handleTouchEnd() {
    if (!swipped) {
      return
    }
    setSwipped(false)
    if (touchStart - touchEnd < -50) {
      if (index) {
        setIndex(state => state - 1)
      }
    }

    if (touchStart - touchEnd > 50) {
      if (index < tabSet.length - 3) {
        setIndex(state => state + 1)
      }
    }
  }

  return (
    <div
      className={classnames('tabs-container')}
      onTouchStartCapture={handleTouchStart}
      onTouchMoveCapture={handleTouchMove}
      onTouchEndCapture={handleTouchEnd}
    >
      <ArrowBackIosNewIcon
        sx={
          !index || !showArrow
            ? { visibility: 'hidden' }
            : { visibility: 'show' }
        }
        style={{ fontSize: 15 }}
        onClick={() => {
          setIndex(state => state - 1)
        }}
      />
      {tabSet
        .slice(index, showArrow ? index + 3 : index + 10)
        .map((title, i) => (
          <div className={classnames('tab-item', tabClassName)} key={i}>
            <div
              className={classnames(
                selectedTab?.toLowerCase() === title.toLowerCase()
                  ? `tab-item ${
                      selectedThemeRedux !== 'Black' ? activeClass : ''
                    }`
                  : inactiveIndices.length > 0 && inactiveIndices.includes(i)
                  ? 'tab-item disabled'
                  : 'tab-item',
                transformIndices.length > 0 && transformIndices.includes(i)
                  ? 'no-transform'
                  : '',
                tabSet.length === 1 ? 'tab-item-only' : '',
              )}
              onClick={() => handleTabSelect(title)}
            >
              <button
                className={classnames(
                  selectedTab?.toLowerCase() === title.toLowerCase()
                    ? `tab-item ${activeClass}`
                    : inactiveIndices.length > 0 && inactiveIndices.includes(i)
                    ? 'tab-item disabled'
                    : 'tab-item',
                  i === 0 && hasFireIcon && index === 0
                    ? 'mr-10 width-unset'
                    : '',
                  fullWidth ? 'w-320' : '',
                )}
              >
                {t(title)}
              </button>
              {i === 0 && hasFireIcon && index === 0 ? (
                <ImageComponent
                  src={FireIcon}
                  alt=""
                  style={{ width: '20px' }}
                />
              ) : null}
            </div>
          </div>
        ))}
      <ArrowForwardIosIcon
        sx={
          index < tabSet.length - 3 && showArrow
            ? { visibility: 'show' }
            : { visibility: 'hidden' }
        }
        style={{ fontSize: 15 }}
        onClick={() => {
          setIndex(state => state + 1)
        }}
      />
    </div>
  )
}

export default TabGroup
