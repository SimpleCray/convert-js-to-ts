import CreateNewJobRevamp from '../../feature/ai-worker/components/output-card/cards/CreateNewJobRevamp';

const EditJobOpeningModal = ({ onCloseModal, data }) => {
	const { jobOpeningDetails, setRefetchData } = data;
	return <CreateNewJobRevamp isEditing jobOpeningDetails={jobOpeningDetails} onCloseModal={onCloseModal} setRefetchData={setRefetchData} />;
};

export default EditJobOpeningModal;
