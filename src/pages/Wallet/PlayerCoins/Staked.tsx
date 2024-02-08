import { AppLayout } from '@components/index'
import { RootState } from '@root/store/rootReducers'
import { useSelector } from 'react-redux'
import StakedForm from './StakedForm'

const Staked = () => {
  const playerCoinData: any = useSelector(
    (state: RootState) => state.playercoins,
  )
  const { getPlayerDetailsSuccessData } = playerCoinData

  return (
    <AppLayout footerStatus="footer-status" noPageFooter={true}>
      <StakedForm playerData={getPlayerDetailsSuccessData} />
    </AppLayout>
  )
}

export default Staked
