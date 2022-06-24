import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { BscConnector } from '@binance-chain/bsc-connector'
import { chainId, rpcUrls } from './chain'

// TODO: 这里要设置ChianID，本例子是用BSC
const injected = new InjectedConnector({ supportedChainIds: [chainId] })

// TODO:
const walletconnect = new WalletConnectConnector({
  rpc: { [chainId]: rpcUrls[0] },
  qrcode: true,
  // pollingInterval: 12000,
})

// TODO: 如果是BSC，可以加上这个connector，如果不是则去掉
const bscConnector = new BscConnector({ supportedChainIds: [chainId] })

export const ConnectorNames = {
  Injected: 'injected',
  WalletConnect: 'walletconnect',
  BSC: 'bsc',
}

const connectors = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.BSC]: bscConnector,
}

export default connectors

export const connectorLocalStorageKey = 'XXX_KEY'
