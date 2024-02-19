import OutputCard from '../OutputCard';
import UploadFiles from '../../upload-files';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';

export default function OutputCardUpload({ title = 'Upload documents',handleCardClose, ...props }) {

	const closeThiscard = () => {
		handleCardClose(props)
	}

	return (
		<OutputCard isATSCard title={title} titleIcon={<UploadFileOutlinedIcon />} closeCard={closeThiscard} {...props}>
			<UploadFiles {...props} />
		</OutputCard>
	);
}
