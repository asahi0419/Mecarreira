import React, { useState } from 'react'
import classnames from 'classnames'
import { useTranslation } from 'react-i18next'
import { RootState } from '@root/store/rootReducers'
import { useSelector } from 'react-redux'
import PlayerIcon from '@assets/icons/icon/players.png'
import CollectiblesIcon from '@assets/icons/icon/collectibles.svg'
import NFTIcon from '@assets/icons/icon/nft.svg'
import ItemsIcon from '@assets/icons/icon/items.svg'
import ScoutsIcon from '@assets/icons/icon/binoculars.svg'
import MyCoinIcon from '@assets/icons/icon/my_coin.svg'
import { isMobile } from '@utils/helpers'
import { Menu, MenuItem } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import SigninInActive from '@assets/icons/icon/wallet.svg'
import SigninIcon from '@assets/icons/icon/signin.svg'
import SigninIconBlack from '@assets/icons/icon/signinblack.svg'
import ImageComponent from '@components/ImageComponent'

interface Props {
  onClickPlayer: any
  onClickMyCoin: any
  onClickNFTs: any
  onClickSignin: any
  onClickItems: any
  onClickScouts: any
  onClickWallet: any
  showMyCoin: boolean
}

const FooterNav: React.FC<Props> = ({
  onClickPlayer,
  onClickMyCoin,
  onClickNFTs,
  onClickSignin,
  onClickItems,
  onClickScouts,
  onClickWallet,
  showMyCoin,
}) => {
  const { t } = useTranslation()
  const [isHovered, setIsHovered] = useState('')
  const handleMouseHover = (value: boolean) => (evt: any) => {
    if (value) {
      setIsHovered(evt.target.id)
    } else {
      setIsHovered('')
    }
  }

  const loginInfo = localStorage.getItem('loginInfo')
  const loginId = localStorage.getItem('loginId')
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )

  const { selectedThemeRedux } = authenticationData

  const onItemPress = val => {
    if (val === 'nfts') {
      onClickNFTs()
    } else if (val === 'items') {
      onClickItems()
    } else if (val === 'scouts') {
      onClickScouts()
    }
  }

  return (
    <div className="footer-item-box">
      {showMyCoin && (Boolean(loginInfo) || Boolean(loginId)) ? (
        <div
          id="myCoin"
          onMouseEnter={handleMouseHover(true)}
          onMouseLeave={handleMouseHover(false)}
          className={classnames(
            !loginInfo && !loginId
              ? isHovered === 'myCoin'
                ? 'footer-nav-item-unsigned-active'
                : 'footer-nav-item-unsigned'
              : isHovered === 'myCoin'
              ? 'footer-nav-item-signed'
              : 'footer-nav-item',
          )}
          onClick={onClickMyCoin}
        >
          <ImageComponent loading="lazy" src={MyCoinIcon} alt="" />
          {t('my coin')}
        </div>
      ) : null}

      <div
        id="players"
        onMouseEnter={handleMouseHover(true)}
        onMouseLeave={handleMouseHover(false)}
        className={classnames(
          !loginInfo && !loginId
            ? isHovered === 'players'
              ? 'footer-nav-item-unsigned-active'
              : 'footer-nav-item-unsigned'
            : isHovered === 'players'
            ? 'footer-nav-item-signed'
            : 'footer-nav-item',
        )}
        onClick={onClickPlayer}
      >
        <ImageComponent loading="lazy" src={PlayerIcon} alt="" />
        {t('players')}
      </div>
      {/* {isMobile() ? (
        <Menu
          menuButton={({ open }) => (
            <div
              id="collectibles"
              style={{
                width: window.innerWidth <= 350 && showMyCoin ? '70px' : '90px',
              }}
              className={classnames(
                'footer-nav-item-unhovered',
                !loginInfo && !loginId
                  ? open
                    ? 'footer-nav-item-unsigned-active'
                    : 'footer-nav-item-unsigned'
                  : open
                  ? 'footer-nav-item-signed'
                  : 'footer-nav-item',
              )}
            >
              <ImageComponent loading="lazy" src={CollectiblesIcon} alt="" />
              {t('collectibles')}
            </div>
          )}
          direction={'top'}
          align={'center'}
          position={'auto'}
          viewScroll={'auto'}
          arrow={true}
          offsetX={0}
          offsetY={0}
        >
          <MenuItem
            className={'first-item'}
            key={'nfts'}
            onClick={() => onItemPress('nfts')}
          >
            <ImageComponent loading="lazy" src={NFTIcon} alt="" />
            NFTS
          </MenuItem>
          <MenuItem key={'items'} onClick={() => onItemPress('items')}>
            <ImageComponent loading="lazy" src={ItemsIcon} alt="" />
            {t('items')}
          </MenuItem>
        </Menu>
      ) : (
        <>
          <div
            id="nfts"
            onMouseEnter={handleMouseHover(true)}
            onMouseLeave={handleMouseHover(false)}
            className={classnames(
              !loginInfo && !loginId
                ? isHovered === 'nfts'
                  ? 'footer-nav-item-unsigned-active'
                  : 'footer-nav-item-unsigned'
                : isHovered === 'nfts'
                ? 'footer-nav-item-signed'
                : 'footer-nav-item',
            )}
            onClick={onClickNFTs}
          >
            <ImageComponent loading="lazy" src={NFTIcon} alt="" />
            NFTS
          </div>
          <div
            id="items"
            onMouseEnter={handleMouseHover(true)}
            onMouseLeave={handleMouseHover(false)}
            className={classnames(
              !loginInfo && !loginId
                ? isHovered === 'items'
                  ? 'footer-nav-item-unsigned-active'
                  : 'footer-nav-item-unsigned'
                : isHovered === 'items'
                ? 'footer-nav-item-signed'
                : 'footer-nav-item',
            )}
            onClick={onClickItems}
          >
            <ImageComponent loading="lazy" src={ItemsIcon} alt="" />
            {t('items')}
          </div>
        </>
      )} */}
      {/* {isMobile() ? (
        <Menu
          menuButton={({ open }) => (
            <div
              id="collectibles"
              style={{
                width: window.innerWidth <= 350 && showMyCoin ? '70px' : '90px',
              }}
              className={classnames(
                'footer-nav-item-unhovered',
                !loginInfo && !loginId
                  ? open
                    ? 'footer-nav-item-unsigned-active'
                    : 'footer-nav-item-unsigned'
                  : open
                  ? 'footer-nav-item-signed'
                  : 'footer-nav-item',
              )}
            >
              <ImageComponent loading="lazy" src={CollectiblesIcon} alt="" />
              {t('collectibles')}
            </div>
          )}
          direction={'top'}
          align={'center'}
          position={'auto'}
          viewScroll={'auto'}
          arrow={true}
          offsetX={0}
          offsetY={0}
        >
          <MenuItem key={'items'} onClick={() => onItemPress('scouts')}>
            <ImageComponent loading="lazy" src={ScoutsIcon} alt="" />
            {t('Scouts')}
          </MenuItem>
        </Menu>
      ) : (
        <> */}
      <div
        id="items"
        onMouseEnter={handleMouseHover(true)}
        onMouseLeave={handleMouseHover(false)}
        className={classnames(
          !loginInfo && !loginId
            ? isHovered === 'items'
              ? 'footer-nav-item-unsigned-active'
              : 'footer-nav-item-unsigned'
            : isHovered === 'items'
            ? 'footer-nav-item-signed'
            : 'footer-nav-item',
        )}
        onClick={onClickScouts}
      >
        <ImageComponent loading="lazy" src={ScoutsIcon} alt="" />
        {t('Scouts')}
      </div>
      {/* </>
      )} */}
      {Boolean(loginInfo) || Boolean(loginId) ? (
        <div
          id="signin"
          onMouseEnter={handleMouseHover(true)}
          onMouseLeave={handleMouseHover(false)}
          className={classnames(
            isHovered === 'signin'
              ? 'footer-nav-item-signed'
              : 'footer-nav-item',
            'footer-inactive-signin',
          )}
          onClick={onClickWallet}
        >
          <ImageComponent loading="lazy" src={SigninInActive} alt="" />
          {t('wallet')}
        </div>
      ) : (
        <div
          id="signin"
          onMouseEnter={handleMouseHover(true)}
          onMouseLeave={handleMouseHover(false)}
          className={classnames(
            !loginInfo && !loginId
              ? 'footer-nav-item-unsigned'
              : isHovered === 'signin'
              ? 'footer-nav-item-signed'
              : 'footer-nav-item',
            'footer-active-signin',
          )}
          onClick={onClickSignin}
        >
          <ImageComponent
            loading="lazy"
            src={selectedThemeRedux === 'Black' ? SigninIconBlack : SigninIcon}
            alt=""
          />
          {t('sign in')}
        </div>
      )}
    </div>
  )
}

export default FooterNav
