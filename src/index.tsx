import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { MoralisProvider } from 'react-moralis'

ReactDOM.render(
    <React.StrictMode>
        {process.env.REACT_APP_MORALIS_APP_ID &&
            process.env.REACT_APP_MORALIS_SERVER_URL && (
                <MoralisProvider
                    appId={process.env.REACT_APP_MORALIS_APP_ID}
                    serverUrl={process.env.REACT_APP_MORALIS_SERVER_URL}
                >
                    <App />
                </MoralisProvider>
            )}
    </React.StrictMode>,
    document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
