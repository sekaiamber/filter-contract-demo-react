/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useCallback, useState } from 'react'
import { createContainer } from 'unstated-next'
import FilterRuleContract from './contracts/filterRule'
import Erc721MockContract from './contracts/erc721Mock'
import Web3 from '.'
import { ContractReceipt } from 'ethers'

interface useWeb3MethodProps {
  currentAccount: string | null | undefined
  maxGasPrice: string
  nftPrice: string
  walletBalance: string
  getErc721Balance: () => Promise<string>
  updateState: () => Promise<void>
  mint: (txOptions?: {}) => Promise<ContractReceipt>
}

function useWeb3Method(): useWeb3MethodProps {
  const [maxGasPrice, setMaxGasPrice] = useState('0')
  const [nftPrice, setNftPrice] = useState('0')
  const [walletBalance, setWalletBalance] = useState('0')

  const { currentAccount, library } = Web3.useContainer()

  const canRun = useCallback(() => {
    if (!currentAccount) return false
    if (!library) return false
    if (!library.getSigner()) return false
    return true
  }, [currentAccount, library])

  const updateMaxGasPrice = useCallback(async () => {
    if (!canRun()) return
    const contract = new FilterRuleContract(library.getSigner())
    const gas = await contract.getMaxGasPrice()
    setMaxGasPrice(gas)
  }, [currentAccount, canRun, library, setMaxGasPrice])

  const updateNftPrice = useCallback(async () => {
    if (!canRun()) return
    const contract = new Erc721MockContract(library.getSigner())
    const gas = await contract.getPrice()
    setNftPrice(gas)
  }, [currentAccount, canRun, library, setNftPrice])

  const getWalletBalance = useCallback(async () => {
    if (!canRun()) return '0'
    const bn = await library.getBalance(currentAccount)
    return bn.toString()
  }, [currentAccount, canRun, library])

  const updateWalletBalance = useCallback(async () => {
    if (!canRun()) return
    const b = await getWalletBalance()
    setWalletBalance(b)
  }, [currentAccount, canRun, library, setWalletBalance, getWalletBalance])

  const updateState = useCallback(async () => {
    await updateMaxGasPrice()
    await updateNftPrice()
    await updateWalletBalance()
  }, [updateMaxGasPrice, updateNftPrice, updateWalletBalance])

  const mint = useCallback(
    async (txOptions?: {}) => {
      const contract = new Erc721MockContract(library.getSigner())
      const tx = await contract.mint(1, txOptions)
      return tx
    },
    [currentAccount, canRun, library]
  )

  const getErc721Balance = useCallback(async () => {
    if (!canRun()) return '0'
    const contract = new Erc721MockContract(library.getSigner())
    const bn = await contract.balanceOf(currentAccount!)
    return bn.toString()
  }, [currentAccount, canRun, library])

  return {
    currentAccount,
    maxGasPrice,
    nftPrice,
    walletBalance,
    getErc721Balance,
    updateState,
    mint,
  }
}

const Web3Method = createContainer(useWeb3Method)

export default Web3Method
