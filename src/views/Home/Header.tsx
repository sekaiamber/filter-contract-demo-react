import React, { useEffect, useState } from 'react'
import { Button, Divider, Space, Tag } from 'antd'
import Web3 from '../../store/web3'
import Web3Methods from '../../store/web3/methods'
import { ConnectorNames } from '../../store/web3/connectors'
import { eth, gwei } from '../../utils'
import {
  CheckCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'

const Header: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const { connect, currentAccount } = Web3.useContainer()
  const { updateState, maxGasPrice, nftPrice, walletBalance, stateReady } =
    Web3Methods.useContainer()

  const handleConnect = (): void => {
    connect(ConnectorNames.Injected, () => {})
  }

  useEffect(() => {
    setLoading(true)
    updateState()
      .then(() => {
        setLoading(false)
      })
      .catch((e) => console.log(e))
  }, [currentAccount])

  return (
    <>
      <Divider orientation="left">链接钱包</Divider>
      <div>
        <Button
          type="primary"
          onClick={handleConnect}
          disabled={!!currentAccount}
        >
          {currentAccount ?? '链接钱包 (Metamask / BSC Testnet)'}
        </Button>
      </div>
      <Divider orientation="left">状态</Divider>
      <div>
        <Space>
          <Tag
            color={stateReady.maxGasPrice ? 'success' : 'error'}
            icon={
              stateReady.maxGasPrice ? (
                <CheckCircleOutlined />
              ) : loading ? (
                <SyncOutlined spin />
              ) : (
                <ClockCircleOutlined />
              )
            }
          >
            Filter Max Gas Price: {gwei(maxGasPrice)} gwei
          </Tag>
          <Tag
            color={stateReady.nftPrice ? 'success' : 'error'}
            icon={
              stateReady.nftPrice ? (
                <CheckCircleOutlined />
              ) : loading ? (
                <SyncOutlined spin />
              ) : (
                <ClockCircleOutlined />
              )
            }
          >
            Nft Price: {eth(nftPrice)} BNB
          </Tag>
          <Tag
            color={stateReady.walletBalance ? 'success' : 'error'}
            icon={
              stateReady.walletBalance ? (
                <CheckCircleOutlined />
              ) : loading ? (
                <SyncOutlined spin />
              ) : (
                <ClockCircleOutlined />
              )
            }
          >
            Wallet Balance(&gt;0.1): {parseFloat(eth(walletBalance)).toFixed(2)}
          </Tag>
        </Space>
      </div>
      <div>
        <Tag
          color={stateReady.all ? 'success' : 'error'}
          icon={
            stateReady.all ? <CheckCircleOutlined /> : <CloseCircleOutlined />
          }
        >
          Ready for test
        </Tag>
      </div>
    </>
  )
}

export default Header
