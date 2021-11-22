import { Flex, Box, Image, Badge, useColorModeValue } from '@chakra-ui/react'

type NFTCardProps = {
    imgUrl: string
    title: string
}

const NFTCard = ({ imgUrl, title }: NFTCardProps) => {
    return (
        <Flex p={50} w="full" alignItems="center" justifyContent="center">
            <Box
                bg={useColorModeValue('white', 'gray.800')}
                maxW="3xl"
                borderWidth="1px"
                rounded="lg"
                shadow="lg"
                position="relative"
            >
                <Image
                    src={imgUrl}
                    alt={`Picture of ${title}`}
                    roundedTop="lg"
                />

                <Box p="6">
                    <Box d="flex" alignItems="baseline">
                        <Badge
                            rounded="full"
                            px="2"
                            fontSize="0.8em"
                            colorScheme="red"
                            mr={2}
                        >
                            New
                        </Badge>
                        <Badge
                            rounded="full"
                            px="2"
                            fontSize="0.8em"
                            colorScheme="blue"
                        >
                            New
                        </Badge>
                    </Box>
                    <Flex
                        mt="1"
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
