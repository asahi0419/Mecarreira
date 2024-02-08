import React, { useEffect } from 'react'
import { AppLayout } from '@components/index'
import { useDispatch, useSelector } from 'react-redux'
import '@assets/css/pages/PurchaseNft.css'
import { RootState } from '@root/store/rootReducers'
import NewDraft from './NewDraft'
import {
  fetchDraftNewPlayers,
  getPlayer2Contract,
  getPlayerDrafts,
} from '@root/apis/playerCoins/playerCoinsSlice'

const NewDraftPage: React.FC = () => {
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const { player1contract } = playerCoinData

  const dispatch = useDispatch()

  const handleDraftClose = (value: any) => {
    if (value?.txnCompleted) {
      dispatch(getPlayerDrafts(player1contract))
    } else if (value?.playerUrl) {
      dispatch(getPlayer2Contract(value?.playerUrl))
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    dispatch(
      fetchDraftNewPlayers({
        status_id: [3, 4],
        player_contract: player1contract,
      }),
    )
  }, [])

  return (
    <AppLayout
      headerStatus="header-status"
      headerClass="home"
      footerStatus="footer-status"
      noPageFooter={true}
    >
      <section className="players-buy">
        <NewDraft onClose={handleDraftClose} />
      </section>
    </AppLayout>
  )
}

export default NewDraftPage
