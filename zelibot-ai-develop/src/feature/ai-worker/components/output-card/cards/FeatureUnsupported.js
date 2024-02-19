import { useEffect } from 'react';
import OutputCard from '../OutputCard';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

const FeatureUnsupportedOutputCard = ({ outputCardAction, title, ...rest }) => {
    const { id } = rest;

	useEffect(() => {
		outputCardAction(id, 'FEATURE_UNSUPPORTED', undefined);
	}, []);

    return (
        // <OutputCard title="Feature unsupported" titleIcon={<PriorityHighIcon />} isATSCard {...rest}>
            <></>
		// </OutputCard>
    )
}

export default FeatureUnsupportedOutputCard;