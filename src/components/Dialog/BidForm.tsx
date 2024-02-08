import React, { useEffect, useState } from 'react'
import SubmitButton from '@components/Button/SubmitButton'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
  bidOnAuction,
  getPlayer1Contract,
} from '@root/apis/playerCoins/playerCoinsSlice'
import { RootState } from '@root/store/rootReducers'
import { ethers } from 'ethers'
import Web3BottomPopup from './Web3BottomPopup'
import Spinner from '../Spinner'
import ApiBottomPopup from './ApiBottomPopup'
import { useWalletHelper } from '@utils/WalletHelper'

interface Props {
  nft: any
  onClose: () => void
}

const BidForm: React.FC<Props> = ({ nft, onClose }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [input, setInput] = useState('')
  const [txnError, setTxnError] = useState('')
  const [txnHash, setTxnHash] = useState('')
  const [showBottomPopup, setShowBottomPopup] = useState(false)

  const { callWeb3Method } = useWalletHelper()

  const stopPropagation = (event: any) => {
    event.stopPropagation()
  }

  useEffect(() => {
    dispatch(getPlayer1Contract({ url: nft?.detailpageurl }))
  }, [])

  const { isLoading, player1contract, stakingcontract, stakingcontractabi } =
    useSelector((state: RootState) => state.playercoins)

  const handleBid = () => {
    setShowBottomPopup(true)
    if (localStorage.getItem('loginId')) {
      return
    }
    const exp = ethers.BigNumber.from('10').pow(13)
    const bidAmount = ethers.BigNumber.from(
      Math.floor(parseFloat(input) * Math.pow(10, 5)),
    ).mul(exp)
    const promise = callWeb3Method(
      'bidOnAuction',
      stakingcontract,
      stakingcontractabi,
      [nft?.auctionid ?? 0, bidAmount],
    )
    promise
      .then((txn: any) => {
        setTxnHash(txn.hash)
      })
      .catch((err: any) => {
        const isErrorGasEstimation = `${err}`.includes('cannot estimate gas')
        if (err.message === '406') {
          setTxnError(t('this functionality unavailable for internal users'))
        }
        if (isErrorGasEstimation) {
          setTxnError(t('not enough funds to pay for blockchain transaction'))
        } else {
          setTxnError(err.reason || err.message)
        }
      })
  }

  const handleClose = () => {
    setShowBottomPopup(false)
    setTxnError('')
    setTxnHash('')
  }

  const handleBidApi = (user_secret: any) => {
    const formData = new FormData()
    formData.append('auction_id', nft?.auctionid ?? 0)
    formData.append('amount', input)
    formData.append('user_secret', user_secret)
    formData.append('contract', player1contract)
    dispatch(bidOnAuction(formData))
  }

  return (
    <div className="bid-container" onClick={stopPropagation}>
      {showBottomPopup &&
        (localStorage.getItem('loginInfo') ? (
          <Web3BottomPopup
            showPopup={showBottomPopup}
            txnHash={txnHash}
            txnErr={txnError}
            onClose={handleClose}
          />
        ) : (
          <ApiBottomPopup
            showPopup={showBottomPopup}
            onSubmit={handleBidApi}
            onClose={handleClose}
            customClass="purchase-pc-bottomwrapper"
          />
        ))}
      {isLoading ? (
        <Spinner title={''} spinnerStatus={isLoading} />
      ) : (
        <>
          <div className="bid-title">{t('place bid')}</div>
          <div className="bid-desc">{t('you must place a bid')}</div>
          <div className="bid-enter">
            <div className="bid-enter-label">{t('enter bid')}:</div>
            <input
              type="text"
              className="bid-enter-input"
              placeholder={t('amount')}
              value={input}
              onInput={(e: any) => setInput(e.target.value)}
            ></input>
          </div>
        </>
      )}
      <div className="bid-submit">
        <SubmitButton
          isDisabled={false}
          title={t('confirm')}
          className="m-0auto"
          onPress={handleBid}
        />
        <div
          className="form-submit-btn btn-disabled mt-20 m-0auto"
          onClick={onClose}
        >
          {t('cancel')}
        </div>
      </div>
    </div>
  )
}

export default BidForm
