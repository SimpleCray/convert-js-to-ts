import OutputCard from '../OutputCard';
import HrManagerJobDescriptionDisplay from '../../../../hr-manager/HrManagerJobDescriptionDisplay';

export default function JobDescriptionListOutputCard({ target_url, outputCardAction, type, event_id, handleCardClose, ...props }) {
	const closeThiscard = () => {
		handleCardClose(props)
	}
	return (
		<OutputCard {...props} title={'List of Job Descriptions'} showActions={true} closeCard={closeThiscard}>
			<HrManagerJobDescriptionDisplay target_url={target_url} onViewJobDescription={outputCardAction} type={type} event_id={event_id} />
		</OutputCard>
	);
}
