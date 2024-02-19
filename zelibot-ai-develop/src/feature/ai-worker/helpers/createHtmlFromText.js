export const createHtmlFromText = (text) =>
	text
		.replace(/\n/g, '<br />')
		.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
		.replace(/\*(.*?)\*/g, '<em>$1</em>');
