import { Box, Heading, Text } from '@chakra-ui/react'
import { useInfiniteQuery } from 'react-query'
import { Button } from '@chakra-ui/react'
import NFTCard from './NFTCard'
import { useMoralis } from 'react-moralis'
import { Link } from 'react-router-dom'
import { SearchIcon } from '@chakra-ui/icons'

const MyNFTs = () => {
    const { user } = useMoralis()

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

    return (
        <Box p={8}>
            <Heading textAlign="center" mb={10}>
                My{' '}
                <Text as="span" color={'green.400'}>
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
