import { Stack, styled } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { CenterBox, Section, StyledContainer, StyledTypography } from "./ComponentStyles";
import { MAIN_SECTION_COMPONENT_ID } from "../constants";
import useResponsive from "../../../hooks/useResponsive";
import { default as AvatarCarousel } from "../../../components/avatar-carousel";

const Container = styled(StyledContainer)(({ theme }) => ({
    height: '100%',
    [theme.breakpoints.up("sm")]: {
        padding: `${theme.spacing(10)} 0 ${theme.spacing(1)}`
    },
    [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(2),
        paddingTop: theme.spacing(7)
    }
}));

const LargeKeyboardArrowDownIcon = styled(KeyboardArrowDownIcon)(({ theme }) => ({
    color: theme.palette.common.white,
    width: 48,
    height: 48,
    '&:hover': {
        cursor: 'pointer',
    }
}));

export default ({setSelectedAssistant, assistants, isActive = false}) => {
    const isDesktop = useResponsive("up", "md");

    return (
        <Section sx={{ height: '100vh', minHeight: 804 }}>
            <Container>
                <Stack sx={{height: 'calc(100% - 48px)'}} py={{ xs: 7, md: 4 }} px={{ xs: 2, sm: 0 }} flexDirection={"column"} alignItems="center" justifyContent="space-around">
                    <StyledTypography variant="h1">
                        Select your Zeli
                    </StyledTypography>
                    {assistants?.length > 0 &&
                        <AvatarCarousel
                            assistants={assistants}
                            setSelectedAssistant={setSelectedAssistant}
                            showNavBtn={isDesktop}
                            displaySize={isDesktop ? 5 : 3}
                            isDesktop={isDesktop}
                            showSoundUp
                            isActive={isActive}
                        />
                    }
                    <StyledTypography variant="subtitle1">
                        Hi there! I am Zeli. I can help you advertise jobs, analyse and compare resumes, set up interviews
                        with the most promising candidates, write employment contracts, and much more! Choose an avatar to
                        work with.
                    </StyledTypography>
                </Stack>
                <CenterBox>
                    <LargeKeyboardArrowDownIcon onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })} />
                </CenterBox>
            </Container>
        </Section>
    );
};
