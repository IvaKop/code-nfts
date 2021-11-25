import { Box, Heading, Text } from '@chakra-ui/react'
import { useInfiniteQuery } from 'react-query'
import { Button, Spinner } from '@chakra-ui/react'
import NFTCard from './NFTCard'

// import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from 'react-moralis'

const fetchNFTs = async ({ pageParam = 0 }) => {
    const response = await fetch(
        `https://rinkeby-api.opensea.io/api/v1/assets?asset_contract_address=${process.env.REACT_APP_CONTRACT}&offset=${pageParam}`,
    )
    const results = await response.json()
    const hasNextPage = results.assets.length === 20
    return { results, nextOffset: hasNextPage ? pageParam + 1 : undefined }
}

const Explore = () => {
    const { data, isFetchingNextPage, fetchNextPage, hasNextPage, isLoading } =
        useInfiniteQuery('nfts', fetchNFTs, {
            getNextPageParam: lastPage => {
                return lastPage.nextOffset
            },
        })

    // const Web3Api = useMoralisWeb3Api()
    // const { fetch, data: web3data } = useMoralisWeb3ApiCall(
    //     Web3Api.token.getAllTokenIds,
    //     {
    //         chain: 'rinkeby',
    //         address: process.env.REACT_APP_CONTRACT || '',
    //     },
    // )

    // console.log(web3data)

    return (
        <Box p={8}>
            <Heading textAlign="center" mb={10}>
                Explore the world of{' '}
                <Text as="span" color={'green.400'} fontWeight={800}>
                    Code NFTs
                </Text>
            </Heading>
            <Box textAlign="center">
                {isLoading && <Spinner size="lg" color="green.400" />}
            </Box>
            {data &&
                data.pages.map(page =>
                    page.results.assets
                        .filter(
                            (nft: any) =>
                                nft.owner?.user?.username !== 'NullAddress',
                        )
                        .map((nft: any) => (
                            <NFTCard
                                key={nft.id}
                                imgUrl={nft.image_original_url}
                                title={nft.name}
                                traits={nft.traits}
                                link={nft.permalink}
                                description={nft.description}
                            />
                        )),
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

export default Explore
