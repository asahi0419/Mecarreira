import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import App from '@root/App'
import reportWebVitals from './reportWebVitals'
import './i18n'
import { WalletConnectProvider, getLibrary } from './WalletConnectProvider'
import { Web3ReactProvider } from '@web3-react/core'
import { PrivyProvider } from '@privy-io/react-auth'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <WalletConnectProvider>
      <PrivyProvider
        appId={process.env.REACT_APP_PRIVY_APP_ID}
        config={{
          appearance: {
            theme: 'dark',
            accentColor: '#12131c',
          },
          // loginMethods: ['email', 'google', 'apple', 'discord', 'twitter'],
          embeddedWallets: {
            noPromptOnSignature: true, // defaults to false,
          },
        }}
        onSuccess={user => console.log(`for test User ${user.id} logged in!`)}
      >
        <App />
      </PrivyProvider>
    </WalletConnectProvider>
  </Web3ReactProvider>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
