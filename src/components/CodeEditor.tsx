import { useEffect, useState } from 'react'
import { UnControlled as CodeMirror } from 'react-codemirror2'
import { useRef } from 'react'

import { useScreenshot } from 'use-react-screenshot'
import controls from './Controls.svg'
import { Box, Image, Button, Center } from '@chakra-ui/react'
import { useMoralisFile } from 'react-moralis'

// web3 magic
import { ethers, Contract } from 'ethers'
import codeNFTs from '../artifacts/contracts/CodeNFTs.sol/CodeNFTs.json'

require('codemirror/mode/xml/xml')
require('codemirror/mode/javascript/javascript')

//'3024-night', 'abcdef', 'ambiance', 'base16-dark', 'bespin', 'blackboard', 'cobalt', 'colorforth', 'dracula', 'erlang-dark', 'hopscotch', 'icecoder', 'isotope', 'lesser-dark', 'liquibyte', 'material', 'mbo', 'mdn-like', 'monokai'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/theme/3024-night.css'
import 'codemirror/theme/ambiance.css'
import 'codemirror/theme/bespin.css'
import 'codemirror/theme/base16-light.css'

import './CodeEditor.css'

const CodeEditor = () => {
    const [gameContract, setGameContract] = useState<null | Contract>(null)
    const [isMinting, setIsMinting] = useState(false)
    const { saveFile } = useMoralisFile()

    const ref = useRef(null)
    const [image, takeScreenshot] = useScreenshot()
    const getImage = () => takeScreenshot(ref.current)

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
                        name: 'NFT name',
                        description: 'NFT description',
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        image: imageFile?._ipfs,
                        language: 'JavaScript',
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
                        2,
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
        <Box p={1}>
            <Box
                maxW="xl"
                ref={ref}
                borderWidth="1px"
                margin="auto"
                bgColor="black"
                mt={5}
            >
                <Image
                    className="controls"
                    src={controls}
                    m={1.5}
                    position="relative"
                />
                <CodeMirror
                    options={{
                        mode: 'javascript',
                        theme: 'material',
                        lineNumbers: true,
                        lineWrapping: true,
                    }}
                ></CodeMirror>
            </Box>
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
                {/* <Button onClick={upload}>save</Button> */}
            </Center>
            <Box maxW="xl" margin="auto" mt="5">
                <Image width="100%" src={image} alt="nft image" />
            </Box>
        </Box>
    )
}

export default CodeEditor
