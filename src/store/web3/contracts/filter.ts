import filterABI from './filterABI.json'
import { ethers } from 'ethers'
import WrappedContract from './base'
import { CONTRACT_FILTER } from '../../../constants'

export default class FilterContract extends WrappedContract {
  constructor(provider: ethers.Signer | ethers.providers.Provider) {
    super(filterABI, CONTRACT_FILTER, provider)
  }

  getInstance(): ethers.Contract {
    return new ethers.Contract(this.address, this.ABI as any, this.provider)
  }
}
