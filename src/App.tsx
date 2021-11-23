import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import theme from './theme'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useMoralis } from 'react-moralis'

import Mint from './components/Mint'
import Navigation from './components/Navigation'
import Explore from './components/Explore'
import MyNFTs from './components/MyNFTs'
import Welcome from './components/Welcome'

const queryClient = new QueryClient()

function App() {
    const { isAuthenticated } = useMoralis()
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ChakraProvider theme={theme}>
                    <Navigation />
                    {isAuthenticated ? (
                        <>
                            <Mint />
                            <Routes>
                                <Route path="/" element={<Explore />} />
                                <Route
                                    path="/my-code-nfts"
                                    element={<MyNFTs />}
                                />
                            </Routes>
                        </>
                    ) : (
                        <Welcome />
                    )}
                </ChakraProvider>
            </BrowserRouter>
        </QueryClientProvider>
    )
}

export default App
