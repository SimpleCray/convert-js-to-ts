import OutputCard from '../OutputCard';
import { Stack, Button, Typography, Accordion, AccordionSummary, AccordionDetails, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import GroupIcon from '@mui/icons-material/Group';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RemoveIcon from '@mui/icons-material/Remove';
import UserFeedback from '../../../../../components/user-feedback/UserFeedback';

export default function LiveInterviewSummaryOutputCard({ type, event_id, handleCardClose, ...props }) {
	const theme = useTheme();

	const closeThiscard = () => {
		handleCardClose(props)
	}

	return (
		<OutputCard title={'Live Interview Summary'} titleIcon={<GroupIcon />} closeCard={closeThiscard} {...props}>
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
					<Typography>Interviewers' Feedback</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Typography variant={'body1'} gutterBottom>
						<strong>Sam</strong>: "I was impressed by Anthony's in-depth understanding of our marketing strategies. He shared insightful suggestions for optimizing our campaigns and demonstrated a passion for driving results."
					</Typography>
					<Typography variant={'body1'} gutterBottom>
						<strong>Denver</strong>: "Anthony's teamwork skills stood out to me. He actively engaged with all of us, listening attentively and offering valuable contributions to our discussions. His ability to collaborate is definitely an asset."
					</Typography>
					<Typography variant={'body1'} gutterBottom>
						<strong>Jane</strong>: "During our scenario-based questions, Anthony's problem-solving approach was evident. He walked us through his analysis step-by-step, showcasing his critical thinking and strategic mindset."
					</Typography>
					<Typography variant={'body1'} gutterBottom>
						<strong>Angus</strong>: "I was intrigued by Anthony's leadership potential. His experience in managing teams shone through, and he articulated his leadership style clearly. He could be a valuable mentor within our department."
					</Typography>
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
					<Typography>Key Observations from Live Interview</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<ListItem>
						<ListItemIcon>
							<RemoveIcon />
						</ListItemIcon>
						<ListItemText primary="Engagement with Company Vision: Anthony demonstrated a deep understanding of our company's mission and vision. He expressed genuine excitement about contributing to our goals and was able to align his experiences with our company values." />
					</ListItem>
					<ListItem>
						<ListItemIcon>
							<RemoveIcon />
						</ListItemIcon>
						<ListItemText primary='Collaborative Mindset: During the group interview, Anthony displayed strong interpersonal skills and a willingness to collaborate. He actively listened to his interviewers and offered thoughtful responses that showed his ability to work effectively with a team.' />
					</ListItem>
					<ListItem>
						<ListItemIcon>
							<RemoveIcon />
						</ListItemIcon>
						<ListItemText primary='Problem-Solving Approach: In response to scenario-based questions, Anthony showcased his analytical thinking and problem-solving skills. He methodically outlined strategies to address challenges, highlighting his strategic mindset.' />
					</ListItem>
					<ListItem>
						<ListItemIcon>
							<RemoveIcon />
						</ListItemIcon>
						<ListItemText primary="Leadership Potential: Anthony's leadership qualities came to light during the discussion about his previous team management experiences. His approach to guiding and motivating his team members indicated potential for taking on leadership roles in the future." />
					</ListItem>
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
					<Typography>Positive Aspects from the Live Interview</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<ListItem>
						<ListItemIcon>
							<RemoveIcon />
						</ListItemIcon>
						<ListItemText primary="Alignment with Company Values: Anthony's enthusiasm for our company's mission and his eagerness to contribute to our growth align well with our values." />
					</ListItem>
					<ListItem>
						<ListItemIcon>
							<RemoveIcon />
						</ListItemIcon>
						<ListItemText primary='Effective Team Collaboration: His ability to engage with multiple interviewers and provide thoughtful responses showcased his strong teamwork and communication skills.' />
					</ListItem>
					<ListItem>
						<ListItemIcon>
							<RemoveIcon />
						</ListItemIcon>
						<ListItemText primary="Adaptive Problem-Solving: Anthony's strategic thinking and problem-solving approach demonstrated his capability to navigate challenges effectively." />
					</ListItem>
					<ListItem>
						<ListItemIcon>
							<RemoveIcon />
						</ListItemIcon>
						<ListItemText primary='Leadership Qualities: His discussion of team management experiences highlighted his potential as a future leader within our marketing team.' />
					</ListItem>
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
					<Typography>Areas of Continued Interest</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<ListItem>
						<ListItemIcon>
							<RemoveIcon />
						</ListItemIcon>
						<ListItemText primary="Detail-Oriented Approach: Exploring Anthony's attention to detail in executing marketing campaigns would further assess his commitment to delivering high-quality results." />
					</ListItem>
					<ListItem>
						<ListItemIcon>
							<RemoveIcon />
						</ListItemIcon>
						<ListItemText primary='Client Interaction: Understanding more about his experience in client interactions and relationship management will help determine his suitability for the client-facing aspect of the role.' />
					</ListItem>
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
					<Typography>Recommendation</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Typography variant={'body1'}>
						Following the live interview, it is evident that Anthony Stewart possesses a strong alignment with our company values, effective collaborative skills, and a strategic mindset. The additional insights gained from the interview reinforce his suitability for the Marketing
						Account Manager position. I recommend considering the next steps in the hiring process to further evaluate his potential contributions to our team.
					</Typography>
				</AccordionDetails>
			</Accordion>
			<Stack direction='row' justifyContent='flex-end' alignItems='center' gap={2} mt={2}>
				<UserFeedback type={type} event_id={event_id} />
			</Stack>
		</OutputCard>
	);
}
