import { Box, Container, styled, Typography } from "@mui/material";

export const Section = styled(Box)({
    backgroundImage: 'url(/assets/images/hero-gradient-bg-2.jpg)',
    backgroundColor: 'lightgray 50%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    width: '100%',
});

export const CenterBox = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
});

export const StyledTypography = styled(Typography)(({ theme, variant = 'body1' }) => {
    switch (variant) {
        case 'h1':
            return {
                color: theme.palette.common.white,
                textAlign: 'center',
                fontWeight: 400,
                lineHeight: 1.3,
                letterSpacing: -0.6,
                [theme.breakpoints.down('sm')]: {
                    fontSize: 32,
                    letterSpacing: 1,
                    marginBottom: theme.spacing(6),
                },
                [theme.breakpoints.up('sm')]: {
                    fontSize: 60,
                    margin: `${theme.spacing(4)} 0`,
                },
            };
        case 'h2':
            return {
                color: theme.palette.common.white,
                textAlign: 'center',
                fontWeight: 400,
                lineHeight: 1.3,
                letterSpacing: -0.48,
                [theme.breakpoints.down('sm')]: {
                    fontSize: 32,
                    letterSpacing: 1,
                },
                [theme.breakpoints.up('sm')]: {
                    fontSize: 48,
                },
            };
        case 'subtitle1':
            return {
                color: theme.palette.common.white,
                fontSize: 18,
                fontWeight: 400,
                lineHeight: 1.3,
                [theme.breakpoints.up('sm')]: {
                    textAlign: 'center',
                },
            };
        case 'h4':
            return {
                fontSize: '44px !important',
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: -0.5,
            };
        case 'subtitle2':
            return {
                fontSize: 16,
                fontWeight: 600,
                lineHeight: 1.4,
            };
        case 'body1':
            return {
                fontSize: 16,
                fontWeight: 400,
                lineHeight: 1.4,
            };
        case 'caption':
            return {
                fontSize: 12,
                fontWeight: 400,
                lineHeight: 1.4,
            };
        default:
            return {};
    };
});

export const StyledContainer = styled(Container)({
    maxWidth: '970px !important',
});
