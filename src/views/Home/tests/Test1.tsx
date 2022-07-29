import React, { useState } from 'react'
import { Alert, Button, Steps } from 'antd'
import Web3Methods from '../../../store/web3/methods'
import BaseTest from './BaseTest'
import { gwei } from '../../../utils'
import { ContractReceipt } from 'ethers'
import { LoadingOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import System from '../../../store/system'

const Step = Steps.Step

const Test1: React.FC = () => {
  const { t } = useTranslation('trans', { keyPrefix: 'test1' })
  const [finish, setFinish] = useState(false)
  const [step, setStep] = useState(0)
  const [erc721BalanceBefore, setErc721BalanceBefore] = useState('0')
  const [erc721BalanceAfter, setErc721BalanceAfter] = useState('0')
  const [tx, setTx] = useState<ContractReceipt>()
  const { mint, maxGasPrice, getErc721Balance } = Web3Methods.useContainer()
  const { stateReady } = System.useContainer()

  const startTest = async (): Promise<void> => {
    try {
      setFinish(false)
      setStep(0)
      setTx(undefined)
      setStep(1)
      const b1 = await getErc721Balance()
      setErc721BalanceBefore(b1)
      const tx = await mint()
      setTx(tx)
      setStep(2)
      const b2 = await getErc721Balance()
      setErc721BalanceAfter(b2)
      setStep(3)
      setFinish(true)
    } catch (error) {
      setFinish(false)
      setStep(0)
      setTx(undefined)
    }
  }

  return (
    <BaseTest
      title={t('title')}
      description={
        <span style={{ whiteSpace: 'pre-line' }}>
          {t('description', { gas: gwei(maxGasPrice) })}
        </span>
      }
    >
      <Steps className="block" current={step}>
        <Step title={t('process.user')} description={t('process.mint')} />
        <Step
          title={t('process.erc721')}
          description={t('process.call')}
          icon={step === 1 && !finish ? <LoadingOutlined /> : undefined}
        />
        <Step title={t('process.filter')} description={t('process.pass')} />
        <Step title={t('process.user')} description={t('process.receive')} />
      </Steps>
      <div className="block">
        <Button
          type="primary"
          onClick={startTest}
          loading={step > 0 && !finish}
          disabled={!stateReady.test1}
        >
          {t('test')}
        </Button>
      </div>
      {finish && (
        <Alert
          message={t('report.title')}
          description={
            <ul>
              <li>
                <span>{t('report.before.title')}</span>
                <ul>
                  <li>
                    {t('report.before.erc721')}
                    {erc721BalanceBefore}
                  </li>
                </ul>
              </li>
              <li>
                <span>{t('report.after.title')}</span>
                <ul>
                  {tx && (
                    <li>
                      {t('report.after.hash')}
                      <a
                        href={`https://testnet.bscscan.com/tx/${tx.transactionHash}`}
                        target="_blank"
                      >
                        {tx.transactionHash}
                      </a>
                    </li>
                  )}
                  <li>
                    {t('report.after.erc721')}
                    {erc721BalanceAfter}
                  </li>
                </ul>
              </li>
            </ul>
          }
        />
      )}
    </BaseTest>
  )
}

export default Test1
