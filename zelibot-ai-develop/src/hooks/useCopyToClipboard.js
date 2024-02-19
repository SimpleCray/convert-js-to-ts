import { useState } from 'react';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

function useCopyToClipboard() {
	const [copiedText, setCopiedText] = useState(null);

	const copy = async (text) => {
		// Try to save to clipboard then save it in the state if worked
		try {
			if (!navigator?.clipboard) {
				console.warn('Security settings prevent copying to clipboard');
				return false;
			} else {
				await navigator.clipboard.writeText(text);
				setCopiedText(text);
				return true;
			}
		} catch (error) {
			console.warn('Copy failed', error);
			setCopiedText(null);
			return false;
		}
	};

	return { copiedText, copy };
}

export default useCopyToClipboard;
