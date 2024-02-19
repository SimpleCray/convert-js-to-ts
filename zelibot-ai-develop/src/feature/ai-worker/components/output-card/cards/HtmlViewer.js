import { Typography } from '@mui/material';
import OutputCard from '../OutputCard';
import Markdown from 'src/components/markdown/Markdown';

export default function DefaultOutputCard({ body, handleCardClose, ...props }) {

	const closeThiscard = () => {
		handleCardClose(props)
	}

	return <OutputCard {...props} closeCard={closeThiscard}>{body && <Markdown>{body.replaceAll('\n', '<br>')}</Markdown>}</OutputCard>;
}
