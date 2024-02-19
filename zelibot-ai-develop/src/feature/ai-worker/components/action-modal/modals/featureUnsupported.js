import { styled } from '@mui/material/styles';
import { Typography, Box, Stack } from '@mui/material';
import EngineeringRoundedIcon from '@mui/icons-material/EngineeringRounded';
import { StyledButton } from '../../output-card/cards/CardStyles';

const StyledIcon = styled(EngineeringRoundedIcon)(({ theme }) => ({
    width: theme.spacing(16),
    height: theme.spacing(16),
    color: 'unset',
}));

const FeatureUnsupported = ({ onClose }) => {

    const handleClick = async () => {
        await onClose();
    }

    return (
        <Box>
            <Box sx={{ padding: (theme) => theme.spacing(8) }}>
                <Stack direction="column" justifyContent='center' alignItems='center' gap={4}>
                    <Box sx={{ color: (theme) => theme.palette.grey[400] }}>
                        <StyledIcon />
                    </Box>
                    <Typography variant='body' textAlign='center'>
                        We are striving to deliver this feature shortly.
                        <br />
                        We are currently in the process
                        <br/>
                        of perfecting its execution.
                    </Typography>
                    <StyledButton
                        variant='contained'
                        onClick={handleClick}
                    >
                        OK
                    </StyledButton>
                </Stack>
            </Box>
        </Box>
    )
};

export default FeatureUnsupported;