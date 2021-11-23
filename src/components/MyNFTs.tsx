import { Box, Heading, Text, useToast, Button } from '@chakra-ui/react'
import { useInfiniteQuery } from 'react-query'
import NFTCard from './NFTCard'
import { useMoralis } from 'react-moralis'
import { Link } from 'react-router-dom'
import { SearchIcon } from '@chakra-ui/icons'
import { useEffect, useState } from 'react'
import { ethers, Contract } from 'ethers'
import codeNFTs from '../artifacts/contracts/CodeNFTs.sol/CodeNFTs.json'

const MyNFTs = () => {
    const { user } = useMoralis()
    const [gameContract, setGameContract] = useState<null | Contract>(null)
    const [isBurning, setIsBurning] = useState(false)
    const toast = useToast()

    const fetchNFTs = async ({ pageParam = 0 }) => {
        const response = await fetch(
            `https://rinkeby-api.opensea.io/api/v1/assets?asset_contract_address=${process.env.REACT_APP_CONTRACT}&offset=${pageParam}&owner=${user?.attributes.ethAddress}`,
        )
        const results = await response.json()
        const hasNextPage = results.assets.length === 20
        return { results, nextOffset: hasNextPage ? pageParam + 1 : undefined }
    }

    const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
        useInfiniteQuery('myNfts', fetchNFTs, {
            getNextPageParam: lastPage => {
                return lastPage.nextOffset
            },
        })

    useEffect(() => {
        const { ethereum } = window as any

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()

            if (process.env.REACT_APP_CONTRACT) {
                const gameContract = new ethers.Contract(
                    process.env.REACT_APP_CONTRACT,
                    codeNFTs.abi,
                    signer,
                )

                setGameContract(gameContract)
            }
        } else {
            console.log('Ethereum object not found')
        }
    }, [])

    useEffect(() => {
        const onBurn = async (sender: string, tokenId: any) => {
            console.log(
                `NFTBurned - sender: ${sender} tokenId: ${tokenId.toNumber()}}`,
            )
            toast({
                title: 'Code NFT successfully burned',
                description: "You've successfully burned your code NFT",
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
        }

        if (gameContract) {
            gameContract.on('NFTBurned', onBurn)
        }

        return () => {
            if (gameContract) {
                gameContract.off('NFTBurned', onBurn)
            }
        }
    }, [gameContract, user, toast])

    const burn = async (tokenId: string) => {
        try {
            if (gameContract) {
                setIsBurning(true)
                console.log('Burning in progress...')
                const burnTxn = await gameContract.burn(tokenId)
                console.log('burnTxn:', burnTxn)
                await burnTxn.wait()
            }
        } catch (error) {
            console.warn('BurnAction Error:', error)
            toast({
                title: 'An error occured',
                description: 'An error occured while burning your NFT',
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            setIsBurning(false)
        }
    }

    return (
        <Box p={8}>
            <Heading textAlign="center" mb={10}>
                My{' '}
                <Text as="span" color={'green.400'} fontWeight={800}>
                    Code NFTs
                </Text>
            </Heading>
            {data &&
                data.pages.map(page =>
                    page.results.assets.length > 0 ? (
                        page.results.assets.map((nft: any) => (
                            <NFTCard
                                key={nft.id}
                                imgUrl={nft.image_original_url}
                                title={nft.name}
                                traits={nft.traits}
                                link={nft.permalink}
                                onBurn={() => burn(nft.token_id)}
                                isBurning={isBurning}
                            />
                        ))
                    ) : (
                        <Box textAlign="center">
                            <SearchIcon fontSize="9xl" mt={10} />
                            <Text textAlign="center" my={10}>
                                No Code NFTs found
                            </Text>
                            <Button
                                as={Link}
                                to="/mint"
                                bg={'green.400'}
                                color="white"
                                _hover={{
                                    bg: 'green.300',
                                }}
                            >
                                Mint your first Code NFT
                            </Button>
                        </Box>
                    ),
                )}
            <Box textAlign="center">
                {hasNextPage && (
                    <Button
                        isLoading={isFetchingNextPage}
                        onClick={() => fetchNextPage()}
                    >
                        Load more
                    </Button>
                )}
            </Box>
        </Box>
    )
}

export default MyNFTs
