import { ethers } from 'ethers'

export default class WrappedContract {
  protected ABI: {}
  protected address: string
  protected provider: ethers.Signer | ethers.providers.Provider

  constructor(
    abi: {},
    address: string,
    provider: ethers.Signer | ethers.providers.Provider
  ) {
    this.ABI = abi
    this.address = address
    this.provider = provider
  }
}
