import OutputCard from '../OutputCard';
import { Stack, Button, Typography, Accordion, AccordionSummary, AccordionDetails, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RemoveIcon from '@mui/icons-material/Remove';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import UserFeedback from '../../../../../components/user-feedback/UserFeedback';

export default function InterviewSummaryOutputCard({ type, event_id, handleCardClose, ...props }) {
	const theme = useTheme();

	const closeThiscard = () => {
		handleCardClose(props)
	}

	return (
		<OutputCard title={'Video Interview Summary'} titleIcon={<VideoCameraFrontIcon />} closeCard={closeThiscard} {...props}>
			<Typography variant={'body1'} gutterBottom>
				<strong>Candidate Summary</strong>: Anthony Stewart
				<br />
				<strong>Position</strong>: Marketing Account Manager
			</Typography>
			<Button variant={'contained'} color={'secondary'} startIcon={<PlayCircleIcon />}>
				Play Recording
			</Button>
			<Accordion defaultExpanded>
				<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
					<Typography>Key Observations</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<ListItem>
						<ListItemIcon>
							<RemoveIcon />
						</ListItemIcon>
						<ListItemText primary='Anthony demonstrated a high level of confidence throughout the interview.' />
					</ListItem>
					<ListItem>
						<ListItemIcon>
							<RemoveIcon />
						</ListItemIcon>
						<ListItemText primary='His enthusiasm for the role and the company was evident in his responses.' />
					</ListItem>
					<ListItem>
						<ListItemIcon>
							<RemoveIcon />
						</ListItemIcon>
						<ListItemText primary='He provided concrete examples of his previous marketing successes, showcasing his expertise.' />
					</ListItem>
					<ListItem>
						<ListItemIcon>
							<RemoveIcon />
						</ListItemIcon>
						<ListItemText primary="Anthony's communication skills are strong; he articulated his ideas clearly and effectively." />
					</ListItem>
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
					<Typography>Strengths</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<ListItem>
						<ListItemIcon>
							<RemoveIcon />
						</ListItemIcon>
						<ListItemText primary="Confidence and Enthusiasm: Anthony's confidence and genuine enthusiasm for the marketing field stood out. His passion for the role is likely to drive results and inspire his team." />
					</ListItem>
					<ListItem>
						<ListItemIcon>
							<RemoveIcon />
						</ListItemIcon>
						<ListItemText primary='Clear Communication: He effectively conveyed his thoughts and experiences, making it easy to understand his professional journey and accomplishments.' />
					</ListItem>
					<ListItem>
						<ListItemIcon>
							<RemoveIcon />
						</ListItemIcon>
						<ListItemText primary='Track Record of Success: Anthony shared specific examples of his marketing campaigns that led to increased engagement and sales, demonstrating his ability to deliver tangible results.' />
					</ListItem>
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
					<Typography>Areas for Further Exploration</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<ListItem>
						<ListItemIcon>
							<RemoveIcon />
						</ListItemIcon>
						<ListItemText primary='Team Collaboration: While Anthony highlighted his individual accomplishments, further probing is recommended to understand his approach to teamwork and collaboration within a marketing team.' />
					</ListItem>
					<ListItem>
						<ListItemIcon>
							<RemoveIcon />
						</ListItemIcon>
						<ListItemText primary='Adaptability: Exploring how Anthony adapts to changing marketing trends and approaches would provide insights into his ability to stay current and innovative.' />
					</ListItem>
					<ListItem>
						<ListItemIcon>
							<RemoveIcon />
						</ListItemIcon>
						<ListItemText primary='Strategic Thinking: Gaining more insights into his strategic planning skills will help evaluate his potential impact on our marketing strategies.' />
					</ListItem>
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
					<Typography>Recommendation</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Typography variant={'body1'}>
						Anthony Stewart is a promising candidate for the Marketing Account Manager position. His confidence, enthusiasm, and track record of success make him a strong fit for our team. I recommend moving forward with a live interview to delve deeper into his collaborative approach,
						adaptability, and strategic thinking.
					</Typography>
				</AccordionDetails>
			</Accordion>
			<Stack direction='row' justifyContent='flex-end' alignItems='center' gap={2} mt={2}>
				<UserFeedback type={type} event_id={event_id} />
			</Stack>
		</OutputCard>
	);
}
