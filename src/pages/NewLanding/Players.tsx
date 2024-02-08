import React, { useRef } from 'react'

import CheckIcon from '@mui/icons-material/CheckBoxRounded'
import maticIcon from '@assets/images/matic-token-icon.webp'
import { useTranslation } from 'react-i18next'
import CircleCarousel from '@components/Carousel/CircleCarousel'
import NewCarouselCard from '@components/Card/NewCarouselCard'
import { isMobile } from '@utils/helpers'
import ImageComponent from '@components/ImageComponent'

const playersDemoData = [
  {
    playercontract: '0xc8b19C1FE7c3C6a7F63588727d118049199aF10E',
    playercardjson: {
      givenname_color: 'silver',
      surname_color: 'green',
      border_color: 'purple',
      border_stroke: false,
      avatar_color: 'purple',
      avatar_decor: false,
      bottom_decor_color: 'purple',
      background_image: 1,
    },
    surname: 'Caspedes',
    dateofbirth: '1997-11-12',
    name: 'Ramon Caspedes',
    givenname: 'Ramon',
    ticker: 'RACA',
    playercontractsubscriptionstart: 1675675443,
    detailpageurl: 'ramon-caspedes',
    playerpicture:
      'https://restapi.mecarreira.com/meCarreira_backend/media/raca.JPEG',
    playerpicturethumb:
      'https://restapi.mecarreira.com/meCarreira_backend/media/thumb_raca.jpeg',
    transfermarkt_link: null,
    exlistingon: false,
    country_code: 'ie',
    pricetx: 1676278561,
    playerlevelid: 2,
    playerlevelname: 'Bronze',
    id: 837,
    playerstatusid: {
      id: 4,
      playerstatusname: 'Subscribe',
    },
    pricechangepct: 0,
    matic: 9.4,
    '24h_change': 9.4,
    coin_issued: 59,
    usd_price: 0,
    market_cap: 560,
    holders: 2,
    exchangeRateUSD: {
      fromticker: 'MATIC',
      toticker: 'USD',
      ratetimestamp: 1676461800,
      rate: 1,
      '24h_rate': 1.17940827,
    },
  },
  {
    playercontract: '0xc8b19C1FE7c3C6a7F63588727d118049199aF10E',
    playercardjson: {
      givenname_color: 'yellow',
      surname_color: 'yellow',
      border_color: 'green',
      border_stroke: true,
      avatar_color: 'green',
      avatar_decor: false,
      bottom_decor_color: 'green',
      background_image: 2,
    },
    surname: 'Caspedes',
    dateofbirth: '1997-11-12',
    name: 'Malena Caspedes',
    givenname: 'Malena',
    ticker: 'MACA1',
    playercontractsubscriptionstart: 0,
    detailpageurl: 'malena-caspedes',
    playerpicture:
      'https://restapi.mecarreira.com/meCarreira_backend/media/output_fUGD8WD.png',
    playerpicturethumb:
      'https://restapi.mecarreira.com/meCarreira_backend/media/thumb_output_TzQ3vek.png',
    transfermarkt_link: null,
    exlistingon: false,
    country_code: 'de',
    pricetx: 1673951953,
    playerlevelid: 3,
    playerlevelname: 'Silver',
    id: 774,
    playerstatusid: {
      id: 4,
      playerstatusname: 'Subscribe',
    },
    pricechangepct: 0,
    matic: 11.34,
    '24h_change': 11.34,
    coin_issued: 176,
    usd_price: 0,
    market_cap: 2000,
    holders: 0,
    exchangeRateUSD: {
      fromticker: 'MATIC',
      toticker: 'USD',
      ratetimestamp: 1676461800,
      rate: 1,
      '24h_rate': 1.16,
    },
  },
  {
    playercontract: '0xc8b19C1FE7c3C6a7F63588727d118049199aF10E',
    playercardjson: {
      givenname_color: 'silver',
      surname_color: 'gold',
      border_color: 'blue',
      border_stroke: false,
      avatar_color: 'default',
      avatar_decor: true,
      bottom_decor_color: 'blue',
      background_image: 3,
    },
    surname: 'Maresco',
    dateofbirth: '2005-10-17',
    name: 'Diego Maresco',
    givenname: 'Diego',
    ticker: 'DIMA',
    playercontractsubscriptionstart: 1673290577,
    detailpageurl: 'diego-maresco',
    playerpicture:
      'https://restapi.mecarreira.com/meCarreira_backend/media/output_dKwYhjR.png',
    playerpicturethumb:
      'https://restapi.mecarreira.com/meCarreira_backend/media/thumb_output_r6h2iXe.png',
    transfermarkt_link: null,
    exlistingon: false,
    country_code: 'it',
    pricetx: 1675349369,
    playerlevelid: 4,
    playerlevelname: 'Gold',
    id: 731,
    playerstatusid: {
      id: 4,
      playerstatusname: 'Subscribe',
    },
    pricechangepct: 0,
    matic: 11.9,
    '24h_change': 11.9,
    coin_issued: 1224,
    usd_price: 0,
    market_cap: 14567,
    holders: 4,
    exchangeRateUSD: {
      fromticker: 'MATIC',
      toticker: 'USD',
      ratetimestamp: 1676461800,
      rate: 1,
      '24h_rate': 1.2,
    },
  },
  {
    playercontract: '0xc8b19C1FE7c3C6a7F63588727d118049199aF10E',
    playercardjson: {
      givenname_color: 'silver',
      surname_color: 'silver',
      border_color: 'silver',
      border_stroke: false,
      avatar_color: 'silver',
      avatar_decor: true,
      bottom_decor_color: 'silver',
      background_image: 4,
    },
    surname: 'Messi',
    dateofbirth: '1997-11-12',
    name: 'Juana Messi',
    givenname: 'Juana',
    ticker: 'JUME',
    playercontractsubscriptionstart: 1675711997,
    detailpageurl: 'juana-messi',
    playerpicture:
      'https://restapi.mecarreira.com/meCarreira_backend/media/jume.JPEG',
    playerpicturethumb:
      'https://restapi.mecarreira.com/meCarreira_backend/media/thumb_jume.jpeg',
    transfermarkt_link: null,
    exlistingon: false,
    country_code: 'ie',
    pricetx: 1675882743,
    playerlevelid: 5,
    playerlevelname: 'Diamond',
    id: 847,
    playerstatusid: {
      id: 4,
      playerstatusname: 'Subscribe',
    },
    pricechangepct: 0,
    matic: 12.4,
    '24h_change': 12.4,
    coin_issued: 20483,
    usd_price: 0,
    market_cap: 254000,
    holders: 5,
    exchangeRateUSD: {
      fromticker: 'MATIC',
      toticker: 'USD',
      ratetimestamp: 1676461800,
      rate: 1,
      '24h_rate': 0.8,
    },
  },
]

