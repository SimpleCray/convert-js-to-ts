import OutputCard from '../OutputCard';
import Quicksight from 'src/feature/quicksight/Quicksight';

export default function QuicksightOutputCard({ body, outputCardAction, target_path, prompts, setIsPromptsOpen, dashboard, ...props }) {
    return (
		<OutputCard {...props} showActions={false} isATSCard sx={{ maxWidth: '100%' }} title={props.title ?? 'Report'}>
			{/* <Quicksight dashboard={dashboard || 'candidates'} /> */}
			<Quicksight dashboard={target_path} />
		</OutputCard>
	);
}