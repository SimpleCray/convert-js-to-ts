import React, { useState } from 'react'
import dayjs from 'dayjs';
import { Box, Stack, Typography, TextField, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { TimePicker } from '@mui/x-date-pickers'

const ScheduleCalendar = () => {
    const [candidateName, setCandidateName] = useState('candidate name')
    const [eventName, setEventName] = useState('event')
    const [timeOptions, setTimeOptions] = useState([
        {
            date: new Date(),
            time: null
        }
    ])

    const createNewTimeSlot = () => {
        let newTimeSlot = {
            date: new Date(),
            time: null
        }
        setTimeOptions([newTimeSlot, ...timeOptions])
    }

    const deleteTimeSlot = () => {
        let newArray = [...timeOptions];
        newArray.pop();
        setTimeOptions(newArray);
    }

    return (
        <Stack p={4} flexDirection={'column'} gap={4} sx={{ backgroundColor: 'white', width: '100%', height: '100%', borderRadius: 2 }}>
            <Stack gap={2} flexDirection={'row'} alignItems={'center'}>
                <img src={'/assets/icons/wsc-icons/wsc-schedule-calendar.svg'}></img>
                <Typography fontWeight={400} sx={{ fontSize: '20px' }}>Invite <span style={{ color: '#9859E0', fontWeight: 400, fontSize: '20px' }}>{candidateName}</span> for <span style={{ color: '#9859E0', fontWeight: 400, fontSize: '20px' }}>{eventName}</span></Typography>
            </Stack>
            <Typography variant={'p'}>
                Propose up to 3 different time options to schedule
            </Typography>
            {
                timeOptions.map((option, index) => {
                    return (
                        <DateTimeComponent setTimeOptions={setTimeOptions} index={index} option={option} key={'wsc-schedule-calendar-time-option-' + index} />
                    )
                })
            }
            {
                timeOptions.length >= 3
                    ?
                    <Stack gap={2} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography onClick={() => deleteTimeSlot()} variant={'p'} sx={{ cursor: 'pointer' }} >
                            Remove time option
                        </Typography>
                        <img style={{ cursor: 'pointer' }} onClick={() => deleteTimeSlot()} src="/assets/icons/wsc-icons/minus-icon.svg"></img>
                    </Stack>
                    :
                    <Stack gap={2} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography onClick={() => createNewTimeSlot()} variant={'p'} sx={{ cursor: 'pointer' }} >
                            Add another time option
                        </Typography>
                        <img style={{ cursor: 'pointer' }} onClick={() => createNewTimeSlot()} src="/assets/icons/wsc-icons/plus-icon.svg"></img>
                    </Stack>
            }
            <Stack gap={2} flexDirection={'row'} justifyContent={'flex-end'} alignItems={'center'}>
                <Button variant="outlined" color="primary">
                    Cancel
                </Button>
                <Button variant="contained" color="primary">
                    Send
                </Button>
            </Stack>
        </Stack>
    )
}

const DateTimeComponent = ({ option, index, setTimeOptions }) => {

    const handleDateOption = (value) => {
        // console.log('value is ', value)
        // let newDateValue = value;
    }

    const handleTimeOption = (value) => {

    }

    return (
        <Stack gap={2} sx={{ width: '100%' }} flexDirection={'row'} justifyContent={'flex-start'}>
            <Box width={'50%'} height={'fit-content'}>
                <DatePicker
                    sx={{width: '100%'}}
                    label="Date"
                    inputFormat="MM-dd-yyyy"
                    value={option.date}
                    disablePast
                    onChange={(value) => handleDateOption(value)}
                    renderInput={(params) => <TextField {...params} />}
                />
            </Box>
            <Box width={'50%'} height={'fit-content'}>
                <TimePicker
                    sx={{width: '100%'}}
                    label="Time"
                    value={option.time}
                    disablePast
                    onChange={(value) => handleTimeOption()}
                    renderInput={(params) => <TextField fullWidth/>}
                />
            </Box>
        </Stack>
    )
}

export default ScheduleCalendar