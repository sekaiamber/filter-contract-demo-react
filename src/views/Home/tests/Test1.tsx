import React, { useState } from 'react'
import { Alert, Button, Steps } from 'antd'
import Web3Methods from '../../../store/web3/methods'
import BaseTest from './BaseTest'
import { gwei } from '../../../utils'
import { ContractReceipt } from 'ethers'
import { LoadingOutlined } from '@ant-design/icons'

const Step = Steps.Step

const description = (
  gasPrice: string
): string => `本测试模拟了一个普通用户进行mint的场景，这类用户一般不会参与gas war，在我们的规则中，超过 ${gwei(
  gasPrice
)} gwei 的交易将被合约拦截。

这个测试流程为：
1. 用户提交mint交易
2. 调用ERC721合约
3. 交易被Filter合约放行
4. 用户收到nft

流程如下图：
`

const Test1: React.FC = () => {
  const [finish, setFinish] = useState(false)
  const [step, setStep] = useState(0)
  const [erc721BalanceBefore, setErc721BalanceBefore] = useState('0')
  const [erc721BalanceAfter, setErc721BalanceAfter] = useState('0')
  const [tx, setTx] = useState<ContractReceipt>()
  const { mint, maxGasPrice, getErc721Balance, stateReady } =
    Web3Methods.useContainer()

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
      title="测试1"
      description={
        <span style={{ whiteSpace: 'pre-line' }}>
          {description(maxGasPrice)}
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
        <Step title="Filter合约" description="放行" />
        <Step title="用户" description="获得 nft" />
      </Steps>
      <div className="block">
        <Button
          type="primary"
          onClick={startTest}
          loading={step > 0 && !finish}
          disabled={!stateReady.all}
        >
          测试Mint
        </Button>
      </div>
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
                  {tx && <li>tx hash: {tx.transactionHash}</li>}
                  <li>Erc721数量: {erc721BalanceAfter}</li>
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
