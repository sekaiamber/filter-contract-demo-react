import React, { ReactNode } from 'react'
import { Divider, Alert } from 'antd'

interface BaseTestProps {
  title: string
  description: ReactNode
}

const BaseTest: React.FC<BaseTestProps> = ({
  children,
  title,
  description,
}) => {
  return (
    <div className="test">
      <Divider orientation="left">{title}</Divider>
      <div className="content">
        <Alert className="block" description={description} type="info" />
        {children}
      </div>
    </div>
  )
}

export default BaseTest
