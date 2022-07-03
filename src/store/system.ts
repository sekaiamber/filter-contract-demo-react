import { useCallback, useEffect, useMemo, useState } from 'react'
import { createContainer } from 'unstated-next'
import Web3Methods from './web3/methods'
import serverWalletAPI from '../apis/ServerWalletAPI'

interface StateReady {
  maxGasPrice: boolean
  nftPrice: boolean
  walletBalance: boolean

  all: boolean

  // each test
  test1: boolean
  test2: boolean
  test3: boolean
}

interface useSystemProps {
  stateReady: StateReady
  relayWhitelistAmount: number
  updateRelayWhitelistAmount: () => Promise<void>
  increaseWhitelistAmount: () => Promise<void>
}

function useSystem(): useSystemProps {
  const [relayWhitelistAmount, setRelayWhitelistAmount] = useState(0)
  const { maxGasPrice, nftPrice, walletBalance, currentAccount } =
    Web3Methods.useContainer()

  const stateReady = useMemo<StateReady>(() => {
    const gas = parseFloat(maxGasPrice) > 0
    const nft = parseFloat(nftPrice) > 0
    const balance = parseFloat(walletBalance) > 0.1

    const all = gas && nft && balance

    const test1 = all
    const test2 = all && relayWhitelistAmount === 0
    const test3 = all && relayWhitelistAmount > 0

    return {
      maxGasPrice: gas,
      nftPrice: nft,
      walletBalance: balance,
      all,
      test1,
      test2,
      test3,
    }
  }, [maxGasPrice, nftPrice, walletBalance, relayWhitelistAmount])

  const updateRelayWhitelistAmount = useCallback(async () => {
    if (currentAccount) {
      const data = await serverWalletAPI.getWhitelist(currentAccount)
      setRelayWhitelistAmount(data.amount)
    }
  }, [setRelayWhitelistAmount, currentAccount])

  const increaseWhitelistAmount = useCallback(async () => {
    if (currentAccount) {
      const data = await serverWalletAPI.increaseWhitelistAmount(currentAccount)
      setRelayWhitelistAmount(data.amount)
    }
  }, [setRelayWhitelistAmount, currentAccount])

  useEffect(() => {
    updateRelayWhitelistAmount().catch((e) => console.log(e))
  }, [currentAccount])

  return {
    stateReady,
    relayWhitelistAmount,
    updateRelayWhitelistAmount,
    increaseWhitelistAmount,
  }
}

const System = createContainer(useSystem)

export default System
