const PeriodBar = (props: any) => {
  const { chartPeriod, setChartPeriod } = props

  return (
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
  )
}

export default PeriodBar
