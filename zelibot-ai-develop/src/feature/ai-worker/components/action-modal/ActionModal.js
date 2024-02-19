import { Card, styled } from '@mui/material';
import { ComposeEmailModal, ComposeSMSModal, ComposeTextModal, FeatureUnsupported } from './modals';
import { CustomInnerModal, CustomModalWrapper, StyledModal, StyledModalInner, StyledModalWrapper } from './ActionModalStyles';
import { DashboardUserSettings } from 'src/feature/dashboard/';
import ConversationSummary from '../output-card/cards/ConversationSummary';
import CandidateDetails from '../output-card/cards/CandidateDetails';
import EditClientCard from '../output-card/cards/EditClientCard';
import PaymentStatus from 'src/feature/ai-worker/components/output-card/cards/PaymentStatus';
import ShowSubscriptionNeeded from 'src/feature/ai-worker/components/output-card/cards/ShowSubscriptionNeeded';
import Dialog from '@mui/material/Dialog';
import { Modal } from "../../../../components/modal";
import { useSelector } from 'react-redux';

const SettingsModal = styled(Modal)({
	'& .MuiContainer-root': {
		width: 950,
	},
});

export default function ActionModal({ actionModalData, type, open, onClose, setStateShouldUpdate, ...props }) {
	const modalData = useSelector((state) => state.modal.data)
	
	const modalContent = () => {
		switch (type) {
			case 'COMPOSE_EMAIL':
				return <ComposeEmailModal {...props} onClose={onClose} />;
			case 'COMPOSE_TEXT':
				return <ComposeTextModal {...props} onClose={onClose} />;
			case 'COMPOSE_SMS':
				return <ComposeSMSModal {...props} onClose={onClose} />;
			case 'FEATURE_UNSUPPORTED':
				return <FeatureUnsupported {...props} onClose={onClose} />;
			case 'CONVERSATION_SUMMARY':
				return <ConversationSummary {...props} onClose={onClose} />;
			case 'SETTINGS':
				return <DashboardUserSettings activeTab={actionModalData} {...props} onClose={onClose} setStateShouldUpdate={setStateShouldUpdate} />;
			case 'EDIT CANDIDATE':
				return <CandidateDetails modalData={modalData} {...props} onClose={onClose} setStateShouldUpdate={setStateShouldUpdate} />
			case 'EDIT CLIENT':
				return <EditClientCard {...props} onClose={onClose} setStateShouldUpdate={setStateShouldUpdate} />;
			case 'PAYMENT_STATUS':
				return <PaymentStatus {...props} onClose={onClose}></PaymentStatus>;
			case 'SHOW_SUBSCRIPTION':
				return <ShowSubscriptionNeeded {...props} onClose={onClose}></ShowSubscriptionNeeded>;
			default:
				return null;
		}
	};

	if (type === 'SETTINGS') {
		return (
			<SettingsModal open={open} onClose={onClose} title='Settings'>
				{modalContent()}
			</SettingsModal>
		);
	}

	if (type === 'EDIT CANDIDATE' || type === 'EDIT CLIENT') {
		return (
			<StyledModal open={open} onClose={onClose}>
				<CustomModalWrapper>
					<CustomInnerModal>
						<Card>{modalContent()}</Card>
					</CustomInnerModal>
				</CustomModalWrapper>
			</StyledModal>
		);
	}

	if (type === 'CONVERSATION_SUMMARY') {
		return (
			<StyledModal open={open} onClose={onClose}>
				<CustomModalWrapper sx={{ backgroundColor: 'transparent' }}>
					<CustomInnerModal sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} minWidth={{ xs: '100%', md: '1000px' }}>
						<Card sx={{ width: '100%' }}>{modalContent()}</Card>
					</CustomInnerModal>
				</CustomModalWrapper>
			</StyledModal>
		);
	}

	if (type === 'PAYMENT_STATUS' || type === 'SHOW_SUBSCRIPTION') {
		return (
			<Dialog open={open} onClose={onClose}>
				<div>
					<div>
						<Card>{modalContent()}</Card>
					</div>
				</div>
			</Dialog>
		);
	}

	return (
		<StyledModal open={open} onClose={onClose}>
			<StyledModalWrapper>
				<StyledModalInner>
					<Card>{modalContent()}</Card>
				</StyledModalInner>
			</StyledModalWrapper>
		</StyledModal>
	);
}
