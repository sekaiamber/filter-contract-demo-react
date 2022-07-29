import { Alert, Button, Steps } from 'antd'
import React from 'react'
import System from '../../../store/system'
import Web3Methods from '../../../store/web3/methods'
import { gwei } from '../../../utils'
import { Test2Base } from './Test2'
import { useTranslation } from 'react-i18next'

const Step = Steps.Step

const Test3: React.FC = () => {
  const { t } = useTranslation('trans', { keyPrefix: 'test3' })
  const { stateReady, relayWhitelistAmount, increaseWhitelistAmount } =
    System.useContainer()
  const { currentAccount } = Web3Methods.useContainer()
  const { maxGasPrice } = Web3Methods.useContainer()

  return (
    <Test2Base
      description={t('description', { gas: gwei(maxGasPrice) })}
      title={t('title', { amount: relayWhitelistAmount })}
      disabled={!stateReady.test3}
      tips={
        currentAccount &&
        relayWhitelistAmount <= 0 && (
          <Alert
            className="block"
            description={
              <>
                <div style={{ marginBottom: 12 }}>{t('alert')}</div>
                <div>
                  <Button type="primary" onClick={increaseWhitelistAmount}>
                    {t('addAllow')}
                  </Button>
                </div>
              </>
            }
            type="error"
          />
        )
      }
      step3={
        <Step title={t('process.relay')} description={t('process.pass')} />
      }
      step4={
        <Step title={t('process.user')} description={t('process.receive')} />
      }
    />
  )
}

export default Test3
