import { ChakraProvider } from '@chakra-ui/react'
import { MoralisProvider } from 'react-moralis'

import Auth from './components/Auth'
import CodeEditor from './components/CodeEditor'

function App() {
    return (
        <MoralisProvider
            appId={process.env.REACT_APP_MORALIS_APP_ID || ''}
            serverUrl={process.env.REACT_APP_MORALIS_SERVER_URL || ''}
        >
            <ChakraProvider>
                <Auth />
                <CodeEditor />
            </ChakraProvider>
        </MoralisProvider>
    )
}

export default App
