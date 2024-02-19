import OutputCard from '../OutputCard';
import UploadFiles from '../../upload-files';

export default function UploadJobDescriptionOutputCard({ title = 'Upload documents', ...props }) {
	return (
		<OutputCard {...props} title={title} sx={{ width: '60%' }}>
			<UploadFiles showHeading={false} showFileTypes={false} {...props} />
		</OutputCard>
	);
}
