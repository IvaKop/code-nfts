import { Box, Heading, Container, Text, Stack } from '@chakra-ui/react'

import Auth from '../components/Auth'

const Welcome = () => {
    return (
        <Container maxW={'3xl'}>
            <Stack
                as={Box}
                textAlign={'center'}
                spacing={{ base: 8, md: 14 }}
                py={{ base: 20, md: 36 }}
            >
                <Heading
                    fontWeight={800}
                    fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
                    lineHeight={'110%'}
                >
                    <Text as={'span'} position={'relative'}>
                        Turn your code ideas
                    </Text>
                    <br />
                    <Text as={'span'} color={'green.400'}>
                        into Code NFTs
                    </Text>
                </Heading>
                <Text color={'gray.500'}>
                    Transform your code snippets into one of a kind
                    randomly-themed Code NFTs.
                </Text>
                <Stack
                    direction={'column'}
                    spacing={3}
                    align={'center'}
                    alignSelf={'center'}
                    position={'relative'}
                >
                    <Auth />
                </Stack>
            </Stack>
        </Container>
    )
}

export default Welcome
