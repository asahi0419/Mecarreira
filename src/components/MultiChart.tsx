import React, { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import { useSelector } from 'react-redux'
import { RootState } from '@root/store/rootReducers'
import { THEME_COLORS } from '@root/constants'
import { isMobile } from '@utils/helpers'

interface Props {
  xAxisData: any
  series: any
  chartOption: any
}

const MultiChart: React.FC<Props> = ({ xAxisData, series, chartOption }) => {
  const authenticationData = useSelector(
    (state: RootState) => state.authentication,
  )
  const { selectedThemeRedux } = authenticationData
  const valueOfTheme = localStorage.getItem('theme')
  const chartBgColor =
    THEME_COLORS[selectedThemeRedux ?? valueOfTheme]['PrimaryBackground']
  const makeYLabel = (e: number) => {
    if (e < 10) {
      if (chartOption === 'Balance') {
        return e.toFixed(2)
      } else {
        return e.toFixed(2)
      }
    } else if (e >= 10 && e < 1000) {
      return e.toFixed(0)
    } else if (e >= 1000 && e < 1000000) {
      return (e / 1000).toFixed(0) + 'K'
    } else if (e >= 1000000) {
      return (e / 1000000).toFixed(0) + 'Mln'
    }
  }
  const [option, setOption] = useState<any>(null)

  useEffect(() => {
    setOption({
      tooltip: {
        trigger: 'axis',
        position: function (point) {
          return [
            point[0] > (isMobile() ? window.innerHeight - 300 : 460)
              ? point[0] - 210
              : point[0],
            '10%',
          ]
        },
        valueFormatter: value => '$' + value.toFixed(2),
      },
      legend: {
        data: series.map(item => item.name),
        selected: Object.assign(
          {},
          ...series.map((item, index) => ({ [item.name]: index < 5 })),
        ),
        textStyle: {
          color:
            THEME_COLORS[selectedThemeRedux ?? valueOfTheme]['PrimaryText'],
          fontSize:
            window.innerWidth >= 1200 ? 20 : window.innerWidth >= 800 ? 16 : 12,
        },
        type: 'scroll',
      },
      height: 'auto',
      backgroundColor: chartBgColor,
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      toolbox: {},
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisData,
        axisLabel: {
          color: '#ABACB5',
          fontWeight: 'bold',
          fontSize:
            window.innerWidth >= 1200 ? 20 : window.innerWidth >= 800 ? 16 : 12,
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: function (e: any) {
            return '$' + makeYLabel(e)
          },
          color: '#ABACB5',
          fontWeight: 'bold',
          fontSize:
            window.innerWidth >= 1200 ? 18 : window.innerWidth >= 800 ? 12 : 9,
        },
        color: '#ABACB5',
        fontWeight: 'bold',
      },
      series: series,
    })
  }, [series])

  return <>{option && <ReactECharts option={option} notMerge={true} />}</>
}

export default MultiChart
