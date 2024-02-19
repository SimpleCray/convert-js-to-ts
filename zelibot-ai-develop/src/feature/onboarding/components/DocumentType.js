import { Box, Grid, Stack } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import useResponsive from "../../../hooks/useResponsive";
import { StyledTypography } from "./ComponentStyles";

const DocumentType = ({label}) => (
    <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }}>
        <DescriptionOutlinedIcon sx={{ mr: 1, color: 'primary.light' }}/>
        <span>{label}</span>
    </Box>
);

export default () => {
    const isSmall = useResponsive('up', 'sm');

    return (
        <Stack flexDirection="column" gap={{ xs: 2 }}>
            <StyledTypography variant="subtitle2" sx={{fontSize: 18, whiteSpace: 'pre-line' }}>
                The more documents you upload, the better Zeli can help you.{'\n'}
                You can upload, for example:
            </StyledTypography>

            {isSmall &&
                <Grid container spacing={4}>
                    <Grid item container xs={6} justifyContent="flex-end">
                        <Stack flexDirection="column" gap={{ xs: 1 }} alignItems="baseline">
                            <DocumentType label="Job requisitions" />
                            <DocumentType label="Company policies" />
                            <DocumentType label="Employee contracts" />
                        </Stack>
                    </Grid>
                    <Grid item container xs={6} justifyContent="flex-start">
                        <Stack flexDirection="column" gap={{ xs: 1 }} alignItems="baseline">
                            <DocumentType label="Position descriptions" />
                            <DocumentType label="Offer letters" />
                        </Stack>
                    </Grid>
                </Grid>
            }
            {!isSmall &&
                <Grid container spacing={1} alignItems="baseline">
                    <DocumentType label="Job requisitions" />
                    <DocumentType label="Position descriptions" />
                    <DocumentType label="Company policies" />
                    <DocumentType label="Offer letters" />
                    <DocumentType label="Employee contracts" />
                </Grid>
            }
        </Stack>
    );
}
