import React from 'react'

interface Props {
  children: React.ReactNode
}

const Container: React.FC<Props> = ({ children }) => (
  <div className="container">
    <div className="data-wrap">{children}</div>
  </div>
)

export default Container
