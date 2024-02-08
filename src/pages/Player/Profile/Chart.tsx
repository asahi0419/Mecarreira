import React from 'react'
import * as echarts from 'echarts'
import ReactECharts from 'echarts-for-react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { THEME_COLORS } from '@root/constants'
import { isMobile } from '@utils/helpers'

interface Props {
  xAxisData: any
  series: any
  chartOption: any
}

const Chart: React.FC<Props> = ({ xAxisData, series, chartOption }) => {
  const { t } = useTranslation()
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { selectedThemeRedux } = authenticationData
  const valueOfTheme = localStorage.getItem('theme')
  const chartBgColor =
    THEME_COLORS[selectedThemeRedux ?? valueOfTheme]['PrimaryBackground']
  const makeYLabel = (e: number) => {
    if (e === null) {
      return 0
    } else if (e < 10) {
      if (chartOption === 'Balance') {
        return e.toFixed(3)
      } else {
        return e.toFixed(3)
      }
    } else if (e >= 10 && e < 1000) {
      return e.toFixed(0)
    } else if (e >= 1000 && e < 1000000) {
      return (e / 1000).toFixed(0) + 'K'
    } else if (e >= 1000000) {
      return (e / 1000000).toFixed(0) + 'Mln'
    }
  }
  const option = {
    tooltip: {
      trigger: 'axis',
      position: function (pt: any) {
        return [
          pt[0] > (isMobile() ? window.innerHeight - 200 : 560)
            ? pt[0] - 120
            : pt[0],
          '10%',
        ]
      },
      formatter: function (e: any) {
        if (e[0].value) {
          return `${e[0].name.replace('T', ' ')}<br />
          ${e[0].seriesName} : ${e[0].value.toFixed(3)}`
        }
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
      show: true,
      axisLabel: {
        formatter: e => e.split('T')[0],
        textStyle: {
          fontSize:
            window.innerWidth >= 1200 ? 20 : window.innerWidth >= 800 ? 16 : 12, // Adjust this value to change the font size
        },
      },
    },
    color: '#ABACB5',
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function (e: any) {
          return (chartOption === 'Coin Supply' ? '' : '$') + makeYLabel(e)
        },
        color: '#ABACB5',
        fontWeight: 'bold',
        fontSize:
          window.innerWidth >= 1200 ? 18 : window.innerWidth >= 800 ? 12 : 9,
      },
      splitLine: {
        lineStyle: { color: '#56596A' },
      },
      splitNumber: chartOption === 'Balance' ? 5 : 10,
      axisLine: {
        lineStyle: { color: '#56596A' },
        show: true,
      },
      min: Math.min(...series) * 0.99,
      max: Math.max(...series) * 1.01,
    },
    backgroundColor: chartOption === 'Balance' ? chartBgColor : chartBgColor,
    series: [
      {
        name: t(chartOption.toLowerCase()),
        type: 'line',
        symbol: 'none',
        sampling: 'lttb',
        itemStyle: {
          color: THEME_COLORS[selectedThemeRedux]['PrimaryForeground'],
        },
        lineStyle: {
          color: THEME_COLORS[selectedThemeRedux]['PrimaryForeground'],
          width: 1.5,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: THEME_COLORS[selectedThemeRedux]['PrimaryForeground'],
            },
            {
              offset: 1,
              color: '#171923',
            },
          ]),
        },
        data: series,
      },
    ],
  }

  return (
    <>
      <ReactECharts option={option} />
    </>
  )
}

export default Chart
