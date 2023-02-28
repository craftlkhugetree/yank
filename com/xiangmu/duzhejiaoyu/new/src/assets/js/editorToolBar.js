export let defaultBar =  [
  [{ 'header': [false, 1, 2, 3, 4, 5, 6, ] }],
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  [{'align': ['','center','right','justify']}],
  ['blockquote'],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  ['link', 'image'],
  ['clean'],                                     // remove formatting button
]