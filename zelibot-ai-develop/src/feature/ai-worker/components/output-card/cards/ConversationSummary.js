
import React, { useEffect, useMemo, useState } from 'react';
import { Stack, Typography, IconButton, TextField, InputAdornment } from '@mui/material';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import SwitchLeftIcon from '@mui/icons-material/SwitchLeft';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { AIGetAPIRequest } from '../../../constants';
import TableNoData from '../../../../../components/table/TableNoData';
import { API_GET_CONVERSATION_SUMMARY } from '../../../../../config-global';
import { set } from 'lodash';
import { Loading } from '../../../../../components/loading-screen';
import moment from 'moment';
import TableHeadAction from '../../ats/table-card/TableHeadAction';
import { ORDER_TYPE, getCustomComparator, useTable } from '../../../../../components/table';
import { useDispatch } from 'react-redux';
import { passConversationToAIWorker } from '../../../../../redux/slices/aiworkerSlice';
import CloseIcon from '@mui/icons-material/Close';
import { Close } from '@mui/icons-material';
import { closeModal } from '../../../../../redux/slices/modal';
import UserFeedback from '../../../../../components/user-feedback/UserFeedback';

const ConversationSummary = ({ onClose }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [noDataFound, setNoDataFound] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [sorted, setSorted] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const dispatch = useDispatch();

    const fetchConversationData = async () => {
        setLoading(true)
        let response = await AIGetAPIRequest(API_GET_CONVERSATION_SUMMARY);
        // console.log('Response is >>> ', response);
        if (response?.conversations?.length === 0) {
            setConversations([]);
            setNoDataFound(true)
            setData([]);
        } else {
            setConversations(response?.conversations);
            setData(response?.conversations);
            setNoDataFound(false);
        }
        setLoading(false)
    }

    const handleClearSearch = () => {
        setSearchInput('');
        setCandidatesList(data);
    };

    const handleConversationClick = (conversation) => {
        setLoading(true)
        // console.log('Conversation is >>> ', conversation);
        if (conversation?.conversation_guid) {
            let id = conversation?.conversation_guid;
            dispatch(passConversationToAIWorker({ conversation_guid: id }));
        }
        handleClose();
        return
    }

    const { order, orderBy, onSort, orderType } = useTable({
        defaultOrderBy: 'utc_date_created',
        defaultOrder: 'desc',
        defaultOrderType: ORDER_TYPE.ALPHABETICALLY,
    });

    const sortedData = useMemo(() => {
        return conversations?.toSorted((a, b) => {
            let valueA = a[orderBy] ? a[orderBy] : 'Conversation';
            let valueB = b[orderBy] ? b[orderBy] : 'Conversation';
            if (orderType === ORDER_TYPE.TIME) {
                valueA = moment(valueA).format('DD/MM/YYYY');
                valueB = moment(valueB).format('DD/MM/YYYY');
            }
            return getCustomComparator({
                valueA,
                valueB,
                order,
                orderType,
                timeFormat: 'DD/MM/YYYY',
            });
        });
    }, [conversations, order, orderBy, orderType]);


    // Write a function to go through the conversations data
    // and filter it in the same format by a search term event.target.value
    const handleDataFilter = (e) => {
        let searchValue = e.target.value;
        setSearchInput(searchValue);
        let filteredData = [];
        if (searchValue) {
            filteredData = data.filter((conversation) => {
                if (conversation?.conversation_title) {
                    return conversation?.conversation_title?.toLowerCase().includes(searchValue.toLowerCase());
                } else {
                    return 'Conversation'.includes(searchValue.toLowerCase());
                }
            });
        } else {
            filteredData = data;
        }
        if (filteredData.length === 0) {
            setNoDataFound(true);
        } else {
            setNoDataFound(false);
        }
        setConversations(filteredData);
    }

    const handleClose = () => {
        // dispatch(closeModal());
        onClose();
        return
    }

    useEffect(() => {
        fetchConversationData();
    }, [])

    return (
        <Stack gap={2} minWidth={{ sx: '90%', md: '650px' }} padding={4} width={{ sx: '100%' }} flexDirection={'column'} sx={{ boxShadow: '0px 12px 24px 0px black', borderRadius: '16px', backgroundColor: 'white' }}>
            {/* Section Actions, filters, sorting, search, clear */}
            <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Typography sx={{ color: '#21054C' }} fontWeight={'bold'} fontSize={'20px'}>History</Typography>
                <Stack onClick={() => handleClose()} sx={{ cursor: 'pointer' }} flexDirection={'row'} justifyContent={'flex-end'} gap={0.5} alignItems={'center'}>
                    <Typography sx={{ fontWeight: '400', fontSize: '12px', color: 'gray' }}>Close</Typography>
                    <CloseIcon sx={{ color: 'gray', width: '16px' }} />
                </Stack>
            </Stack>
            <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'center'} gap={1} sx={{ borderBottom: '2px solid #9859E0' }} py={1} px={0.5}>
                    <ChatOutlinedIcon sx={{ color: '#9859E0' }} />
                    <Typography sx={{ color: '#9859E0', fontSize: '14px' }} fontWeight={600}>Conversations</Typography>
                </Stack>
                {/* Search */}
                <Stack sx={{ width: '50%' }} flexDirection={'row'} alignItems={'center'}>
                    <TextField
                        sx={{ width: '100%', overflow: 'hidden' }}
                        inputProps={{
                            style: {
                                // padding: 0
                            },
                        }}
                        InputProps={{
                            endAdornment: (
                                <Stack onClick={() => handleClearSearch()} justifyContent={'center'} alignItems={'center'} sx={{ backgroundColor: '#170058', height: '52px', width: '52px', borderRadius: '0px 8px 8px 0px', cursor: 'pointer' }}>
                                    <SearchIcon sx={{ color: 'white' }} />
                                </Stack>
                            ),
                            disableUnderline: true,
                            style: { padding: 0 }, // Optional: Adjust padding if needed
                        }}
                        value={searchInput}
                        onChange={(e) => handleDataFilter(e)}
                        id='outlined-basic'
                        placeholder='Job, client or candidate'
                        variant='outlined'
                    />
                    {/* <Button px={2} py={1} variant={'contained'} sx={{ backgroundColor: '#170058', color: 'white', ml: 1 }}>Confirm</Button> */}
                </Stack>
            </Stack>

            {/* Data to be rendered below */}
            <Stack flexDirection={'column'} sx={{ height: '90%', maxHeight: '450px' }}>
                {/* Map over days here. */}
                {/* One Days Conversations */}
                {/* <Stack flexDirection={'column'} sx={{ borderRadius: '16px 16px 0px 0px', overflowY: 'scroll', height: 'fit-content', backgroundColor: 'blue' }} > */}
                {/* Header */}
                {
                    loading ?
                        <Stack sx={{ minHeight: '400px' }} position={'relative'} justifyContent={'center'} alignItems={'center'}>
                            <Loading />
                        </Stack>
                        :
                        noDataFound
                            ?
                            <Stack justifyContent={'center'} alignItems={'center'}>
                                <TableNoData isNotFound={true} />
                            </Stack>
                            :
                            <Stack sx={{ maxHeight: '100%' }}>
                                <Stack py={0.5} px={2} sx={{ backgroundColor: '#21054C', color: 'white', borderRadius: '8px 8px 0px 0px' }} flexDirection={'row'} gap={1} alignItems={'center'} justifyContent={'space-between'}>
                                    <Stack gap={2} flexDirection={'row'} alignItems={'center'} width={'50%'}>
                                        <TableHeadAction id='conversation_title'
                                            order={order} orderBy={orderBy} onSort={onSort}
                                            title='Conversation' orderType={ORDER_TYPE.ALPHABETICALLY} />
                                    </Stack>
                                    <Stack flexDirection={'row'} justifyContent={'flex-end'} gap={2} alignItems={'center'} width={'50%'}>
                                        <Stack alignItems={'flex-start'} sx={{ width: '160px' }}>
                                            <TableHeadAction id='utc_date_created'
                                                order={order} orderBy={orderBy} onSort={onSort}
                                                title='Started' orderType={ORDER_TYPE.TIME} />
                                        </Stack>
                                        <Stack alignItems={'flex-start'} sx={{ minWidth: '160px' }}>
                                            <TableHeadAction id='utc_date_updated'
                                                order={order} orderBy={orderBy} onSort={onSort}
                                                title='Last interaction' orderType={ORDER_TYPE.TIME} />
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Stack sx={{ overflowY: 'scroll', height: '90%' }}>
                                    {
                                        sortedData.map((item, index) => {
                                            return (
                                                <Stack onClick={() => handleConversationClick(item)}>
                                                    {/* Map over conversations within that day here */}
                                                    {/* {
                                                item.conversations.map((conversation, index) => {
                                                    return ( */}
                                                    <Stack gap={1} key={'conversation-summary-item-' + index} py={2} px={2} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ borderBottom: '1px solid #E4E5E7', minHeight: '50px', cursor: 'pointer' }}>
                                                        <Stack sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '45%' }}>
                                                            <Typography sx={{ "&:hover": { textDecoration: 'underline', color: '#9859E0' }, fontSize: '14px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} fontWeight={400}>{item?.conversation_title ? item?.conversation_title : `Conversation started at ${moment.utc(item?.utc_date_created).local().format('H:mm A')} on ${moment.utc(item?.utc_date_created).local().format('Do MMMM YYYY')}`}</Typography>
                                                        </Stack>
                                                        <Stack flexDirection={'row'} sx={{ width: '50%' }} justifyContent={'flex-end'} gap={2} alignItems={'center'}>
                                                            <Typography sx={{ fontSize: '14px', width: '160px' }} fontWeight={400}>{moment.utc(item?.utc_date_created).local().format('DD/MM/YYYY') + ', ' + moment.utc(item?.utc_date_created).local().format('H:mm A')}</Typography>
                                                            {/* <Typography sx={{ fontSize: '14px' }} fontWeight={400}></Typography> */}
                                                            <Typography sx={{ fontSize: '14px', minWidth: '160px' }} fontWeight={400}>{moment.utc(item?.utc_date_updated).local().format('DD/MM/YYYY') + ', ' + moment.utc(item?.utc_date_updated).local().format('H:mm A')}</Typography>
                                                            {/* <IconButton>
                                                                <MoreVertIcon />
                                                            </IconButton> */}
                                                        </Stack>
                                                    </Stack>
                                                </Stack>
                                            )
                                        })}
                                </Stack>
                            </Stack>
                }
                {/* </Stack> */}
            </Stack>
            <Stack flexDirection={'row'} justifyContent={'flex-end'} alignItems={'center'}>
                <UserFeedback />
            </Stack>
        </Stack>
    );
};

export default ConversationSummary;
