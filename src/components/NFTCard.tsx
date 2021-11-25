import {
    Flex,
    Box,
    Image,
    Badge,
    useColorModeValue,
    Button,
    Text,
} from '@chakra-ui/react'
import { ExternalLinkIcon, DeleteIcon } from '@chakra-ui/icons'

type NFTCardProps = {
    imgUrl: string
    title: string
    traits: { value: string }[]
    link: string
    onBurn?: () => void
    isBurning?: boolean
    description?: string
}

const NFTCard = ({
    imgUrl,
    title,
    traits,
    link,
    onBurn,
    isBurning,
    description,
}: NFTCardProps) => {
    const bgColor = useColorModeValue('gray.100', 'gray.700')
    if (!imgUrl) return null
    return (
        <Flex p={5} w="full" alignItems="center" justifyContent="center">
            <Box
                bg={bgColor}
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
                                colorScheme={i % 2 === 1 ? 'purple' : 'yellow'}
                                mr={2}
                            >
                                {trait.value}
                            </Badge>
                        ))}
                    </Box>
                    <Flex
                        mt="4"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Box mr={2}>
                            <Box
                                fontSize="2xl"
                                fontWeight="semibold"
                                as="h4"
                                lineHeight="tight"
                                isTruncated
                            >
                                {title}
                            </Box>
                            <Text>{description}</Text>
                        </Box>
                        <Flex>
                            <Button
                                size="sm"
                                leftIcon={<ExternalLinkIcon />}
                                variant="solid"
                                as="a"
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                mr={2}
                            >
                                View on OpenSea
                            </Button>
                            {onBurn && (
                                <Button
                                    size="sm"
                                    leftIcon={<DeleteIcon />}
                                    variant="solid"
                                    onClick={onBurn}
                                    color="red.400"
                                    isLoading={isBurning}
                                >
                                    Burn
                                </Button>
                            )}
                        </Flex>
                    </Flex>
                </Box>
            </Box>
        </Flex>
    )
}

export default NFTCard
