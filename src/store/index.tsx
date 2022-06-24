import React from 'react'
// 业务层
import Web3, { Web3ReactProvider, getLibrary } from './web3'
import Web3Method from './web3/methods'
import System from './system'

const Store: React.FC = ({ children }) => {
  console.log(`global contexts have been re-rendered at: ${Date.now()}`)

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3.Provider>
        <Web3Method.Provider>
          <System.Provider>{children}</System.Provider>
        </Web3Method.Provider>
      </Web3.Provider>
    </Web3ReactProvider>
  )
}

export default Store
