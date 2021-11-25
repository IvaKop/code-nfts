import { useEffect, useState } from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'
import { useRef } from 'react'

import { useScreenshot } from 'use-react-screenshot'
import controls from './Controls.svg'
import {
    Box,
    Image,
    Button,
    Center,
    Input,
    Select,
    Heading,
    Text,
    useToast,
    Textarea,
} from '@chakra-ui/react'
import { useMoralisFile, useMoralis } from 'react-moralis'
import { useLocation } from 'react-router'
import { ethers, Contract } from 'ethers'
import codeNFTs from '../artifacts/contracts/CodeNFTs.sol/CodeNFTs.json'

// Modes
require('codemirror/mode/xml/xml')
require('codemirror/mode/javascript/javascript')
require('codemirror/mode/python/python')
require('codemirror/mode/css/css')
require('codemirror/mode/erlang/erlang')
require('codemirror/mode/yaml/yaml')
require('codemirror/mode/php/php')
require('codemirror/mode/ruby/ruby')
require('codemirror/mode/markdown/markdown')

// Themes
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/theme/ayu-mirage.css'
import 'codemirror/theme/base16-dark.css'
import 'codemirror/theme/blackboard.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/theme/bespin.css'
import 'codemirror/theme/icecoder.css'
import 'codemirror/theme/yonce.css'
import 'codemirror/theme/moxer.css'
import 'codemirror/theme/monokai.css'

import './CodeEditor.css'

const languages = [
    { value: 'css', label: 'CSS' },
    { value: 'erlang', label: 'Erlang' },
    { value: 'go', label: 'Go' },
    { value: 'xml', label: 'HTML' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'php', label: 'PHP' },
    { value: 'python', label: 'Python' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'rust', label: 'Rust' },
    { value: 'yaml', label: 'YAML' },
]

const themes = [
    { id: 1, value: 'material', label: 'Material' },
    { id: 2, value: 'ayu-mirage', label: 'AyuMirage' },
    { id: 3, value: 'base16-dark', label: 'Base16Dark' },
    { id: 4, value: 'blackboard', label: 'Blackboard' },
    { id: 5, value: 'dracula', label: 'Dracula' },
    { id: 6, value: 'bespin', label: 'Bespin' },
    { id: 7, value: 'icecoder', label: 'Icecoder' },
    { id: 8, value: 'yonce', label: 'Yonce' },
    { id: 9, value: 'moxer', label: 'Moxer' },
    { id: 10, value: 'monokai', label: 'Monokai' },
]

