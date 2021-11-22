import { Box } from '@chakra-ui/react'
import { useInfiniteQuery } from 'react-query'
import { Button } from '@chakra-ui/react'
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
    const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
        useInfiniteQuery('nfts', fetchNFTs, {
            getNextPageParam: lastPage => {
                return lastPage.nextOffset
            },
        })

    // const Web3Api = useMoralisWeb3Api()
    // const { fetch, data } = useMoralisWeb3ApiCall(
    //     Web3Api.token.getAllTokenIds,
    //     {
    //         chain: 'rinkeby',
    //         address: process.env.REACT_APP_CONTRACT || '',
    //     },
    // )

    console.log(data)

    return (
        <Box p={8}>
            {data &&
                data.pages.map(page =>
                    page.results.assets.map((nft: any) => (
                        <NFTCard
                            key={nft.id}
                            imgUrl={nft.image_original_url}
                            title={nft.name}
                        />
                    )),
                )}
            {hasNextPage && (
                <Button
                    isLoading={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                >
                    Load more
                </Button>
            )}
        </Box>
    )
}

export default Explore
