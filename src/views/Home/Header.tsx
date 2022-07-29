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
  TranslationOutlined,
  // CloseCircleOutlined,
} from '@ant-design/icons'
import System from '../../store/system'
import { useTranslation } from 'react-i18next'
import i18n from '../../i18n'

const Header: React.FC = () => {
  const { t } = useTranslation('trans', { keyPrefix: 'header' })
  const [loading, setLoading] = useState(false)
  const { connect, currentAccount } = Web3.useContainer()
  const { updateState, maxGasPrice, nftPrice, walletBalance } =
    Web3Methods.useContainer()
  const { stateReady, relayWhitelistAmount } = System.useContainer()

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
      <div
        style={{
          marginTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Button
          type="primary"
          onClick={handleConnect}
          disabled={!!currentAccount}
        >
          {currentAccount ?? t('connect')}
        </Button>
        <Button
          type="primary"
          icon={<TranslationOutlined />}
          onClick={async () =>
            await i18n.changeLanguage(i18n.language === 'en' ? 'zh' : 'en')
          }
        />
      </div>
      <Divider orientation="left">{t('status.title')}</Divider>
      <div style={{ marginBottom: 12 }}>
        <Space>
          <span>{t('status.chain.title')}</span>
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
            {t('status.chain.filter', { gas: gwei(maxGasPrice) })}
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
            {t('status.chain.price', { price: eth(nftPrice) })}
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
            {t('status.chain.balance', {
              balance: parseFloat(eth(walletBalance)).toFixed(2),
            })}
          </Tag>
        </Space>
      </div>
      <div>
        <Space>
          <span>{t('status.relay.title')}</span>
          <Tag color="success" icon={<CheckCircleOutlined />}>
            {t('status.relay.whitelist', {
              amount: relayWhitelistAmount,
            })}
          </Tag>
        </Space>
      </div>
      {/* <div>
        <Tag
          color={stateReady.all ? 'success' : 'error'}
          icon={
            stateReady.all ? <CheckCircleOutlined /> : <CloseCircleOutlined />
          }
        >
          Ready for test
        </Tag>
      </div> */}
    </>
  )
}

export default Header
