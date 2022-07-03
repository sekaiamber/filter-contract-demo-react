import { SERVER_URL } from '../constants'
import axios, { AxiosInstance } from 'axios'
// import mockProjectImg from '../assets/img/icon_mock_project.svg'

export interface JsonResponseData<T = any> {
  success: boolean
  data?: T
  error?: {
    message: string
    code: string | number
  }
}

export interface reportData {
  id: number
  url: string
  title: string
  description: string
  displayDatetime: string
}

export interface WhitelistDBData {
  id: number
  address: string
  amount: number
}

export type InQueueLogState =
  | 'created'
  | 'waiting'
  | 'pending'
  | 'resolved'
  | 'rejected'
  | 'error'

export interface InQueueLogRawData {
  blockNumber: number
  data: string
  transactionHash: string
  user: string
  amount: number
  index: number
}

export interface InQueueLogDBData extends InQueueLogRawData {
  id: number
  state: InQueueLogState
  exTransactionHash: string | null
  exBlockNumber: number | null
  errorMessage: string | null
}

export class ServerWalletAPI {
  private readonly axios: AxiosInstance

  constructor() {
    this.axios = axios.create({ baseURL: SERVER_URL })
  }

  private getResponseData<T>(data: JsonResponseData<T>): T | undefined | null {
    if (data.success) {
      return data.data
    }
    return null
  }

  async getWhitelist(address: string): Promise<WhitelistDBData> {
    const resp = await this.axios.get(`/api/v1/filter/whitelist/${address}`)
    const data = this.getResponseData<WhitelistDBData>(resp.data)
    if (data) return data
    throw new Error('fetch error')
  }

  async increaseWhitelistAmount(address: string): Promise<WhitelistDBData> {
    const resp = await this.axios.post(
      `/api/v1/filter/whitelist/${address}/request`
    )
    const data = this.getResponseData<WhitelistDBData>(resp.data)
    if (data) return data
    throw new Error('fetch error')
  }

  async getRelayTx(hash: string): Promise<InQueueLogDBData> {
    const resp = await this.axios.get(`/api/v1/tx/${hash}`)
    const data = this.getResponseData<InQueueLogDBData>(resp.data)
    if (data) return data
    throw new Error('fetch error')
  }
}

const serverWalletAPI = new ServerWalletAPI()

export default serverWalletAPI
