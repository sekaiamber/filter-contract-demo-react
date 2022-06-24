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

  // TODO: example
  async getReports(): Promise<reportData[]> {
    const resp = await this.axios.get('/api/v1/reports')
    const data = this.getResponseData<reportData[]>(resp.data)
    if (data) return data
    throw new Error('fetch error')
  }
}

const serverWalletAPI = new ServerWalletAPI()

export default serverWalletAPI
