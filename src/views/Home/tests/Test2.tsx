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

const Step = Steps.Step

const description = (
  gasPrice: string
): string => `本测试模拟了一个限制用户进行mint的场景，采用了高gas来试图提前mint，在我们的规则中，超过 ${gwei(
  gasPrice
)} gwei 的交易将被去中心化合约拦截，我们使用 ${gwei(
  gasPrice
)} + 5 gwei 来进行交易；同时，在中继（relay）被规则拦截，导致交易被延迟拒绝。

这个测试流程为：
1. 用户提交mint交易
2. 调用ERC721合约
3. 交易被Filter合约规则拦截
4. 用户被扣款，但是nft数量并没有增加
5. 中继监测到事件，延迟 4s 判定，用户Whitelist allow amount为0，则交易被拒绝
6. 用户获得退款

流程如下图：
`

const RelayTxStateMap = {
  created: '已创建',
  waiting: '等待中',
  pending: '已提交tx',
  resolved: '已放行',
  rejected: '已拒绝',
  error: '出错',
}

export interface Test2BaseProps {
  getDescription: (gasPrice: string) => string
  title: string
  disabled: boolean
  tips: ReactNode
  step3: ReactNode
  step4: ReactNode
}

export const Test2Base: React.FC<Test2BaseProps> = ({
  getDescription,
  title,
  disabled,
  tips,
  step3,
  step4,
}) => {
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
        <span style={{ whiteSpace: 'pre-line' }}>
          {getDescription(maxGasPrice)}
        </span>
      }
    >
      <Steps className="block" current={step}>
        <Step title="用户" description="mint nft" />
        <Step
          title="Erc721合约"
          description="调用"
          icon={step === 1 && !finish ? <LoadingOutlined /> : undefined}
        />
        <Step title="Filter合约" description="拦截" status="error" />
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
          测试Mint
        </Button>
      </div>
      {step >= 3 && (
        <Alert
          message="中继状态"
          className="block"
          description={
            relayTx ? (
              <ul>
                <li>监听到交易: {tx?.transactionHash}</li>
                <li>当前状态: {RelayTxStateMap[relayTx.state]}</li>
                {relayTx.exTransactionHash && (
                  <li>
                    中继tx:{' '}
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
          message="测试报告"
          description={
            <ul>
              <li>
                <span>测试前</span>
                <ul>
                  <li>Erc721数量: {erc721BalanceBefore}</li>
                </ul>
              </li>
              <li>
                <span>测试后</span>
                <ul>
                  {tx && (
                    <li>
                      tx hash:{' '}
                      <a
                        href={`https://testnet.bscscan.com/tx/${tx.transactionHash}`}
                        target="_blank"
                      >
                        {tx.transactionHash}
                      </a>
                    </li>
                  )}
                  <li>Erc721数量: {erc721BalanceAfter}</li>
                  {relayTx && (
                    <>
                      <li>中继状态: {RelayTxStateMap[relayTx.state]}</li>
                      {relayTx.exTransactionHash && (
                        <li>
                          中继tx:{' '}
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
  const { stateReady, relayWhitelistAmount } = System.useContainer()
  const { currentAccount } = Web3Methods.useContainer()

  return (
    <Test2Base
      getDescription={description}
      title={`测试2(当前允许量${relayWhitelistAmount})`}
      disabled={!stateReady.test2}
      tips={
        currentAccount &&
        relayWhitelistAmount !== 0 && (
          <Alert
            className="block"
            description="本次测试需要Whitelist allow amount为0，请使用测试3消耗允许量"
            type="error"
          />
        )
      }
      step3={<Step title="中继" description="拒绝" status="error" />}
      step4={<Step title="用户" description="获得退款" />}
    />
  )
}

export default Test2