const Players: React.FC = () => {
  const { t } = useTranslation()
  const playerRef = useRef<any>([])

  const PlayerLevelCardItems: JSX.Element[] = []

  if (PlayerLevelCardItems.length === 0) {
    PlayerLevelCardItems.push(
      <div
        className="player-level-card"
        style={{ boxShadow: isMobile() ? '' : '0px 0px 10px 10px #f37927' }}
      >
        <div className="player-level-logo bronze-img" />
        <div className="level-name">{t('bronze')}</div>
        <div className="level-requirements">
          <div className="matic-value">
            <ImageComponent src={maticIcon} alt="" />
            <p>200</p>
          </div>
        </div>
        <div className="level-features">
          <div className="level-feature-item">
            <div className="tick-icon">
              <CheckIcon className="response-icon success-icon" />
            </div>
            <div>{t('bronze_trophy')}</div>
          </div>
          <div className="level-feature-item">
            <div className="tick-icon">
              <CheckIcon className="response-icon success-icon" />
            </div>
            <div>{t('discord_bronze_status')}</div>
          </div>
          <div className="level-feature-item">
            <div className="tick-icon">
              <CheckIcon className="response-icon success-icon" />
            </div>
            <div>{t('special_bronze_card_styles')}</div>
          </div>
          <div className="level-feature-item">
            <div className="tick-icon">
              <CheckIcon className="response-icon success-icon" />
            </div>
            <div>{t('player_lounge_access')}</div>
          </div>
        </div>
      </div>,
    )
    PlayerLevelCardItems.push(
      <div
        className="player-level-card"
        style={{ boxShadow: isMobile() ? '' : '0px 0px 10px 10px #ebebeb' }}
      >
        <div className="player-level-logo silver-img" />
        <div className="level-name">{t('silver')}</div>
        <div className="level-requirements">
          <div className="matic-value">
            <ImageComponent src={maticIcon} alt="" />
            <p>1,000</p>
          </div>
        </div>
        <div className="level-features">
          <div className="level-feature-item">
            <div className="tick-icon">
              <CheckIcon className="response-icon success-icon" />
            </div>
            <div>{t('silver_trophy')}</div>
          </div>
          <div className="level-feature-item">
            <div className="tick-icon">
              <CheckIcon className="response-icon success-icon" />
            </div>
            <div>{t('discord_silver_status')}</div>
          </div>
          <div className="level-feature-item">
            <div className="tick-icon">
              <CheckIcon className="response-icon success-icon" />
            </div>
            <div>{t('special_silver_card_styles')}</div>
          </div>
          <div className="level-feature-item">
            <div className="tick-icon">
              <CheckIcon className="response-icon success-icon" />
            </div>
            <div>{t('weekly_newsletter')}</div>
          </div>
          <div className="level-feature-item">
            <div className="tick-icon">
              <CheckIcon className="response-icon success-icon" />
            </div>
            <div>{t('upload_nfts')}</div>
          </div>
          <div className="level-feature-item">
            <div className="tick-icon">
              <CheckIcon className="response-icon success-icon" />
            </div>
            <div>{t('mention_in_weekly')}</div>
          </div>
        </div>
      </div>,
    )
    PlayerLevelCardItems.push(
      <div
        className="player-level-card"
        style={{ boxShadow: isMobile() ? '' : '0px 0px 10px 10px #fffc00' }}
      >
        <div className="player-level-logo gold-img" />
        <div className="level-name">{t('gold')}</div>
        <div className="level-requirements">
          <div className="matic-value">
            <ImageComponent src={maticIcon} alt="" />
            <p>5,000</p>
          </div>
        </div>
        <div className="level-features">
          <div className="level-feature-item">
            <div className="tick-icon">
              <CheckIcon className="response-icon success-icon" />
            </div>
            <div>{t('gold_trophy')}</div>
          </div>
          <div className="level-feature-item">
            <div className="tick-icon">
              <CheckIcon className="response-icon success-icon" />
            </div>
            <div>{t('discord_gold_status')}</div>
          </div>
          <div className="level-feature-item">
            <div className="tick-icon">
              <CheckIcon className="response-icon success-icon" />
            </div>
            <div>{t('special_gold_card_styles')}</div>
          </div>
          <div className="level-feature-item">
            <div className="tick-icon">
              <CheckIcon className="response-icon success-icon" />
            </div>
            <div>{t('your_own_player')}</div>
          </div>
          <div className="level-feature-item">
            <div className="tick-icon">
              <CheckIcon className="response-icon success-icon" />
            </div>
            <div>{t('mention_in_weekly_monthly')}</div>
          </div>
          <div className="level-feature-item">
            <div className="tick-icon">
              <CheckIcon className="response-icon success-icon" />
            </div>
            <div>{t('social_media_announcement')}</div>
          </div>
        </div>
      </div>,
    )
    PlayerLevelCardItems.push(
      <div
        className="player-level-card"
        style={{ boxShadow: isMobile() ? '' : '0px 0px 10px 10px #6d77b8' }}
      >
        <div className="player-level-logo diamond-img" />
        <div className="level-name">{t('diamond')}</div>
        <div className="level-requirements">
          <div className="matic-value">
            <ImageComponent src={maticIcon} alt="" />
            <p>25,000</p>
          </div>
          {/* <br /> */}
          {/* {t('for_15days')} */}
        </div>
        <div className="level-features">
          <div className="level-feature-item">
            <div className="tick-icon">
              <CheckIcon className="response-icon success-icon" />
            </div>
            <div>{t('diamond_trophy')}</div>
          </div>
          <div className="level-feature-item">
            <div className="tick-icon">
              <CheckIcon className="response-icon success-icon" />
            </div>
            <div>{t('discord_diamond_status')}</div>
          </div>
          <div className="level-feature-item">
            <div className="tick-icon">
              <CheckIcon className="response-icon success-icon" />
            </div>
            <div>{t('special_diamond_card_styles')}</div>
          </div>
          <div className="level-feature-item">
            <div className="tick-icon">
              <CheckIcon className="response-icon success-icon" />
            </div>
            <div>{t('nft_auctions')}</div>
          </div>
          <div className="level-feature-item">
            <div className="tick-icon">
              <CheckIcon className="response-icon success-icon" />
            </div>
            <div>{t('nft_raffles')}</div>
          </div>
          <div className="level-feature-item">
            <div className="tick-icon">
              <CheckIcon className="response-icon success-icon" />
            </div>
            <div>{t('fan_votes')}</div>
          </div>
          <div className="level-feature-item">
            <div className="tick-icon">
              <CheckIcon className="response-icon success-icon" />
            </div>
            <div>{t('staking_apy')}</div>
          </div>
          <div className="level-feature-item">
            <div className="tick-icon">
              <CheckIcon className="response-icon success-icon" />
            </div>
            <div>{t('exchange_listing')}</div>
          </div>
          <div className="level-feature-item">
            <div className="tick-icon">
              <CheckIcon className="response-icon success-icon" />
            </div>
            <div>{t('digital_service_shop')}</div>
          </div>
        </div>
      </div>,
    )
  }

  return (
    <div className="players-content">
      <span className="blog-title faq-title capitalize">{t('players')}</span>
      <div className="how-it-works-desc">
        <p className="pg-xl">{t('players can reach')}</p>
        <div className="player-level-card-container">
          {isMobile() ? (
            <CircleCarousel items={PlayerLevelCardItems} />
          ) : (
            <>{PlayerLevelCardItems}</>
          )}
        </div>
        <p className="ct-h2 text-left mt-60">{t('player all have')}</p>
        <div className="player-level-card-container player-carousel">
          {isMobile() ? (
            <CircleCarousel
              items={playersDemoData.map((item: any, index: number) => (
                <NewCarouselCard
                  card={item}
                  playercardjson={item.playercardjson}
                  key={index + 2}
                  prevData={playerRef?.current}
                  onBuy={() => console.log('')}
                  onSell={() => console.log('')}
                  navigation={false}
                />
              ))}
            />
          ) : (
            <>
              {playersDemoData.map((item: any, index: number) => (
                <NewCarouselCard
                  card={item}
                  playercardjson={item.playercardjson}
                  key={index + 2}
                  prevData={playerRef?.current}
                  onBuy={() => console.log('')}
                  onSell={() => console.log('')}
                  navigation={false}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Players
