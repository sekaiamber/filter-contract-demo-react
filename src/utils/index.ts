import Decimal from 'decimal.js-light'
import moment, { MomentInput } from 'moment'

export const sleep = async (ms: number): Promise<void> =>
  await new Promise((resolve) => setTimeout(resolve, ms))

export function debounce<Params extends any[]>(
  func: (...args: Params) => any,
  timeout: number
): (...args: Params) => NodeJS.Timeout {
  let timer: NodeJS.Timeout
  return (...args: Params) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, timeout)
    return timer
  }
}

export function label2key(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-bA-b0-9 ]/gi, '')
    .replace(/ +/gi, '_')
}

export function formatEthHash(addr: string, remain: number = 10): string {
  if (addr.length <= remain) return addr
  return `${addr.slice(0, 6)}...${addr.slice(6 - remain)}`
}

const ethAddressReg = /^0x[a-fA-F0-9]{40}$/
export function isEthAddress(addr: string): boolean {
  return ethAddressReg.test(addr)
}

export function tokenHumanAmount(realAmount: string, decimals: number): string {
  const bn = new Decimal(realAmount)
  const de = new Decimal(10).pow(decimals)
  return bn.div(de).toString()
}

export function tokenRealAmount(humanAmount: string, decimals: number): string {
  const bn = new Decimal(humanAmount)
  const de = new Decimal(10).pow(decimals)
  return bn.mul(de).toString()
}

export function gwei(wei: string): string {
  return tokenHumanAmount(wei, 9)
}

export function eth(wei: string): string {
  return tokenHumanAmount(wei, 18)
}

export function formatTime(time: MomentInput): string {
  const n = moment(time)
  return n.format('HH:mm:ss')
}

export function formatDateTime(datetime: MomentInput): string {
  const n = moment(datetime)
  return n.format('YYYY-DD-MM HH:mm:ss')
}
