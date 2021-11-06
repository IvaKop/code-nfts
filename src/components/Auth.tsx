import { Button } from '@chakra-ui/react'
import { useMoralis } from 'react-moralis'

const Auth = () => {
    const {
        enableWeb3,
        authenticate,
        isAuthenticated,
        isWeb3EnableLoading,
        isAuthenticating,
        logout,
        isLoggingOut,
    } = useMoralis()

    const authenticateUser = async () => {
        enableWeb3()
        await authenticate()
    }

    const logoutUser = async () => {
        await logout()
    }

    if (isAuthenticated) {
        return (
            <Button onClick={logoutUser} isLoading={isLoggingOut}>
                Logout
            </Button>
        )
    }
    return (
        <Button
            onClick={authenticateUser}
            isLoading={isWeb3EnableLoading || isAuthenticating}
            bg={'pink.400'}
            href={'#'}
            color="white"
            _hover={{
                bg: 'pink.300',
            }}
        >
            Connect wallet
        </Button>
    )
}

export default Auth
