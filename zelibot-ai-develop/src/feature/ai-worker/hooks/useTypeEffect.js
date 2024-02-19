import { useEffect, useState } from 'react';

export default function Typewriter(text, speed = 50, delay = 0) {
	const [completedTyping, setCompletedTyping] = useState(false);
	const [displayResponse, setDisplayResponse] = useState('');
	text = text?.text;

	useEffect(() => {
		if (!text?.length) {
			return;
		}

		setCompletedTyping(false);

		let i = 0;
		const stringResponse = text;

		const intervalId = setInterval(() => {
			setDisplayResponse(stringResponse.slice(0, i));

			i++;

			if (i > stringResponse.length) {
				clearInterval(intervalId);
				setCompletedTyping(true);
			}
		}, speed);

		return () => clearInterval(intervalId);
	}, [text]);

	return displayResponse;
}
