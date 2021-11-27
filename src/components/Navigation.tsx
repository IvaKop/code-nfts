import {
    Box,
    Flex,
    Text,
    IconButton,
    Stack,
    Collapse,
    Link,
    useColorModeValue,
    useDisclosure,
    useToast,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon, UpDownIcon } from '@chakra-ui/icons'

import { Link as RouterLink } from 'react-router-dom'
import { useMoralis } from 'react-moralis'

import Auth from './Auth'
import { useEffect } from 'react'

export default function WithSubnavigation() {
    const toast = useToast()
    const { isAuthenticated } = useMoralis()
    const { isOpen, onToggle } = useDisclosure()

    useEffect(() => {
        toast({
            title: 'Please use Rinkeby Test Network',
            status: 'warning',
            duration: 9000,
            isClosable: true,
        })
    }, [toast])

    return (
        <Box>
            <Flex
                bg={useColorModeValue('white', 'gray.800')}
                color={useColorModeValue('gray.600', 'white')}
                minH={'60px'}
                py={{ base: 2 }}
                px={{ base: 4 }}
                borderBottom={1}
                borderStyle={'solid'}
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                align={'center'}
            >
                <Flex
                    flex={{ base: 1, md: 'auto' }}
                    ml={{ base: -2 }}
                    display={{ base: 'flex', md: 'none' }}
                >
                    {isAuthenticated && (
                        <IconButton
                            onClick={onToggle}
                            icon={
                                isOpen ? (
                                    <CloseIcon w={3} h={3} />
                                ) : (
                                    <HamburgerIcon w={5} h={5} />
                                )
                            }
                            variant={'ghost'}
                            aria-label={'Toggle Navigation'}
                        />
                    )}
                </Flex>

                <Flex
                    flex={{ base: 1 }}
                    justify={{ base: 'center', md: 'start' }}
                >
                    <RouterLink to={'/'}>
                        <UpDownIcon
                            transform="rotate(90deg)"
                            fontSize="x-large"
                        />
                    </RouterLink>
                    {isAuthenticated && (
                        <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                            <DesktopNav />
                        </Flex>
                    )}
                </Flex>
                <Stack
                    flex={{ base: 1, md: 0 }}
                    justify={'flex-end'}
                    direction={'row'}
                    spacing={6}
                >
                    <Auth size="md" />
                </Stack>
            </Flex>

            {isAuthenticated && (
                <Collapse in={isOpen} animateOpacity>
                    <MobileNav onToggle={onToggle} />
                </Collapse>
            )}
        </Box>
    )
}

const DesktopNav = () => {
    const linkColor = useColorModeValue('gray.600', 'gray.200')
    const linkHoverColor = useColorModeValue('gray.800', 'white')

    return (
        <Stack direction={'row'} spacing={4}>
            {NAV_ITEMS.map(navItem => (
                <Box key={navItem.label}>
                    <Link
                        p={2}
                        to={navItem.to ?? '#'}
                        fontSize={'sm'}
                        fontWeight={500}
                        color={linkColor}
                        _hover={{
                            textDecoration: 'none',
                            color: linkHoverColor,
                        }}
                        as={RouterLink}
                    >
                        {navItem.label}
                    </Link>
                </Box>
            ))}
        </Stack>
    )
}

const MobileNav = ({ onToggle }: { onToggle: () => void }) => {
    return (
        <Stack
            bg={useColorModeValue('white', 'gray.800')}
            p={4}
            display={{ md: 'none' }}
        >
            {NAV_ITEMS.map(navItem => (
                <MobileNavItem
                    key={navItem.label}
                    onToggle={onToggle}
                    {...navItem}
                />
            ))}
        </Stack>
    )
}

const MobileNavItem = ({ label, to, onToggle }: NavItem) => {
    return (
        <Stack spacing={4}>
            <Flex
                py={2}
                as={RouterLink}
                to={to}
                justify={'space-between'}
                align={'center'}
                _hover={{
                    textDecoration: 'none',
                }}
                onClick={onToggle}
            >
                <Text
                    fontWeight={600}
                    color={useColorModeValue('gray.600', 'gray.200')}
                >
                    {label}
                </Text>
            </Flex>
        </Stack>
    )
}

interface NavItem {
    label: string
    to: string
    onToggle: () => void
}

const NAV_ITEMS: Array<Omit<NavItem, 'onToggle'>> = [
    {
        label: 'Explore Code NFTs',
        to: '/',
    },

    {
        label: 'Mint Code NFT',
        to: '/mint',
    },
    {
        label: 'My Code NFTs',
        to: '/my-code-nfts',
    },
]
