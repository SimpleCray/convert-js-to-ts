import { forwardRef, useImperativeHandle, useRef } from 'react';
import { SPEECH_RECOGNITION_TIMEOUT } from 'src/config-global';

const AISpeechToText = ({ onTranscriptChange, onListeningStatusChange, onProcessingStatusChange, handleSendMessage }, ref) => {
	// let recognition;
	// let timeoutId;
	// Refs so they're accessible in the stop function
	const recogRef = useRef(null);
	const timerRef = useRef(null);

	const messageRef = useRef('');

	const speechEndTimer = useRef(null);

	const isFinalRef = useRef(false);

	useImperativeHandle(ref, () => ({
		startListening,
		stopListening,
	}));

	const startListening = () => {
		if (recogRef.current) return; // Don't start another recognition if it's already started

		window.SpeechRecognition = window.SpeechRecognition || window?.webkitSpeechRecognition;
		recogRef.current = new window.SpeechRecognition();

		recogRef.current.interimResults = true;
		recogRef.current.continuous = true; // Keep listening even if the user pauses

		recogRef.current.addEventListener('result', async (e) => {
			isFinalRef.current = e.results[0].isFinal;
			clearTimeout(speechEndTimer.current);
			speechEndTimer.current = null;
			const transcript = Array.from(e.results)
				.map((result) => result[0])
				.map((result) => result.transcript)
				.join('');

			// Show rec result in console for debugging:
			const resultType = isFinalRef.current ? 'Final' : 'Intermediate';
			// console.log(`[VUI] ${resultType} recognition result:`, transcript);

			// Suspect it might be triggering this event but not detecting any actual words
			// The transcript is empty but it still proceeds past here and kills the listener and the result is nothing
			if (transcript.length) {
				// Show updated rec result in the front-end:
				const realTranscript = await onTranscriptChange(transcript);
				messageRef.current = realTranscript;
				speechEndTimer.current = setTimeout(() => {
					stopListening();
				}, 1000);
			}
		});

		recogRef.current.addEventListener('audiostart', () => {
			// console.log('[VUI] Setting listening to TRUE, because we got audiostart');
			onListeningStatusChange(true);
			onProcessingStatusChange(false);
		});

		recogRef.current.addEventListener('end', (e) => {
			// Restart the recognition if it has ended before the 30 seconds
			// if (timeoutId) recognition.start();
			if (isFinalRef.current) {
				// console.log('[VUI] Setting listening to FALSE, because we got FINAL rec result');
				clearTimeout(timerRef.current); // Clear the safety timeout, so we don't fire stopListening twice
				onListeningStatusChange(false);
				onProcessingStatusChange(false);
				handleSendMessage({ e, messageProp: messageRef.current });
				messageRef.current = null;
				isFinalRef.current = null;
			}
		});

		recogRef.current.start();
		// This is not true
		// onListeningStatusChange(true); // Notify that listening has started

		// Stop recognition after 30 seconds
		timerRef.current = setTimeout(() => {
			recogRef.current.stop();
			recogRef.current = null;
			clearTimeout(timerRef.current);
			timerRef.current = null;
			// console.log('[VUI] Setting listening to FALSE, because we got 30 sec max speech timeout');
			onListeningStatusChange(false); // Notify that listening has stopped
			onProcessingStatusChange(false);
		}, SPEECH_RECOGNITION_TIMEOUT * 1000);
	};

	const stopListening = (e) => {
		// If these aren't real then there's nothing to stop
		if (!recogRef.current || !timerRef.current) return;
		recogRef.current.stop();
		recogRef.current = null;
		clearTimeout(timerRef.current);
		// Set another timeout of 2.5 seconds for those cases where a final result never comes back (e.g. when the user did not speak at all):
		timerRef.current = setTimeout(() => {
			clearTimeout(timerRef.current);
			timerRef.current = null;
			// console.log('[VUI] Setting listening to FALSE, because we got 2.5 sec safety timeout');
			onListeningStatusChange(false); // Notify that listening has stopped
			onProcessingStatusChange(false);
		}, 2500);
	};
};
export default forwardRef(AISpeechToText);
