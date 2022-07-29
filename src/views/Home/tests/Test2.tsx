import React, { ReactNode, useState } from 'react'
import { Alert, Button, Steps } from 'antd'
import Web3Methods from '../../../store/web3/methods'
import BaseTest from './BaseTest'
import { gwei } from '../../../utils'
import { ContractReceipt, ethers } from 'ethers'
import { LoadingOutlined, SyncOutlined } from '@ant-design/icons'
import System from '../../../store/system'
import serverWalletAPI, {
  InQueueLogDBData,
} from '../../../apis/ServerWalletAPI'
import useInterval from '../../../hooks/useInterval'
import { useTranslation } from 'react-i18next'

const Step = Steps.Step

export interface Test2BaseProps {
  description: string
  title: string
  disabled: boolean
  tips: ReactNode
  step3: ReactNode
  step4: ReactNode
}

export const Test2Base: React.FC<Test2BaseProps> = ({
  description,
  title,
  disabled,
  tips,
  step3,
  step4,
}) => {
  const { t } = useTranslation('trans', { keyPrefix: 'test2' })
  const [finish, setFinish] = useState(false)
  const [step, setStep] = useState(0)
  const [erc721BalanceBefore, setErc721BalanceBefore] = useState('0')
  const [erc721BalanceAfter, setErc721BalanceAfter] = useState('0')
  const [tx, setTx] = useState<ContractReceipt>()
  const [relayTx, setRelayTx] = useState<InQueueLogDBData>()
  const { mint, maxGasPrice, getErc721Balance } = Web3Methods.useContainer()
  const { updateRelayWhitelistAmount } = System.useContainer()

  useInterval(() => {
    if (tx && step === 3) {
      serverWalletAPI
        .getRelayTx(tx.transactionHash)
        .then((t) => {
          setRelayTx(t)
          if (
            t.state === 'rejected' ||
            t.state === 'resolved' ||
            t.state === 'error'
          ) {
            setStep(4)
            updateRelayWhitelistAmount()
              .then(() => {
                getErc721Balance()
                  .then((b) => {
                    setErc721BalanceAfter(b)
                  })
                  .catch((e) => console.log(e))
                setTimeout(() => {
                  getErc721Balance()
                    .then((b) => {
                      setErc721BalanceAfter(b)
                      setFinish(true)
                    })
                    .catch((e) => console.log(e))
                }, 5000)
              })
              .catch((e) => console.log(e))
          }
        })
        .catch((e) => {
          setFinish(false)
          setStep(0)
          setTx(undefined)
          setRelayTx(undefined)
          console.log(e)
        })
    }
  }, 1000)

  const startTest = async (): Promise<void> => {
    try {
      setFinish(false)
      setStep(0)
      setTx(undefined)
      setRelayTx(undefined)
      setStep(1)
      const b1 = await getErc721Balance()
      setErc721BalanceBefore(b1)
      const tx = await mint({
        gasPrice: ethers.utils.parseUnits(
          (parseInt(gwei(maxGasPrice)) + 5).toString(),
          'gwei'
        ),
      })
      setTx(tx)
      setStep(2)
      setStep(3)
    } catch (error) {
      setFinish(false)
      setStep(0)
      setTx(undefined)
      setRelayTx(undefined)
    }
  }

  return (
    <BaseTest
      title={title}
      description={
        <span style={{ whiteSpace: 'pre-line' }}>{description}</span>
      }
    >
      <Steps className="block" current={step}>
        <Step title={t('process.user')} description={t('process.mint')} />
        <Step
          title={t('process.erc721')}
          description={t('process.call')}
          icon={step === 1 && !finish ? <LoadingOutlined /> : undefined}
        />
        <Step
          title={t('process.filter')}
          description={t('process.intercept')}
          status="error"
        />
        {step3}
        {step4}
      </Steps>
      {tips}
      <div className="block">
        <Button
          type="primary"
          onClick={startTest}
          loading={step > 0 && !finish}
          disabled={disabled}
        >
          {t('test')}
        </Button>
      </div>
      {step >= 3 && (
        <Alert
          message={t('relay.title')}
          className="block"
          description={
            relayTx ? (
              <ul>
                <li>
                  {t('relay.tx')}
                  {tx?.transactionHash}
                </li>
                <li>
                  {t('relay.status')}
                  {t(`state.${relayTx.state}`)}
                </li>
                {relayTx.exTransactionHash && (
                  <li>
                    {t('relay.relayTx')}
                    <a
                      href={`https://testnet.bscscan.com/tx/${relayTx.exTransactionHash}`}
                      target="_blank"
                    >
                      {relayTx.exTransactionHash}
                    </a>
                  </li>
                )}
              </ul>
            ) : (
              <div>
                <SyncOutlined spin />
              </div>
            )
          }
        />
      )}
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
                  {relayTx && (
                    <>
                      <li>
                        {t('relay.status')}
                        {t(`state.${relayTx.state}`)}
                      </li>
                      {relayTx.exTransactionHash && (
                        <li>
                          {t('relay.relayTx')}
                          <a
                            href={`https://testnet.bscscan.com/tx/${relayTx.exTransactionHash}`}
                            target="_blank"
                          >
                            {relayTx.exTransactionHash}
                          </a>
                        </li>
                      )}
                    </>
                  )}
                </ul>
              </li>
            </ul>
          }
        />
      )}
    </BaseTest>
  )
}

const Test2: React.FC = () => {
  const { t } = useTranslation('trans', { keyPrefix: 'test2' })
  const { stateReady, relayWhitelistAmount } = System.useContainer()
  const { currentAccount } = Web3Methods.useContainer()
  const { maxGasPrice } = Web3Methods.useContainer()

  return (
    <Test2Base
      description={t('description', { gas: gwei(maxGasPrice) })}
      title={t('title', { amount: relayWhitelistAmount })}
      disabled={!stateReady.test2}
      tips={
        currentAccount &&
        relayWhitelistAmount !== 0 && (
          <Alert className="block" description={t('alert')} type="error" />
        )
      }
      step3={
        <Step
          title={t('process.relay')}
          description={t('process.reject')}
          status="error"
        />
      }
      step4={
        <Step title={t('process.user')} description={t('process.refund')} />
      }
    />
  )
}

export default Test2
