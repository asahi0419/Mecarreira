import React from 'react'
import Grid from '@mui/material/Grid'
import TraitCard from '../../components/Card/TraitCard'
import ClaimCard from '../../components/Card/ClaimCard'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
import { getPlayerLevelName } from '@utils/helpers'

interface Props {
  nft: any
}

const NftDetail: React.FC<Props> = ({ nft }) => {
  const { t } = useTranslation()

  return (
    <div className="nft-detail-container">
      <div>
        {nft?.isGenesisNFT ? (
          <div
            className={classNames(nft?.description ? 'nft-detail-title' : '')}
          >
            <span
              className={classNames(
                getPlayerLevelName(nft?.statusid) === 'Diamond'
                  ? 'nft_level_diamond'
                  : getPlayerLevelName(nft?.statusid) === 'Gold'
                  ? 'nft_level_gold'
                  : getPlayerLevelName(nft?.statusid) === 'Silver'
                  ? 'nft_level_silver'
                  : getPlayerLevelName(nft?.statusid) === 'Bronze'
                  ? 'nft_level_bronze'
                  : '',
              )}
            >
              {t('genesis_by_mecarreira')}
            </span>
          </div>
        ) : nft?.statusid?.id === 6 ? (
          <div
            className={classNames('nft-detail-title')}
            style={{
              marginTop: nft?.claimable
                ? '-10px'
                : nft?.alreadyclaimed
                ? '0px'
                : '',
            }}
          >
            <span
              className={classNames(
                getPlayerLevelName(nft?.nftlevel) === 'Diamond'
                  ? 'nft_level_diamond'
                  : getPlayerLevelName(nft?.nftlevel) === 'Gold'
                  ? 'nft_level_gold'
                  : getPlayerLevelName(nft?.nftlevel) === 'Silver'
                  ? 'nft_level_silver'
                  : getPlayerLevelName(nft?.nftlevel) === 'Bronze'
                  ? 'nft_level_bronze'
                  : '',
              )}
            >{`${t('nft_desc_for_status_id_6')}`}</span>
          </div>
        ) : (
          <div
            className={classNames(nft?.description ? 'nft-detail-title' : '')}
          >
            <span
              className={classNames(
                getPlayerLevelName(nft?.nftlevel) === 'Diamond'
                  ? 'nft_level_diamond'
                  : getPlayerLevelName(nft?.nftlevel) === 'Gold'
                  ? 'nft_level_gold'
                  : getPlayerLevelName(nft?.nftlevel) === 'Silver'
                  ? 'nft_level_silver'
                  : getPlayerLevelName(nft?.nftlevel) === 'Bronze'
                  ? 'nft_level_bronze'
                  : '',
              )}
            >
              {nft?.description}
            </span>
          </div>
        )}
        {nft?.trait?.length > 0 ? (
          <div className="nft-detail-attr mt-20">
            <div className="nft-detail-attr-title">
              {t('special attributes')}
            </div>
            {nft?.trait && (
              <>
                {nft?.trait.length < 2 ? (
                  <Grid item spacing={2}>
                    {nft?.trait?.map((data: any, index: number) => (
                      <Grid item xs={6} sm={6} key={index}>
                        <TraitCard
                          id={data.id}
                          title={data.traittype}
                          desc={
                            data.traitvalue
                              ? data.traitvalue
                              : data.traitvalueint
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Grid container spacing={2}>
                    {nft?.trait?.map((data: any, index: number) => (
                      <Grid item xs={6} sm={6} key={index}>
                        <TraitCard
                          id={data.id}
                          title={data.traittype}
                          desc={
                            data.traitvalue
                              ? data.traitvalue
                              : data.traitvalueint
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </>
            )}
          </div>
        ) : (
          ''
        )}
        {(nft?.claim || nft?.claimtitle) && (
          <div className="nft-detail-claim">
            <div className="nft-detail-claim-title">{t('claim')}</div>
            <ClaimCard
              id={nft?.id}
              title={nft?.claimtitle}
              desc={nft?.claim}
              isClaim={true}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default NftDetail
