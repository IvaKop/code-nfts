import { UnControlled as CodeMirror } from 'react-codemirror2'
import { useRef } from 'react'
import { useScreenshot } from 'use-react-screenshot'
import controls from './Controls.svg'
import { Box, Image } from '@chakra-ui/react'

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
    const ref = useRef(null)
    const [image, takeScreenshot] = useScreenshot()
    const getImage = () => takeScreenshot(ref.current)
    return (
        <Box p={1}>
            <Box
                maxW="3xl"
                ref={ref}
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
                    options={{
                        mode: 'javascript',
                        theme: 'material',
                        lineNumbers: true,
                        lineWrapping: true,
                    }}
                ></CodeMirror>
            </Box>

            <button onClick={getImage}>take screenshot</button>
            <Box maxW="3xl" margin="auto">
                <Image width="100%" src={image} alt="nft image" />
            </Box>
        </Box>
    )
}

export default CodeEditor
