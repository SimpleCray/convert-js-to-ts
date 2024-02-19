import { Stack, Typography, IconButton } from '@mui/material';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import VideoCameraFrontRoundedIcon from '@mui/icons-material/VideoCameraFrontRounded';

const Contact = (props) => {
    const { title, email, phone, videoLink } = props;

    return (
        <Stack direction='column' justifyContent='center' alignItems='center'>
            <Typography variant='body2' fontWeight={600}>{title}</Typography>
            <Stack direction='row' spacing={1}>
                {email && (
                    <IconButton sx={{ color: (theme) => theme.palette.primary.main }} href='#' onClick={(e) => {
                        window.location.href = 'mailto:' + email;
                        e.preventDefault();
                    }}>
                        <MailOutlineRoundedIcon />
                    </IconButton>
                )}
                {phone && (
                    <IconButton sx={{ color: (theme) => theme.palette.primary.main }} href='#' onClick={(e) => {
                        window.location.href = 'tel:' + phone;
                        e.preventDefault();
                    }}>
                        <PhoneOutlinedIcon />
                    </IconButton>
                )}
                {videoLink && (
                    <IconButton sx={{ color: (theme) => theme.palette.primary.main }} href='#'>
                        <VideoCameraFrontRoundedIcon />
                    </IconButton>
                )}
            </Stack>
        </Stack>
    );
}

export default Contact;