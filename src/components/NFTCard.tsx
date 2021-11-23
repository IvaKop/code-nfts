import { Flex, Box, Image, Badge, useColorModeValue } from '@chakra-ui/react'

type NFTCardProps = {
    imgUrl: string
    title: string
    traits: { value: string }[]
}

const NFTCard = ({ imgUrl, title, traits }: NFTCardProps) => {
    return (
        <Flex p={5} w="full" alignItems="center" justifyContent="center">
            <Box
                bg={useColorModeValue('white', 'gray.800')}
                maxW="2xl"
                rounded="lg"
                shadow="2xl"
                position="relative"
                borderWidth="1px"
            >
                <Image
                    src={imgUrl}
                    alt={`Picture of ${title}`}
                    roundedTop="lg"
                />

                <Box p={6}>
                    <Box d="flex" alignItems="baseline">
                        {traits.map((trait, i) => (
                            <Badge
                                key={trait.value}
                                rounded="full"
                                px="2"
                                fontSize="0.8em"
                                colorScheme={i % 2 === 1 ? 'blue' : 'green'}
                                mr={2}
                            >
                                {trait.value}
                            </Badge>
                        ))}
                    </Box>
                    <Flex
                        mt="4"
                        justifyContent="space-between"
                        alignContent="center"
                    >
                        <Box
                            fontSize="2xl"
                            fontWeight="semibold"
                            as="h4"
                            lineHeight="tight"
                            isTruncated
                        >
                            {title}
                        </Box>
                    </Flex>
                </Box>
            </Box>
        </Flex>
    )
}

export default NFTCard
