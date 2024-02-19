import OutputCard from '../OutputCard';
import HrManagerListDisplay from '../../../../hr-manager/HrManagerListDisplay';

export default function CandidatesOutputCard({ target_api_endpoint, target_path, clickRequestAction, type, event_id, handleCardClose, ...props }) {

	const closeThiscard = () => {
		handleCardClose(props);
	};
	
	return (
		<OutputCard {...props} title={'List of Candidates'} closeCard={closeThiscard}>
			<HrManagerListDisplay target_api_endpoint={target_api_endpoint} target_path={target_path} onViewResume={clickRequestAction} type={type} event_id={event_id} />
		</OutputCard>
	);
}
