import filterABI from './filterRuleABI.json'
import { ethers, BigNumber } from 'ethers'
import WrappedContract from './base'
import { CONTRACT_FILTER_RULE } from '../../../constants'

export default class FilterRuleContract extends WrappedContract {
  constructor(provider: ethers.Signer | ethers.providers.Provider) {
    super(filterABI, CONTRACT_FILTER_RULE, provider)
  }

  getInstance(): ethers.Contract {
    return new ethers.Contract(this.address, this.ABI as any, this.provider)
  }

  async getMaxGasPrice(): Promise<string> {
    const contract = this.getInstance()
    const bn: BigNumber = await contract.getMaxGasPrice()
    return bn.toString()
  }
}
