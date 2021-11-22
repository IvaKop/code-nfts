import { ChakraProvider } from '@chakra-ui/react'
import { MoralisProvider } from 'react-moralis'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import theme from './theme'
import { QueryClient, QueryClientProvider } from 'react-query'

import CodeEditor from './components/CodeEditor'
import Navigation from './components/Navigation'
import Explore from './components/Explore'

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                {process.env.REACT_APP_MORALIS_APP_ID &&
                    process.env.REACT_APP_MORALIS_SERVER_URL && (
                        <MoralisProvider
                            appId={process.env.REACT_APP_MORALIS_APP_ID}
                            serverUrl={process.env.REACT_APP_MORALIS_SERVER_URL}
                        >
                            <ChakraProvider theme={theme}>
                                <Navigation />
                                <CodeEditor />
                                <Routes>
                                    <Route path="/" element={<Explore />} />
                                </Routes>
                            </ChakraProvider>
                        </MoralisProvider>
                    )}
            </BrowserRouter>
        </QueryClientProvider>
    )
}

export default App
