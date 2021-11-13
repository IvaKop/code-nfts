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
} from '@chakra-ui/react'
import { useMoralisFile } from 'react-moralis'

// web3 magic
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

//'3024-night', 'abcdef', 'ambiance', 'base16-dark', 'bespin', 'blackboard', 'cobalt', 'colorforth', 'dracula', 'erlang-dark', 'hopscotch', 'icecoder', 'isotope', 'lesser-dark', 'liquibyte', 'material', 'mbo', 'mdn-like', 'monokai'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
// import 'codemirror/theme/3024-night.css'
// import 'codemirror/theme/ambiance.css'
// import 'codemirror/theme/bespin.css'
// import 'codemirror/theme/base16-light.css'

import './CodeEditor.css'

const languages = [
    { value: 'css', label: 'CSS' },
    { value: 'erlang', label: 'Erlang' },
    { value: 'go', label: 'Go' },
    { value: 'xml', label: 'HTML' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'markdown', label: 'Markdowm' },
    { value: 'php', label: 'PHP' },
    { value: 'python', label: 'Python' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'rust', label: 'Rust' },
    { value: 'yaml', label: 'YAML' },
]

const CodeEditor = () => {
    const ref = useRef(null)
    const [name, setName] = useState('')
    const [language, setLanguage] = useState('javascript')
    const [codeMirrorValue, setCodeMirrorValue] = useState(
        'function mintMyAwesomeCodeNFT(){\n// White some amazing code here! \n}',
    )

    const [gameContract, setGameContract] = useState<null | Contract>(null)
    const [isMinting, setIsMinting] = useState(false)

    const [image, takeScreenshot] = useScreenshot()
    const getImage = () => takeScreenshot(ref.current)

    const { saveFile } = useMoralisFile()

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
            const uploadMetadata = async () => {
                if (image) {
                    const imageFile = await saveFile(
                        'image.png',
                        { base64: image },
                        { saveIPFS: true },
                    )
                    const metadata = {
                        name: name,
                        description:
                            'This is a Code NFT - a custom made and unique code snippet',
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        image: imageFile?._ipfs,
                        attributes: {
                            language: languages.find(
                                ({ value }) => language === value,
                            )?.label,
                            theme: 'material',
                        },
                    }
                    const metadataFile = await saveFile(
                        'metadata.json',
                        { base64: btoa(JSON.stringify(metadata)) },
                        { saveIPFS: true },
                    )

                    console.log(metadataFile)
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
                } catch (error) {
                    console.warn('URIAction Error:', error)
                    setIsMinting(false)
                }
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
    }, [gameContract, image])

    const mint = async () => {
        try {
            getImage()
            if (gameContract) {
                setIsMinting(true)
                console.log('Minting in progress...')
                const mintTxn = await gameContract.mint()
                await mintTxn.wait()
            }
        } catch (error) {
            console.warn('MintAction Error:', error)
            setIsMinting(false)
        }
    }

    return (
        <Box
            borderWidth="1px"
            rounded="lg"
            shadow="lg"
            w="3xl"
            mx="auto"
            my={10}
        >
            <Box w="2xl" margin="auto" my={10}>
                <Heading textAlign="center">
                    Mint your very own Code NFT!
                </Heading>
                <Input
                    mt={10}
                    placeholder="What is the name of your Code NFT?"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <Select
                    my={5}
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                >
                    {languages.map(({ label, value }) => (
                        <option value={value} key={value}>
                            {label}
                        </option>
                    ))}
                </Select>

                <Box w="2xl">
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
                                setCodeMirrorValue(value)
                            }}
                            value={codeMirrorValue}
                        />
                    </Box>
                </Box>

                <Box>
                    <Center mt="5">
                        <Button
                            onClick={mint}
                            bg={'pink.400'}
                            color="white"
                            _hover={{
                                bg: 'pink.300',
                            }}
                            isLoading={isMinting}
                        >
                            Mint Code NFT
                        </Button>
                    </Center>
                </Box>

                <Box
                    ref={ref}
                    position="absolute"
                    w="2xl"
                    top="-100000"
                    left="-10000"
                    borderWidth="1px"
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
                            theme: 'material',
                            lineNumbers: true,
                            lineWrapping: true,
                        }}
                    ></CodeMirror>
                </Box>
            </Box>
            <img src={image} height="300px" />
        </Box>
    )
}

export default CodeEditor
