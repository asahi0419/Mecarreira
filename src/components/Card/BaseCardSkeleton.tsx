import React from 'react'
import '@assets/css/components/ClaimCard.css'
import classnames from 'classnames'

interface Props {
  reflection?: boolean
}
const BaseCardSkeleton: React.FC<Props> = ({ reflection }) => {
  const reflectStyle = {
    WebkitBoxReflect: 'unset',
  }

  return (
    <>
      <div
        className={classnames('my-card')}
        style={/Android/i.test(navigator.userAgent) ? reflectStyle : undefined}
      >
        <div className={classnames('background-image my_card_skeleton')} />
        <div className={classnames('avatar')}>
          <div className="player-image my_card_skeleton">
            <div className="my_card_skeleton"></div>
          </div>
        </div>
        <div className="player-givenname-wrapper">
          <div
            className={classnames(
              'player-givenname player_name_skeleton my_card_skeleton',
            )}
          ></div>
          |
          <div className="player-birthyear player_birth_skeleton my_card_skeleton"></div>
        </div>
        <div
          className={classnames(
            'player-surname player_surname_skeleton my_card_skeleton',
          )}
        ></div>
        <div className="content-wrapper">
          <div className="characteristics">
            <div className="coin-issued coin_issued_skeleton my_card_skeleton"></div>
            <div className="country-ranking country_skeleton my_card_skeleton"></div>
          </div>
          <div className="divider my_card_skeleton"></div>
          <div className="market-value-wrapper">
            <div className="comingsoon-text coming_soon_skeleton my_card_skeleton"></div>
          </div>
        </div>
        <div className="purchase-button-wrapper">
          <div className={classnames('buy-button')}></div>
          <div className={classnames('sell-button')}></div>
        </div>
      </div>
      {reflection ? (
        <div className="my-card reflection-card">
          <div className="background-image my_card_skeleton" />
          <div className="player-givenname-wrapper">|</div>
          <div className="player-surname">
            <span>|</span>
          </div>
          <div className="content-wrapper">
            <div className="characteristics">
              <div className="coin-issued coin_issued_skeleton my_card_skeleton"></div>
              <div className="country-ranking country_skeleton my_card_skeleton"></div>
            </div>
            <div className="divider my_card_skeleton"></div>
            <div className="market-value-wrapper">
              <div className="comingsoon-text coming_soon_skeleton my_card_skeleton"></div>
            </div>
          </div>
          <div className="purchase-button-wrapper">
            <div className={classnames('buy-button')}></div>
            <div className={classnames('sell-button')}></div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default BaseCardSkeleton