const Mint = () => {
    const location = useLocation()
    const toast = useToast()
    const ref = useRef(null)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [theme, setTheme] = useState(null)
    const [tokenId, setTokenId] = useState(null)
    const [language, setLanguage] = useState('javascript')
    const [codeMirrorValue, setCodeMirrorValue] = useState(
        'function mintMyAwesomeCodeNFT(){\n  // Write some amazing code here! \n}',
    )

    const [gameContract, setGameContract] = useState<null | Contract>(null)
    const [isMinting, setIsMinting] = useState(false)

    const [, takeScreenshot] = useScreenshot()
    const { saveFile } = useMoralisFile()
    const { user } = useMoralis()

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
        const onTokenMint = async (
            sender: string,
            tokenId: any,
            themeId: any,
        ) => {
            console.log(
                `NFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} themeId: ${themeId.toNumber()}}`,
            )

            if (
                sender.toLowerCase() ===
                user?.attributes.ethAddress.toLowerCase()
            ) {
                setTheme(themeId.toNumber())
                setTokenId(tokenId.toNumber())
            }
        }

        if (gameContract) {
            gameContract.on('NFTMinted', onTokenMint)
        }

        return () => {
            if (gameContract) {
                gameContract.off('NFTMinted', onTokenMint)
            }
        }
    }, [gameContract, user])

    useEffect(() => {
        const getImage = () => takeScreenshot(ref.current)
        if (tokenId && theme && isMinting) {
            const setTokenURI = async () => {
                const newImage = await getImage()
                const uploadMetadata = async () => {
                    if (newImage) {
                        const imageFile = await saveFile(
                            'codeNFT.png',
                            { base64: newImage },
                            { saveIPFS: true },
                        )
                        const metadata = {
                            name,
                            description,
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            image: imageFile?._ipfs,
                            background_color: '#000000',
                            attributes: [
                                {
                                    trait_type: 'Language',
                                    value: languages.find(
                                        ({ value }) => language === value,
                                    )?.label,
                                },
                                {
                                    trait_type: 'Code theme',
                                    value: themes.find(({ id }) => theme === id)
                                        ?.label,
                                },
                            ],
                        }
                        const metadataFile = await saveFile(
                            'metadata.json',
                            { base64: btoa(JSON.stringify(metadata)) },
                            { saveIPFS: true },
                        )

                        return metadataFile
                    }
                }
                const metadata = await uploadMetadata()

                if (metadata && gameContract) {
                    try {
                        const mintTxn = await gameContract.setTokenURI(
                            tokenId,
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            `ipfs://${metadata._hash}`,
                        )
                        await mintTxn.wait()
                        console.log('uriTxn:', mintTxn)
                        setIsMinting(false)
                        toast({
                            title: 'Code NFT successfully minted',
                            description:
                                "You've successfully minted your Code NFT",
                            status: 'success',
                            duration: 9000,
                            isClosable: true,
                        })
                    } catch (error) {
                        console.warn('URIAction Error:', error)
                        setIsMinting(false)
                        toast({
                            title: 'An error occured',
                            description:
                                'An error occured while minting your NFT',
                            status: 'error',
                            duration: 9000,
                            isClosable: true,
                        })
                    }
                }
                setTokenId(null)
                setTheme(null)
            }
            setTokenURI()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenId, theme, name, gameContract, isMinting, language])

    const mint = async () => {
        try {
            if (gameContract) {
                setIsMinting(true)
                console.log('Minting in progress...')
                const mintTxn = await gameContract.requestRandomTheme()
                console.log('mintTxn:', mintTxn)
                await mintTxn.wait()
            }
        } catch (error) {
            console.warn('MintAction Error:', error)
            setIsMinting(false)
        }
    }

    const codeMirror = (
        <Box
            ref={ref}
            position="absolute"
            w="2xl"
            top="-100000"
            left="-10000"
            margin="auto"
            bgColor="black"
        >
            <Image
                className="controls"
                src={controls}
                m={1.5}
                position="relative"
            />
            <CodeMirror
                onBeforeChange={(_editor, _data, value) => {
                    setCodeMirrorValue(value)
                }}
                value={codeMirrorValue}
                options={{
                    mode: language,
                    theme:
                        themes.find(({ id }) => theme === id)?.value ||
                        'material',
                    lineNumbers: true,
                    lineWrapping: true,
                }}
            ></CodeMirror>
        </Box>
    )

    if (location.pathname !== '/mint') {
        return codeMirror
    }

    return (
        <Box w="100%" p={2}>
            <Box
                borderWidth="1px"
                rounded="lg"
                shadow="lg"
                maxW="3xl"
                mx="auto"
                my={8}
            >
                <Box maxW="2xl" margin="auto" my={8} p={2}>
                    <Heading textAlign="center">
                        Mint your{' '}
                        <Text as="span" color={'green.400'} fontWeight={800}>
                            Code NFT!
                        </Text>
                    </Heading>
                    <Input
                        mt={10}
                        placeholder="What is the name of your Code NFT?"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <Textarea
                        mt={4}
                        placeholder="Add a description for your Code NFT"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        resize="none"
                    />
                    <Select
                        my={4}
                        value={language}
                        onChange={e => setLanguage(e.target.value)}
                    >
                        {languages.map(({ label, value }) => (
                            <option value={value} key={value}>
                                {label}
                            </option>
                        ))}
                    </Select>

                    <Box maxW="2xl">
                        <Box borderWidth="1px" margin="auto">
                            <Image
                                className="controls"
                                src={controls}
                                m={1.5}
                                position="relative"
                            />
                            <CodeMirror
                                onBeforeChange={(_editor, _data, value) => {
                                    setCodeMirrorValue(value)
                                }}
                                options={{
                                    mode: language,
                                    theme: 'material',
                                    lineNumbers: true,
                                    lineWrapping: true,
                                }}
                                onChange={(_editor, _data, value) => {
                                    !isMinting && setCodeMirrorValue(value)
                                }}
                                value={codeMirrorValue}
                            />
                        </Box>
                    </Box>

                    <Box>
                        <Center mt="5">
                            <Button
                                onClick={mint}
                                bg={'green.400'}
                                color="white"
                                _hover={{
                                    bg: 'green.300',
                                }}
                                isLoading={isMinting}
                            >
                                Mint Code NFT
                            </Button>
                        </Center>
                    </Box>
                    {codeMirror}
                </Box>
            </Box>
        </Box>
    )
}

export default Mint
