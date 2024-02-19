import {isValidElement} from "react";
import {Box, Card, Container, IconButton, Modal, Stack, styled, Typography} from "@mui/material";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

const ModalContainer = styled(Container)({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 300,
    maxHeight: 'calc(100% - 40px)',
    width: 'inherit',
});

const ModalContent = styled(Card)(({ theme }) => ({
    padding: theme.spacing(4),
}));

const Header = styled(Stack)(({ theme }) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
}));

const Title = styled(Typography)({
    fontSize: 20,
    fontWeight: 800,
    lineHeight: 1.2,
});

const CloseLabel = styled(Typography)(({ theme }) => ({
    color: theme.palette.grey[600],
    fontSize: 14,
    lineHeight: 1.4,
    '&:hover': {
        cursor: 'pointer',
    },
}));

export default (props) => {
    const {
        open,
        onClose,
        children,
        actionBtn = (
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <CloseLabel onClick={onClose}>Close</CloseLabel>
                <IconButton onClick={onClose}>
                    <ClearRoundedIcon />
                </IconButton>
            </Box>
        ),
        title,
        ...rest
    } = props;

    return (
        <Modal open={open} onClose={onClose} {...rest}>
            <ModalContainer>
                <ModalContent>
                    <Header>
                        {isValidElement(title) ? title : (<Title>{title}</Title>)}
                        {actionBtn}
                    </Header>
                    {children}
                </ModalContent>
            </ModalContainer>
        </Modal>
    );
}
