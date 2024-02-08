import React, { useEffect, useState } from 'react'
import { AppLayout } from '@components/index'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { isMobile } from '@utils/helpers'
import '@assets/css/pages/PurchaseNft.css'
import { useTranslation } from 'react-i18next'
import { RootState } from '@root/store/rootReducers'
import {
  acceptDraft,
  createDraft,
  deleteDraftee,
  DraftingPercentage,
  getPlayer2Contract,
  persistDrafteePlayer,
} from '@root/apis/playerCoins/playerCoinsSlice'
import Web3ActionPrompt from '../PlayerCoin/web3Actionprompt'
import ApiActionPrompt from '@components/Dialog/ApiActionprompt'
import { useWalletHelper } from '@utils/WalletHelper'

const Web3ActionPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [promptDialog, setPromptDialog] = useState('')
  const [promptLoading, setPromptLoading] = useState(false)
  const [txnErr, setTxnErr] = useState('')
  const [txnHash, setTxnHash] = useState('')
  const playerCoinData = useSelector((state: RootState) => state.playercoins)
  const {
    drafteePlayerUrl,
    isGetPlayer2ContractSuccess,
    isGetPlayerContractError,
    player2contract,
    player1contract,
    player1contractabi,
    drafteePlayerName,
    drafteePlayerAddress,
    draftAction,
    draftPersist,
  } = playerCoinData

  const { callWeb3Method } = useWalletHelper()

  useEffect(() => {
    window.scrollTo(0, 0)
    setPromptDialog(t('are you sure you want to add this player as draftee'))
    if (drafteePlayerUrl || drafteePlayerAddress) {
      if (drafteePlayerUrl) {
        setPromptLoading(true)
        dispatch(getPlayer2Contract(drafteePlayerUrl))
      }
    } else {
      navigate(-1)
    }
  }, [])

  useEffect(() => {
    if (draftAction === 'acceptDraftee') {
      setPromptDialog(t('are you sure you want to accept this request'))
    } else if (draftAction === 'deleteDraftee') {
      setPromptDialog(t('are you sure you want to delete this draftee'))
    } else if (draftAction === 'draftFeePer') {
      setPromptDialog(
        t('are you sure you want to add this value as Drafting percentage ?'),
      )
    }
  }, [drafteePlayerName, drafteePlayerAddress, draftAction])

  useEffect(() => {
    if (isGetPlayer2ContractSuccess) {
      setPromptDialog(t('are you sure you want to add this player as draftee'))
      setPromptLoading(false)
    }
    if (isGetPlayerContractError) {
      setTxnErr(t('loading player contract failed'))
    }
  }, [isGetPlayer2ContractSuccess, isGetPlayerContractError])

  const handleDeleteDraftee = async () => {
    const promise = callWeb3Method(
      'deleteDraftee',
      player1contract,
      player1contractabi,
      [drafteePlayerAddress],
    )
    promise
      .then((txn: any) => {
        setTxnHash(txn.hash)
      })
      .catch((err: any) => {
        const isErrorGasEstimation = `${err}`.includes('cannot estimate gas')
        if (isErrorGasEstimation) {
          setTxnErr(t('not enough funds to pay for blockchain transaction'))
        } else {
          setTxnErr(err.reason || err.message)
        }
      })
  }

  const handleActionSuccess = async () => {
    if (draftAction === 'acceptDraftee') {
      handleAcceptDraftee()
    } else if (draftAction === 'deleteDraftee') {
      handleDeleteDraftee()
    } else {
      handleCreateDraft()
    }
  }

  const handleActionSuccessApi = (user_secret: string) => {
    const formData = new FormData()
    formData.append('user_secret', user_secret)
    console.log({ draftAction })
    if (draftAction === 'acceptDraftee') {
      formData.append('drafter_address', drafteePlayerAddress)
      formData.append('contract', player1contract)
      dispatch(acceptDraft(formData))
    } else if (draftAction === 'deleteDraftee') {
      formData.append('drafter_address', drafteePlayerAddress)
      dispatch(deleteDraftee(formData))
    } else if (draftAction === 'draftFeePer') {
      const formDataPer = new FormData()
      formDataPer.append('user_secret', user_secret)
      formDataPer.append('player_contract', player1contract || player2contract)
      formDataPer.append(
        'drafting_percentage',
        draftPersist?.draftFeeValue.toString(),
      )
      dispatch(DraftingPercentage(formDataPer))
    } else {
      formData.append('drafter_address', player2contract)
      dispatch(createDraft(formData))
    }
  }

  const handleCreateDraft = async () => {
    console.log('createDraft3')
    const promise = callWeb3Method(
      'createDraftRequest',
      player1contract,
      player1contractabi,
      [player2contract],
    )
    promise
      .then((txn: any) => {
        setTxnHash(txn.hash)
      })
      .catch((err: any) => {
        const isErrorGasEstimation = `${err}`.includes('cannot estimate gas')
        if (err.message === '406') {
          setTxnErr(t('this functionality unavailable for internal users'))
        }
        if (isErrorGasEstimation) {
          setTxnErr(t('not enough funds to pay for blockchain transaction'))
        } else {
          setTxnErr(err.reason || err.message)
        }
      })
  }

  const handleAcceptDraftee = async () => {
    const promise = callWeb3Method(
      'acceptDraftRequest',
      player1contract,
      player1contractabi,
      [drafteePlayerAddress],
    )
    promise
      .then((txn: any) => {
        setTxnHash(txn.hash)
      })
      .catch((err: any) => {
        const isErrorGasEstimation = `${err}`.includes('cannot estimate gas')
        if (err.message === '406') {
          setTxnErr(t('this functionality unavailable for internal users'))
        }
        if (isErrorGasEstimation) {
          setTxnErr(t('not enough funds to pay for blockchain transaction'))
        } else {
          setTxnErr(err.reason || err.message)
        }
      })
  }

  const handleRemoveAdminPrompt = async () => {
    await dispatch(persistDrafteePlayer({ playerUrl: '' }))
    setTxnErr('')
    setTxnHash('')
    setPromptDialog('')
    navigate(-1)
  }

  return (
    <AppLayout
      headerStatus="header-status"
      headerClass="home"
      footerStatus="footer-status"
      noPageFooter={true}
    >
      <section className="player-dashboard-container">
        {' '}
        {localStorage.getItem('loginId') ? (
          <ApiActionPrompt
            promptText={promptDialog}
            onSuccess={handleActionSuccessApi}
            onClose={handleRemoveAdminPrompt}
            operationMode={
              ['acceptDraftee', 'createDraftRequest'].includes(draftAction)
                ? 'add'
                : 'remove'
            }
            customClass={
              isMobile() ? 'go-live-web3 purchase-pc-bottomwrapper' : ''
            }
          />
        ) : (
          <Web3ActionPrompt
            txnHash={txnHash}
            isPromptLoading={promptLoading}
            errorMsg={txnErr}
            promptText={promptDialog}
            onSuccess={handleActionSuccess}
            onClose={handleRemoveAdminPrompt}
            walletAddress={drafteePlayerName || player2contract}
            operationMode={
              ['acceptDraftee', 'createDraftRequest'].includes(draftAction)
                ? 'add'
                : 'remove'
            }
            customClass={isMobile() ? 'exwallet-bottomwrapper' : ''}
          />
        )}
      </section>
    </AppLayout>
  )
}

export default Web3ActionPage
