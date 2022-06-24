import erc721ABI from './erc721ABI.json'
import { BigNumber, ethers, ContractTransaction } from 'ethers'
import WrappedContract from './base'
import { CONTRACT_HERO, CONTRACT_BOX, CONTRACT_LAND } from '../../../constants'
import { NFTTokenURI } from '../../../constants/types'

export default class Erc72TokenContract extends WrappedContract {
  constructor(
    address: string,
    provider: ethers.Signer | ethers.providers.Provider
  ) {
    super(erc721ABI, address, provider)
  }

  getInstance(): ethers.Contract {
    return new ethers.Contract(this.address, this.ABI as any, this.provider)
  }

  async balanceOf(address: string): Promise<number> {
    const contract = this.getInstance()
    const bn = (await contract.balanceOf(address)) as BigNumber
    return bn.toNumber()
  }

  async tokenOfOwnerByIndex(address: string, index: number): Promise<number> {
    const contract = this.getInstance()
    const bn = (await contract.tokenOfOwnerByIndex(address, index)) as BigNumber
    return bn.toNumber()
  }

  async tokenURI(tokenId: number): Promise<string> {
    const contract = this.getInstance()
    return contract.tokenURI(tokenId)
  }

  async safeTransferFrom(
    addressFrom: string,
    addressTo: string,
    tokenId: number
  ): Promise<ethers.ContractReceipt> {
    const contract = this.getInstance()
    return contract['safeTransferFrom(address,address,uint256)'](
      addressFrom,
      addressTo,
      tokenId
    ).then(async (tx: ContractTransaction) => {
      return await tx.wait()
    })
  }

  async approve(
    addressTo: string,
    tokenId: number
  ): Promise<ethers.ContractReceipt> {
    const contract = this.getInstance()
    return contract
      .approve(addressTo, tokenId)
      .then(async (tx: ContractTransaction) => {
        return await tx.wait()
      })
  }

  async getApproved(tokenId: number): Promise<string> {
    const contract = this.getInstance()
    return contract.getApproved(tokenId)
  }

  // other
  async tokenIdsOf(address: string): Promise<number[]> {
    const count = await this.balanceOf(address)
    const list: number[] = []
    for (let i = 0; i < count; i++) {
      list[i] = await this.tokenOfOwnerByIndex(address, i)
    }
    return list
  }

  async tokenURIListOf(address: string): Promise<NFTTokenURI[]> {
    const ids = await this.tokenIdsOf(address)
    const list: NFTTokenURI[] = []
    for (let i = 0; i < ids.length; i++) {
      const uri = await this.tokenURI(ids[i])
      list[i] = {
        id: ids[i],
        uri,
      }
    }
    return list
  }
}

export class HeroTokenContract extends Erc72TokenContract {
  constructor(provider: ethers.Signer | ethers.providers.Provider) {
    super(CONTRACT_HERO, provider)
  }
}

export class BoxTokenContract extends Erc72TokenContract {
  constructor(provider: ethers.Signer | ethers.providers.Provider) {
    super(CONTRACT_BOX, provider)
  }
}

export class LandTokenContract extends Erc72TokenContract {
  constructor(provider: ethers.Signer | ethers.providers.Provider) {
    super(CONTRACT_LAND, provider)
  }
}
