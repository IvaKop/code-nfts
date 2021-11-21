import { ChakraProvider } from '@chakra-ui/react'
import { MoralisProvider } from 'react-moralis'
import { BrowserRouter } from 'react-router-dom'
import theme from './theme'

import CodeEditor from './components/CodeEditor'
import Navigation from './components/Navigation'

function App() {
    return (
        <BrowserRouter>
            <MoralisProvider
                appId={process.env.REACT_APP_MORALIS_APP_ID || ''}
                serverUrl={process.env.REACT_APP_MORALIS_SERVER_URL || ''}
            >
                <ChakraProvider theme={theme}>
                    <Navigation />
                    <CodeEditor />
                </ChakraProvider>
            </MoralisProvider>
        </BrowserRouter>
    )
}

export default App
