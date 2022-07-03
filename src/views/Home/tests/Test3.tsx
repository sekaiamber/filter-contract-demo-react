import { Alert, Button, Steps } from 'antd'
import React from 'react'
import System from '../../../store/system'
import Web3Methods from '../../../store/web3/methods'
import { gwei } from '../../../utils'
import { Test2Base } from './Test2'

const Step = Steps.Step

const description = (
  gasPrice: string
): string => `本测试模拟了一个限制用户（但是为白名单）进行mint的场景，采用了高gas来试图提前mint，在我们的规则中，超过 ${gwei(
  gasPrice
)} gwei 的交易将被去中心化合约拦截，我们使用 ${gwei(
  gasPrice
)} + 5 gwei 来进行交易；同时，在中继（relay）被规则放行，导致交易虽然被拦截，但是仍然被延迟放行。

这个测试流程为：
1. 用户提交mint交易
2. 调用ERC721合约
3. 交易被Filter合约规则拦截
4. 用户被扣款，但是nft数量并没有增加
5. 中继监测到事件，延迟 4s 判定，用户Whitelist allow amount大于0，则交易被放行
6. 用户获得nft

流程如下图：
`

const Test3: React.FC = () => {
  const { stateReady, relayWhitelistAmount, increaseWhitelistAmount } =
    System.useContainer()
  const { currentAccount } = Web3Methods.useContainer()

  return (
    <Test2Base
      getDescription={description}
      title={`测试3(当前允许量${relayWhitelistAmount})`}
      disabled={!stateReady.test3}
      tips={
        currentAccount &&
        relayWhitelistAmount <= 0 && (
          <Alert
            className="block"
            description={
              <>
                <div style={{ marginBottom: 12 }}>
                  {
                    '本次测试需要Whitelist allow amount大于0，请使用下面按钮增加允许量'
                  }
                </div>
                <div>
                  <Button type="primary" onClick={increaseWhitelistAmount}>
                    增加允许量
                  </Button>
                </div>
              </>
            }
            type="error"
          />
        )
      }
      step3={<Step title="中继" description="放行" />}
      step4={<Step title="用户" description="获得nft" />}
    />
  )
}

export default Test3
