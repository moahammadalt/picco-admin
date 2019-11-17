import React, { useState } from 'react';
import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, 
     {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image',],
  ],
  clipboard: {
    matchVisual: false,
  }
}

const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video'
]

function RichInput({ placeholder = '', onChangeHandler}) {
  const [ editorHtml, setEditorHtml ] = useState('');

  const handleChange = (html) => {
    setEditorHtml(html);
    onChangeHandler(html);
  }

  return (
    <ReactQuill 
      onChange={handleChange}
      value={editorHtml}
      modules={modules}
      formats={formats}
      placeholder={placeholder}
    />
   )
}

export default RichInput;