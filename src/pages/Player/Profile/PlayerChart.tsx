import Spinner from '@components/Spinner'
import { clearCharts, getCharts } from '@root/apis/playerCoins/playerCoinsSlice'
import { RootState } from '@root/store/rootReducers'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Chart from './Chart'
import { isMobile } from '@utils/helpers'
import classNames from 'classnames'

interface Props {
  onCardView: any
  profileData: any
}

const PlayerChart: React.FC<Props> = ({ onCardView, profileData }) => {
  const [chartOption, setChartOption] = useState('Price')
  const [chartPeriod, setChartPeriod] = useState('7D')
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const { charts, isGetChartsSuccess, isLoading } = useSelector(
    (state: RootState) => state.playercoins,
  )

  const [xAxisData, setXAxisData] = useState<any>([])
  const [series, setSeries] = useState<any>([])

  const getChartsData = () => {
    if (charts.length > 0) {
      let startDate = new Date()
      const currentDate = new Date()
      if (chartPeriod === '7D') {
        startDate.setDate(currentDate.getDate() - 7)
      } else if (chartPeriod === '1M') {
        let year = currentDate.getFullYear()
        let month = currentDate.getMonth()
        const day = currentDate.getDate()

        // Adjust the month and year if necessary
        if (month === 0) {
          // January
          month = 11 // December
          year -= 1
        } else {
          month -= 1
        }
        startDate = new Date(year, month, day)
      } else if (chartPeriod === '3M') {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        let day = currentDate.getDate()

        // Calculate the new month and year
        let newMonth = month - 3
        let newYear = year

        if (newMonth < 0) {
          newMonth += 12
          newYear -= 1
        }

        // Adjust the day if it doesn't exist in the new month
        const daysInNewMonth = new Date(newYear, newMonth + 1, 0).getDate()
        day = Math.min(day, daysInNewMonth)

        startDate = new Date(newYear, newMonth, day)
      } else if (chartPeriod === '1Y') {
        const year = currentDate.getFullYear() - 1
        const month = currentDate.getMonth()
        const day = currentDate.getDate()

        startDate = new Date(year, month, day)
      } else if (chartPeriod === 'YTD') {
        const year = currentDate.getFullYear() - 1
        startDate = new Date(year, 1, 1)
      } else {
        return charts
      }
      const startDateStr = startDate.toISOString().split('T')[0]
      let i
      for (i = 0; i < charts.length; i++) {
        if (startDateStr <= charts[i].dayintime.toString()) {
          break
        }
      }
      return charts.slice(i)
    }

    return charts
  }

  useEffect(() => {
    dispatch(getCharts(profileData?.playercontract))
    return () => {
      dispatch(clearCharts())
    }
  }, [])

  useEffect(() => {
    if (isGetChartsSuccess) {
      const seriesValues: any = []
      const xAxisDataValues: any = []
      const chartsData = getChartsData()
      if (chartOption === 'Price') {
        chartsData.forEach((item: any) => {
          seriesValues.push(item.averagepriceusd)
          xAxisDataValues.push(item.dayintime)
        })
      } else if (chartOption === 'Coin Supply') {
        chartsData.forEach((item: any) => {
          seriesValues.push(item.coinsupply)
          xAxisDataValues.push(item.dayintime)
        })
      } else if (chartOption === 'Volume') {
        chartsData.forEach((item: any) => {
          seriesValues.push(item.totalvolumestate)
          xAxisDataValues.push(item.dayintime)
        })
      } else if (chartOption === 'Market Value') {
        chartsData.forEach((item: any) => {
          seriesValues.push(item.marketvalueusd)
          xAxisDataValues.push(item.dayintime)
        })
      }
      setXAxisData(xAxisDataValues)
      setSeries(seriesValues)
    }
  }, [isGetChartsSuccess])

  useEffect(() => {
    if (chartPeriod && profileData?.playercontract) {
      dispatch(
        getCharts({
          contract: profileData?.playercontract,
          chart_time: chartPeriod,
        }),
      )
    }
  }, [chartPeriod, chartOption])

  return (
    <>
      <div className="player-chart">
        <div className="flex-middle fullwidth">
          <div className="chart-option">
            <div
              className={chartOption === 'Price' ? 'button-hover' : ''}
              onClick={() => setChartOption('Price')}
            >
              {t('price')}
            </div>
            <div
              className={chartOption === 'Market Value' ? 'button-hover' : ''}
              onClick={() => setChartOption('Market Value')}
            >
              {t('market value')}
            </div>
            <div
              className={chartOption === 'Coin Supply' ? 'button-hover' : ''}
              onClick={() => setChartOption('Coin Supply')}
            >
              {t('coin supply')}
            </div>
            <div
              className={chartOption === 'Volume' ? 'button-hover' : ''}
              onClick={() => setChartOption('Volume')}
            >
              {t('volume')}
            </div>
          </div>
          <div
            className={classNames('chart')}
            style={
              series.length > 1 || isMobile()
                ? {}
                : {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }
            }
          >
            {isLoading ? (
              <Spinner
                className="flex-center fullheight"
                spinnerStatus={true}
                title={''}
              />
            ) : series.length > 1 ? (
              <Chart
                xAxisData={xAxisData}
                series={series}
                chartOption={chartOption}
              />
            ) : (
              <div
                className={classNames(
                  'blog-title yellow-color',
                  isMobile() ? 'mt-180' : '',
                )}
                style={{
                  // marginLeft: isMobile() ? 'calc(50vh - 90px)' : '225px',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {isGetChartsSuccess ? t('no data yet') : ''}
              </div>
            )}
          </div>
          <div className="chart-period">
            <div
              className={chartPeriod === '7D' ? 'button-hover' : ''}
              onClick={() => setChartPeriod('7D')}
            >
              7D
            </div>
            <div
              className={chartPeriod === '1M' ? 'button-hover' : ''}
              onClick={() => setChartPeriod('1M')}
            >
              1M
            </div>
            <div
              className={chartPeriod === '3M' ? 'button-hover' : ''}
              onClick={() => setChartPeriod('3M')}
            >
              3M
            </div>
            <div
              className={chartPeriod === '1Y' ? 'button-hover' : ''}
              onClick={() => setChartPeriod('1Y')}
            >
              1Y
            </div>
            <div
              className={chartPeriod === 'YTD' ? 'button-hover' : ''}
              onClick={() => setChartPeriod('YTD')}
            >
              YTD
            </div>
            <div
              className={chartPeriod === 'ALL' ? 'button-hover' : ''}
              onClick={() => setChartPeriod('ALL')}
            >
              ALL
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PlayerChart
