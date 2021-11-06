import { UnControlled as CodeMirror } from 'react-codemirror2'
require('codemirror/mode/xml/xml')
require('codemirror/mode/javascript/javascript')

//'3024-night', 'abcdef', 'ambiance', 'base16-dark', 'bespin', 'blackboard', 'cobalt', 'colorforth', 'dracula', 'erlang-dark', 'hopscotch', 'icecoder', 'isotope', 'lesser-dark', 'liquibyte', 'material', 'mbo', 'mdn-like', 'monokai'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/theme/3024-night.css'
import 'codemirror/theme/ambiance.css'
import 'codemirror/theme/bespin.css'

import './CodeEditor.css'
const CodeEditor = () => {
    return (
        <CodeMirror
            value="<h1>I ♥ react-codemirror2</h1>"
            options={{
                mode: 'javascript',
                theme: 'bespin',
                lineNumbers: true,
                lineWrapping: true,
            }}
            //  onChange={(editor, data, value) => {}}
        />
    )
}

export default CodeEditor
