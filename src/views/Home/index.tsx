import React from 'react'
// import { ethers } from 'ethers'
import Header from './Header'
import { Test1, Test2 } from './tests'
import './style.scss'

export const Home: React.FC = () => {
  return (
    <div id="home" className="container">
      <Header />
      <Test1 />
      <Test2 />
    </div>
  )
}
