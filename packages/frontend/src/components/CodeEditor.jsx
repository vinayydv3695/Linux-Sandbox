import React from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';

const CodeEditor = ({ fileContent, onFileContentChange }) => {
    return (
        <AceEditor
            mode="javascript"
            theme="monokai"
            onChange={onFileContentChange}
            name="code-editor"
            editorProps={{ $blockScrolling: true }}
            value={fileContent}
            width="100%"
            height="100%"
        />
    );
};

export default CodeEditor;
