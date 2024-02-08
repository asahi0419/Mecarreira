import { RootState } from '@root/store/rootReducers'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import classnames from 'classnames'
import SubmitButton from '@components/Button/SubmitButton'
import {
  getSelectedPlayer,
  savePlayerCustomisation,
  savePlayerCustomisationInit,
  savePlayercardjson,
} from '@root/apis/playerCoins/playerCoinsSlice'
import { togglePayForItem } from '@root/apis/onboarding/authenticationSlice'
import toast from 'react-hot-toast'
import HotToaster from '@components/HotToaster'
import DialogBox from '@components/Dialog/DialogBox'
import { Grid } from '@mui/material'
import '@assets/css/components/MyCard.css'
import BaseCard from '@components/Card/BaseCard'
import ArrowDown from '@components/Svg/ArrowDown'
import ArrowUp from '@components/Svg/ArrowUp'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import LockIcon from '@mui/icons-material/Lock'
import maticIcon from '@assets/images/matic-token-icon.webp'
import { getPlayerLevelName, isMobile } from '@utils/helpers'
import ImageComponent from '@components/ImageComponent'

const MyCard = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const playerCoinData: any = useSelector(
    (state: RootState) => state.playercoins,
  )

  const colors = [
    'green',
    'purple',
    'gold',
    'silver',
    'red',
    'blue',
    'turquoise',
    'orange',
  ]

  const neonColors = [
    'NeonGreen',
    'NeonPurple',
    'NeonGold',
    'NeonSilver',
    'NeonRed',
    'NeonBlue',
    'NeonTurquoise',
    'NeonOrange',
    'Flame',
    'Angle',
  ]

  const {
    isLoadingPlayerCustomisation,
    isSavePlayerCustomisationSuccess,
    isSavePlayerCustomisationError,
    selectedPlayer,
    playercardjson,
    userPayedItemsData,
    getItemPriceData,
  } = playerCoinData

  const [cardColor, setCardColor] = useState(
    playercardjson?.border_color ??
      selectedPlayer.playercardjson?.border_color ??
      'default',
  )
  const [avatarColor, setAvatarColor] = useState(
    playercardjson?.avatar_color ??
      selectedPlayer.playercardjson?.avatar_color ??
      'default',
  )
  const [givenameColor, setGivennameColor] = useState(
    playercardjson?.givenname_color ??
      selectedPlayer.playercardjson?.givenname_color ??
      'gold',
  )
  const [surnameColor, setSurNameColor] = useState(
    playercardjson?.surname_color ??
      selectedPlayer.playercardjson?.surname_color ??
      'green',
  )
  const [bottomDecorColor, setBottomDecorColor] = useState(
    playercardjson?.bottom_decor_color ??
      selectedPlayer.playercardjson?.bottom_decor_color ??
      'green',
  )

  const [isImageDialogVisible, setIsImageDialogVisible] = useState(false)
  const [imageIndex, setImageIndex] = useState(
    playercardjson?.background_image ??
      selectedPlayer.playercardjson?.background_image ??
      0,
  )
  const [testStat, setTestStat] = useState<any>([])
  const playerRef = useRef<any>([])
  const playerStatsData = useSelector((state: RootState) => state.playerstats)
  const { fetchPlayerStatsDataPL, fetchPlayerStatsDataNL } = playerStatsData

  useEffect(() => {
    playerRef.current = testStat
  }, [testStat])

  useEffect(() => {
    if (fetchPlayerStatsDataNL.length > 0) {
      setTestStat(fetchPlayerStatsDataNL)
    }
  }, [fetchPlayerStatsDataNL])

  useEffect(() => {
    if (isSavePlayerCustomisationSuccess) {
      toast.success(t('successfully saved'))
      dispatch(getSelectedPlayer(selectedPlayer.playercontract))
    }
    if (isSavePlayerCustomisationError) {
      toast.error(t('unknown exception'))
    }
    dispatch(savePlayerCustomisationInit())
  }, [isSavePlayerCustomisationSuccess, isSavePlayerCustomisationError])

  const getClassName = (event: any) => {
    const statIndex = fetchPlayerStatsDataPL?.findIndex((item: any) => {
      return (
        selectedPlayer?.playercontract?.toLocaleLowerCase() ===
        item?.player?.toLowerCase()
      )
    })
    if (statIndex > -1) {
      return `${event}`
    } else {
      return `${event}`
    }
  }

  const handleSave = () => {
    dispatch(
      savePlayerCustomisation({
        playercontract: selectedPlayer?.playercontract,
        json_data: {
          givenname_color: givenameColor,
          surname_color: surnameColor,
          border_color: cardColor,
          border_stroke: false,
          avatar_color: avatarColor,
          bottom_decor_color: bottomDecorColor,
          background_image: imageIndex,
        },
      }),
    )
    dispatch(
      savePlayercardjson({
        givenname_color: givenameColor,
        surname_color: surnameColor,
        border_color: cardColor,
        border_stroke: false,
        avatar_color: avatarColor,
        bottom_decor_color: bottomDecorColor,
        background_image: imageIndex,
      }),
    )
  }

  const handleChoose = index => {
    setImageIndex(index)
    setIsImageDialogVisible(false)
  }

  const [selected, setSelected] = useState(1)

  const handleToggle = (i: number) => {
    if (selected === i) {
      return setSelected(0)
    }
    setSelected(i)
  }

  const handlePurchaseItem = (attribute, value) => {
    const name = `${attribute}:${value}`
    let price = 1
    if (getItemPriceData) {
      for (let i = 0; i < getItemPriceData.length; i++) {
        if (getItemPriceData[i]?.id === name) {
          price = getItemPriceData[i]?.pricematic
        }
      }
    }
    dispatch(togglePayForItem({ visible: true, price, name }))
  }

  const getLockCardName = color => {
    if (color === 'Flame') {
      return 'flame'
    } else if (color === 'Angle') {
      return 'angle'
    } else {
      return 'neon'
    }
  }

  const getColorByLevel = level => {
    if (level === 'Diamond') {
      return 'purple'
    } else if (level === 'Gold') {
      return 'gold'
    } else if (level === 'Silver') {
      return 'silver'
    } else if (level === 'Bronze') {
      return 'orange'
    }
    return 'default'
  }

  const checkAvailableItem = (type, item) => {
    if (type === 'cardBG') {
      return selectedPlayer?.playerlevelid === item + 1
    } else {
      return (
        getColorByLevel(getPlayerLevelName(selectedPlayer?.playerlevelid)) ===
        item
      )
    }
  }

  return (
    <div className="my-card-container">
      <HotToaster />
      <DialogBox
        isOpen={isImageDialogVisible}
        onClose={() => setIsImageDialogVisible(false)}
        parentClass={isMobile() ? 'flex-dialog' : ''}
      >
        <div className="blog-title new-launches-title h-2">
          {t('choose background image')}
        </div>
        <div className="nft-gallery-grid">
          <Grid container>
            {Array.from({ length: 14 }, (_, k) => k + 1).map((_, index) =>
              userPayedItemsData.filter(
                payItem => payItem?.item === `cardBG:${index}`,
              ).length > 0 || checkAvailableItem('cardBG', index) ? (
                <Grid
                  item
                  md={6}
                  xs={6}
                  className={
                    index % 2 === 0
                      ? 'nft-gallery-leftline'
                      : 'nft-gallery-rightline'
                  }
                  key={index}
                >
                  <div
                    className="nft-gallery-card"
                    onClick={() => handleChoose(index)}
                  >
                    <img
                      className={classnames(
                        'nft-gallery-img',
                        'background' + index,
                      )}
                    />
                    <div
                      className="nft-gallery-lanchbtn"
                      onClick={() => handleChoose(index)}
                    >
                      {t('choose')}
                    </div>
                  </div>
                </Grid>
              ) : (
                <Grid
                  item
                  md={6}
                  xs={6}
                  className={
                    index % 2 === 0
                      ? 'nft-gallery-leftline'
                      : 'nft-gallery-rightline'
                  }
                  key={index}
                >
                  <div className="nft-gallery-card">
                    <div
                      className="lock-box"
                      onClick={() => handlePurchaseItem('cardBG', index)}
                    >
                      <div className="lock-card">
                        <img
                          className={classnames(
                            'nft-gallery-img',
                            'background' + index,
                          )}
                        />
                        <LockIcon className="lock-icon" />
                      </div>
                      <div className="lock-box-bottom">
                        <div className="matic-price-wrapper">
                          <ImageComponent src={maticIcon} alt="" />
                          <p>
                            {getItemPriceData.filter(
                              payItem => payItem?.id === `cardBG:${index}`,
                            )[0]?.pricematic ?? '1.00'}
                          </p>
                        </div>
                        <ShoppingCartIcon />
                      </div>
                    </div>
                  </div>
                </Grid>
              ),
            )}
            {['Sparks'].map((color, index) =>
              userPayedItemsData.filter(
                payItem => payItem?.item === `cardBG:${color}`,
              ).length > 0 ? (
                <Grid
                  item
                  md={6}
                  xs={6}
                  className={
                    index % 2 === 0
                      ? 'nft-gallery-leftline'
                      : 'nft-gallery-rightline'
                  }
                  key={index}
                >
                  <div
                    className="nft-gallery-card"
                    onClick={() => handleChoose(color)}
                  >
                    <img
                      className={classnames(
                        'nft-gallery-img',
                        'background-sparks',
                      )}
                    />
                    <div
                      className="nft-gallery-lanchbtn"
                      onClick={() => handleChoose(color)}
                    >
                      {t('choose')}
                    </div>
                  </div>
                </Grid>
              ) : (
                <Grid
                  item
                  md={6}
                  xs={6}
                  key={index}
                  className={
                    index % 2 === 0
                      ? 'nft-gallery-leftline'
                      : 'nft-gallery-rightline'
                  }
                >
                  <div className="nft-gallery-card">
                    <div
                      className="lock-box"
                      onClick={() => handlePurchaseItem('cardBG', color)}
                    >
                      <div className="lock-card">
                        <img
                          className={classnames(
                            'nft-gallery-img',
                            'background-sparks',
                          )}
                        />
                        <LockIcon className="lock-icon" />
                      </div>
                      <div className="lock-box-bottom">
                        <div className="matic-price-wrapper">
                          <ImageComponent src={maticIcon} alt="" />
                          <p>
                            {getItemPriceData.filter(
                              payItem => payItem?.id === `cardBG:${color}`,
                            )[0]?.pricematic ?? '1.00'}
                          </p>
                        </div>
                        <ShoppingCartIcon />
                      </div>
                    </div>
                  </div>
                </Grid>
              ),
            )}
          </Grid>
        </div>
      </DialogBox>
      <BaseCard
        card={selectedPlayer}
        playercardjson={{
          givenname_color: givenameColor,
          surname_color: surnameColor,
          border_color: cardColor,
          border_stroke: false,
          avatar_color: avatarColor,
          bottom_decor_color: bottomDecorColor,
          background_image: imageIndex,
        }}
        prevData={playerRef}
        onBuy={() => console.log('')}
        onSell={() => console.log('')}
        getClassName={getClassName}
        navigation={false}
        isDesignMode={true}
      />
      <div className="setting-container">
        <div className="accordion">
          <div className="item">
            <div className="title" onClick={() => handleToggle(1)}>
              <h2>{t('first name')}</h2>
              {selected === 1 ? <ArrowUp /> : <ArrowDown />}
            </div>
            <div className={selected === 1 ? 'content show' : 'content'}>
              <div className="setting-colors">
                {colors.map((color, colIndex) =>
                  userPayedItemsData.filter(
                    payItem => payItem?.item === `cardGivenName:${color}`,
                  ).length > 0 || checkAvailableItem('cardGivenName', color) ? (
                    <div
                      className={classnames(
                        `lock-card`,
                        givenameColor === color ? 'active' : 'inactive',
                      )}
                      key={colIndex}
                      onClick={() => setGivennameColor(color)}
                    >
                      <p className={color}>{color}</p>
                    </div>
                  ) : (
                    <div
                      key={colIndex}
                      className={classnames(
                        `lock-box`,
                        givenameColor === color ? 'active' : 'inactive',
                      )}
                      onClick={() => handlePurchaseItem('cardGivenName', color)}
                    >
                      <div className="lock-card">
                        <p className={color}>{color}</p>
                        <LockIcon className="lock-icon" />
                      </div>
                      <div className="lock-box-bottom">
                        <div className="matic-price-wrapper">
                          <ImageComponent src={maticIcon} alt="" />
                          <p>
                            {getItemPriceData.filter(
                              payItem =>
                                payItem?.id === `cardGivenName:${color}`,
                            )[0]?.pricematic ?? '1.00'}
                          </p>
                        </div>
                        <ShoppingCartIcon />
                      </div>
                    </div>
                  ),
                )}
                {neonColors.map((color, neonColIndex) =>
                  userPayedItemsData.filter(
                    payItem => payItem?.item === `cardGivenName:${color}`,
                  ).length > 0 ? (
                    <div
                      className={classnames(
                        `lock-card`,
                        givenameColor === color ? 'active' : 'inactive',
                      )}
                      key={neonColIndex}
                      onClick={() => setGivennameColor(color)}
                    >
                      <p className={color}>{t(getLockCardName(color))}</p>
                    </div>
                  ) : (
                    <div
                      key={neonColIndex}
                      className={classnames(
                        `lock-box`,
                        givenameColor === color ? 'active' : 'inactive',
                      )}
                      onClick={() => handlePurchaseItem('cardGivenName', color)}
                    >
                      <div className="lock-card">
                        <p className={color}>{t(getLockCardName(color))}</p>
                        <LockIcon className="lock-icon neon" />
                      </div>
                      <div className="lock-box-bottom">
                        <div className="matic-price-wrapper">
                          <ImageComponent src={maticIcon} alt="" />
                          <p>
                            {getItemPriceData.filter(
                              payItem =>
                                payItem?.id === `cardGivenName:${color}`,
                            )[0]?.pricematic ?? '1.00'}
                          </p>
                        </div>
                        <ShoppingCartIcon />
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
          <div className="item">
            <div className="title" onClick={() => handleToggle(2)}>
              <h2>{t('family name')}</h2>
              {selected === 2 ? <ArrowUp /> : <ArrowDown />}
            </div>
            <div className={selected === 2 ? 'content show' : 'content'}>
              <div className="setting-colors">
                {colors.map((color, settingIndex) =>
                  userPayedItemsData.filter(
                    payItem => payItem?.item === `cardSurName:${color}`,
                  ).length > 0 || checkAvailableItem('cardSurName', color) ? (
                    <div
                      key={settingIndex}
                      className={classnames(
                        `lock-card`,
                        surnameColor === color ? 'active' : 'inactive',
                      )}
                      onClick={() => setSurNameColor(color)}
                    >
                      <p className={color}>{color}</p>
                    </div>
                  ) : (
                    <div
                      key={settingIndex}
                      className={classnames(
                        `lock-box`,
                        surnameColor === color ? 'active' : 'inactive',
                      )}
                      onClick={() => handlePurchaseItem('cardSurName', color)}
                    >
                      <div className="lock-card">
                        <p className={color}>{color}</p>
                        <LockIcon className="lock-icon" />
                      </div>
                      <div className="lock-box-bottom">
                        <div className="matic-price-wrapper">
                          <ImageComponent src={maticIcon} alt="" />
                          <p>
                            {getItemPriceData.filter(
                              payItem => payItem?.id === `cardSurName:${color}`,
                            )[0]?.pricematic ?? '1.00'}
                          </p>
                        </div>
                        <ShoppingCartIcon />
                      </div>
                    </div>
                  ),
                )}
                {neonColors.map((color, neonIndex) =>
                  userPayedItemsData.filter(
                    payItem => payItem?.item === `cardSurName:${color}`,
                  ).length > 0 ? (
                    <div
                      key={neonIndex}
                      className={classnames(
                        `lock-card`,
                        givenameColor === color ? 'active' : 'inactive',
                      )}
                      onClick={() => setSurNameColor(color)}
                    >
                      <p className={color}>{t(getLockCardName(color))}</p>
                    </div>
                  ) : (
                    <div
                      key={neonIndex}
                      className={classnames(
                        `lock-box`,
                        givenameColor === color ? 'active' : 'inactive',
                      )}
                      onClick={() => handlePurchaseItem('cardSurName', color)}
                    >
                      <div className="lock-card">
                        <p className={color}>{t(getLockCardName(color))}</p>
                        <LockIcon className="lock-icon neon" />
                      </div>
                      <div className="lock-box-bottom">
                        <div className="matic-price-wrapper">
                          <ImageComponent src={maticIcon} alt="" />
                          <p>
                            {getItemPriceData.filter(
                              payItem => payItem?.id === `cardSurName:${color}`,
                            )[0]?.pricematic ?? '1.00'}
                          </p>
                        </div>
                        <ShoppingCartIcon />
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          <div className="item">
            <div className="title" onClick={() => handleToggle(3)}>
              <h2>{t('background')}</h2>
              {selected === 3 ? <ArrowUp /> : <ArrowDown />}
            </div>
            <div className={selected === 3 ? 'content show' : 'content'}>
              <div className="setting-colors">
                <button
                  className="image-button"
                  onClick={() => setIsImageDialogVisible(true)}
                >
                  {Number.isInteger(imageIndex)
                    ? 'background' + (parseInt(imageIndex) + 1) + '.webp'
                    : imageIndex}
                </button>
              </div>
            </div>
          </div>
          <div className="item">
            <div className="title" onClick={() => handleToggle(4)}>
              <h2>{t('card border')}</h2>
              {selected === 4 ? <ArrowUp /> : <ArrowDown />}
            </div>
            <div className={selected === 4 ? 'content show' : 'content'}>
              <div className="setting-colors">
                <div
                  className={classnames(
                    `lock-card`,
                    'grey-color-box',
                    cardColor === 'default' ? 'active' : 'inactive',
                  )}
                  onClick={() => setCardColor('default')}
                ></div>
                {colors.map((color, settingColIndex) =>
                  userPayedItemsData.filter(
                    payItem => payItem?.item === `cardColor:${color}`,
                  ).length > 0 || checkAvailableItem('cardColor', color) ? (
                    <div
                      key={settingColIndex}
                      className={classnames(
                        `lock-card`,
                        `${color}-color-box`,
                        cardColor === color ? 'active' : 'inactive',
                      )}
                      onClick={() => setCardColor(color)}
                    ></div>
                  ) : (
                    <div
                      key={settingColIndex}
                      className={classnames(
                        `lock-box`,
                        `${color}-color-box`,
                        cardColor === color ? 'active' : 'inactive',
                      )}
                      onClick={() => handlePurchaseItem('cardColor', color)}
                    >
                      <div className="lock-card">
                        <LockIcon className="lock-icon" />
                      </div>
                      <div className="lock-box-bottom">
                        <div className="matic-price-wrapper">
                          <ImageComponent src={maticIcon} alt="" />
                          <p>
                            {getItemPriceData.filter(
                              payItem => payItem?.id === `cardColor:${color}`,
                            )[0]?.pricematic ?? '1.00'}
                          </p>
                        </div>
                        <ShoppingCartIcon />
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
          <div className="item">
            <div className="title" onClick={() => handleToggle(5)}>
              <h2>{t('avatar')}</h2>
              {selected === 5 ? <ArrowUp /> : <ArrowDown />}
            </div>
            <div className={selected === 5 ? 'content show' : 'content'}>
              <div className="setting-colors">
                <div
                  className={classnames(
                    `lock-card`,
                    'grey-color-box',
                    avatarColor === 'default' ? 'active' : 'inactive',
                  )}
                  onClick={() => setAvatarColor('default')}
                ></div>
                {colors.map((color, colOneIndex) =>
                  userPayedItemsData.filter(
                    payItem => payItem?.item === `avatarColor:${color}`,
                  ).length > 0 || checkAvailableItem('avatarColor', color) ? (
                    <div
                      key={colOneIndex}
                      className={classnames(
                        `lock-card`,
                        `${color}-color-box`,
                        avatarColor === color ? 'active' : 'inactive',
                      )}
                      onClick={() => setAvatarColor(color)}
                    ></div>
                  ) : (
                    <div
                      key={colOneIndex}
                      className={classnames(
                        `lock-box`,
                        `${color}-color-box`,
                        avatarColor === color ? 'active' : 'inactive',
                      )}
                      onClick={() => handlePurchaseItem('avatarColor', color)}
                    >
                      <div className="lock-card">
                        <LockIcon className="lock-icon" />
                      </div>
                      <div className="lock-box-bottom">
                        <div className="matic-price-wrapper">
                          <ImageComponent src={maticIcon} alt="" />
                          <p>
                            {getItemPriceData.filter(
                              payItem => payItem?.id === `avatarColor:${color}`,
                            )[0]?.pricematic ?? '1.00'}
                          </p>
                        </div>
                        <ShoppingCartIcon />
                      </div>
                    </div>
                  ),
                )}
                <div style={{ width: '50%' }} />
                {[
                  'Fire',
                  'FirePurple',
                  'FireGold',
                  'FireSilver',
                  'FireRed',
                  'FireBlue',
                  'FireTurquoise',
                  'FireOrange',
                ].map((color, fireIndex) =>
                  userPayedItemsData.filter(
                    payItem => payItem?.item === `cardRing:${color}`,
                  ).length > 0 ? (
                    <div
                      key={fireIndex}
                      className={classnames(
                        `lock-card`,
                        color,
                        avatarColor === color ? 'active' : 'inactive',
                      )}
                      onClick={() => setAvatarColor(color)}
                    >
                      <div className="circle"></div>
                    </div>
                  ) : (
                    <div
                      key={fireIndex}
                      className={classnames(
                        `lock-box`,
                        avatarColor === color ? 'active' : 'inactive',
                      )}
                      onClick={() => handlePurchaseItem('cardRing', color)}
                    >
                      <div className={classnames(`lock-card`, color)}>
                        <div className="circle"></div>
                        <LockIcon className="lock-icon" />
                      </div>
                      <div className="lock-box-bottom">
                        <div className="matic-price-wrapper">
                          <ImageComponent src={maticIcon} alt="" />
                          {getItemPriceData.filter(
                            payItem => payItem?.id === `cardRing:${color}`,
                          )[0]?.pricematic ?? '1.00'}
                        </div>
                        <ShoppingCartIcon />
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
          <div className="item">
            <div className="title" onClick={() => handleToggle(6)}>
              <h2>{t('bottom')}</h2>
              {selected === 6 ? <ArrowUp /> : <ArrowDown />}
            </div>
            <div className={selected === 6 ? 'content show' : 'content'}>
              <div className="setting-colors">
                {colors.map((color, colTwoIndex) =>
                  userPayedItemsData.filter(
                    payItem => payItem?.item === `bottomDecorColor:${color}`,
                  ).length > 0 ||
                  checkAvailableItem('bottomDecorColor', color) ? (
                    <div
                      key={colTwoIndex}
                      className={classnames(
                        `lock-card`,
                        `${color}-color-box`,
                        bottomDecorColor === color ? 'active' : 'inactive',
                      )}
                      onClick={() => setBottomDecorColor(color)}
                    ></div>
                  ) : (
                    <div
                      key={colTwoIndex}
                      className={classnames(
                        `lock-box`,
                        `${color}-color-box`,
                        bottomDecorColor === color ? 'active' : 'inactive',
                      )}
                      onClick={() =>
                        handlePurchaseItem('bottomDecorColor', color)
                      }
                    >
                      <div className="lock-card">
                        <LockIcon className="lock-icon" />
                      </div>
                      <div className="lock-box-bottom">
                        <div className="matic-price-wrapper">
                          <ImageComponent src={maticIcon} alt="" />
                          <p>
                            {getItemPriceData.filter(
                              payItem =>
                                payItem?.id === `bottomDecorColor:${color}`,
                            )[0]?.pricematic ?? '1.00'}
                          </p>
                        </div>
                        <ShoppingCartIcon />
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="setting-row">
          <SubmitButton
            isLoading={isLoadingPlayerCustomisation}
            isDisabled={false}
            title={t('save')}
            onPress={handleSave}
          />
        </div>
      </div>
    </div>
  )
}

export default MyCard
