import hljs from 'highlight.js';
import 'highlight.js/styles/monokai-sublime.css';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

hljs.configure({
	languages: ['javascript', 'jsx', 'sh', 'bash', 'html', 'scss', 'css', 'json'],
});

if (typeof window !== 'undefined') {
	window.hljs = hljs;
}
