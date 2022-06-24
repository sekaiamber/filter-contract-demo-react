export const chainId = 97
export const rpcUrls = ['https://data-seed-prebsc-1-s1.binance.org:8545']

export default {
  chainId: '0x' + chainId.toString(16),
  chainName: 'Binance Smart Chain Testnet',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'bnb',
    decimals: 18,
  },
  rpcUrls,
  blockExplorerUrls: ['https://testnet.bscscan.com'],
}
