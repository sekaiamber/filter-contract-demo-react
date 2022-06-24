import erc20ABI from './erc20ABI.json'
import { BigNumber, ContractTransaction, ethers } from 'ethers'
import WrappedContract from './base'
import { MAX_ETH_NUM } from '../../../constants/enum'

export default class Erc20TokenContract extends WrappedContract {
  constructor(
    address: string,
    provider: ethers.Signer | ethers.providers.Provider
  ) {
    super(erc20ABI, address, provider)
  }

  getInstance(): ethers.Contract {
    return new ethers.Contract(this.address, this.ABI as any, this.provider)
  }

  async balanceOf(address: string): Promise<string> {
    const contract = this.getInstance()
    const bn = (await contract.balanceOf(address)) as BigNumber
    return bn.toString()
  }

  async approve(
    address: string,
    amount: string = MAX_ETH_NUM
  ): Promise<ethers.ContractReceipt> {
    const contract = this.getInstance()
    return contract
      .approve(address, amount)
      .then(async (tx: ContractTransaction) => {
        return await tx.wait()
      })
  }

  async allowance(owner: string, spender: string): Promise<string> {
    const contract = this.getInstance()
    const bn = (await contract.allowance(owner, spender)) as BigNumber
    return bn.toString()
  }
}
