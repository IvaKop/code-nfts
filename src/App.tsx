import { ChakraProvider } from '@chakra-ui/react'
import { MoralisProvider } from 'react-moralis'

import CodeEditor from './components/CodeEditor'
import Navigation from './components/Navigation'

function App() {
    return (
        <MoralisProvider
            appId={process.env.REACT_APP_MORALIS_APP_ID || ''}
            serverUrl={process.env.REACT_APP_MORALIS_SERVER_URL || ''}
        >
            <ChakraProvider>
                <Navigation />
                <CodeEditor />
            </ChakraProvider>
        </MoralisProvider>
    )
}

export default App
