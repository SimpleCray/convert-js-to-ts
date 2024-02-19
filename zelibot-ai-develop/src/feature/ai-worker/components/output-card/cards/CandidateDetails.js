import React, { useEffect, useRef, useState } from 'react'
import { Stack, Typography, Box, Alert, Button, TextField, Select, MenuItem, InputLabel } from '@mui/material';
import { useSnackbar } from 'notistack';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import axios from 'axios';
import { API_UPDATE_CLIENT_DETAILS } from '../../../../../config-global';
import { AIPostAPIRequest } from '../../../constants';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../../../../redux/slices/modal';
import { refreshComponent } from '../../../../../redux/slices/refresh';
import { LoadingButton } from '@mui/lab';

const CandidateDetails = ({ modalData }) => {
    const candidate = JSON.parse(window.sessionStorage.getItem('candidate_details'))
    // console.log('Candidate Details from storage >>> ', JSON.parse(candidate))
    const { enqueueSnackbar } = useSnackbar();
    const [nameDetails, setNameDetails] = useState({
        firstName: candidate.first_name ? candidate.first_name : '',
        lastName: candidate.last_name ? candidate.last_name : ''
    })
    const renderCount = useRef(0)
    const [email, setEmail] = useState(candidate.email ? candidate.email : '')
    const [phone, setPhone] = useState(candidate.mobile_number ? candidate.mobile_number : '')
    const [notes, setNotes] = useState(candidate.notes ? candidate.notes : '')
    const [saveLoad, setSaveLoad] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')
    const [errorFields, setErrorFields] = useState({
        candidateName: false,
        email: false,
    })
    const [visitedFields, setVisitedFields] = useState({
        candidateName: true,
        email: false,
    })
    const [activeSection, setActiveSection] = useState(modalData === 'email' ? 'EMAIL' : 'NAME')
    const [hoveredSection, setHoveredSection] = useState(null)
    const [savedData, setSavedData] = useState({
        firstName: candidate.first_name ? candidate.first_name : '',
        lastName: candidate.last_name ? candidate.last_name : '',
        email: candidate.email ? candidate.email : '',
        phone: candidate.mobile_number ? candidate.mobile_number : '',
        notes: candidate.notes ? candidate.notes : ''
    })
    const [canSave, setCanSave] = useState(false)
    const [showErrorMessageOnSubmit, setShowErrorMessageOnSubmit] = useState(false);
    const dispatch = useDispatch()

    const sections = [
        'NAME',
        'EMAIL',
        'PHONE',
        'NOTES'
    ];

    const handleSaveAction = () => {
        if (validateFieldsOnSubmit()) {
            return
        }
        postNewCandidateData()
        return
    }

    const postNewCandidateData = async () => {
        setSaveLoad(true)
        const candidateData = {
            candidate_id: candidate.candidate_id,
            first_name: nameDetails.firstName,
            last_name: nameDetails.lastName,
            email: email,
            phone: phone,
            notes: notes
        }
        // console.log('Candidate Data to be saved >>> ', candidateData)
        // Call API to save the data

        AIPostAPIRequest(API_UPDATE_CLIENT_DETAILS, candidateData).then((response) => {
            // console.log('Response from API >>> ', response)
            if (response === 'Success') {
                // enqueueSnackbar('Candidate details saved successfully', { variant: 'success' })
                // setCanSave(false)
                // console.log('Saved successfully')
                setHoveredSection(null)
                setActiveSection(null)
                // Save the data
                setSavedData({
                    firstName: nameDetails.firstName,
                    lastName: nameDetails.lastName,
                    email: email,
                    phone: phone,
                    notes: notes
                })
                dispatch(refreshComponent({ component: modalData === 'email' ? 'PRE-SCREENING-INTERVIEW' : 'CANDIDATE_PROFILE', data: modalData === 'email' ? email : null }))
                dispatch(closeModal())
                setSaveLoad(false)
                enqueueSnackbar('Candidate details saved successfully', { variant: 'success' })
                setCanSave(false)
                return
            }
        }
        ).catch((error) => {
            setSaveLoad(false)
            // console.log('Error while saving candidate details >>> ', error)
            enqueueSnackbar('Error while saving candidate details', { variant: 'error' })
        })
    }

    const validateFieldsOnSubmit = () => {
        if (nameDetails.firstName === '' || nameDetails.lastName === '') {
            setErrorFields({ ...errorFields, candidateName: true })
            setErrorMessage('Please enter a valid candidate name')
            setShowErrorMessageOnSubmit(true)
            return true
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setErrorFields({ ...errorFields, email: true })
            setErrorMessage('Please enter a valid email')
            setShowErrorMessageOnSubmit(true)
            return true
        }
        setErrorFields({ ...errorFields, candidateName: false, email: false })
        setErrorMessage('')
        return false
    }

    const handleCancelAction = () => {
        if (canSave) {
            setHoveredSection(null)
            setActiveSection(null)
            // Reset all the fields to saved values
            setNameDetails({
                firstName: savedData.firstName,
                lastName: savedData.lastName,
            })
            setEmail(savedData.email)
            setPhone(savedData.phone)
            setNotes(savedData.notes)
            setCanSave(false)
        } else {
            // console.log('Closing candidate details modal')
            dispatch(refreshComponent({ component: modalData === 'email' ? 'PRE-SCREENING-INTERVIEW-EMAIL-MODAL' : 'CANDIDATE_PROFILE' }))
            dispatch(closeModal())
        }
        return
    }

    const handlePhoneNumber = (e) => {
        const value = e.target.value;

        // Regex pattern to allow only numbers, symbols, and brackets
        const numericSymbolRegex = /^[0-9!@#$%^&*()_+{}[\]:;<>,?~\\/\-\s]+$/;

        if (numericSymbolRegex.test(value) || value === '') {
            // If the input is valid, update the state
            setPhone(value);
        }
    }

    // Use Effect code to check if any input field is edited, and if so, show the save button
    useEffect(() => {
        // Check if saved data is equal to the respective field
        if (nameDetails.firstName !== savedData.firstName || nameDetails.lastName !== savedData.lastName || email !== savedData.email || phone !== savedData.phone || notes !== savedData.notes) {
            setCanSave(true)
        }
        else {
            setCanSave(false)
        }
    }, [nameDetails.firstName, nameDetails.lastName, email, phone, notes])

    const validateFieldsOnSectionChange = () => {
        if (activeSection !== 'NAME' && visitedFields.candidateName) {
            if (nameDetails.firstName === '' || nameDetails.lastName === '') {
                setErrorFields({ ...errorFields, candidateName: true })
                setErrorMessage('Please enter a valid candidate name')
                return true
            }
        }
        // Email validation
        if (activeSection !== 'EMAIL' && visitedFields.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(email)) {
                setErrorFields({ ...errorFields, email: true })
                setErrorMessage('Please enter a valid email')
                return true
            }
        }
        setErrorFields({ ...errorFields, candidateName: false, email: false })
        setErrorMessage('')
        return false
    }

    // Use Effect code to check for errors on active section changes
    useEffect(() => {
        if (activeSection === 'NAME') {
            setVisitedFields({ ...visitedFields, candidateName: true })
        }
        if (activeSection === 'EMAIL') {
            setVisitedFields({ ...visitedFields, email: true })
        }
        validateFieldsOnSectionChange();
    }, [activeSection])

    useEffect(() => {
        // Event listener for ENTER key
        const handleEnterKeyPress = (event) => {
            // console.log('Event key code is >>> ', event.keyCode, Number(event.keyCode) === 13, canSave);
            if (Number(event.keyCode) === 13 && canSave) {
                // console.log('Handling Save Action', canSave)
                handleSaveAction()
            }
        }

        window.addEventListener('keydown', handleEnterKeyPress)

        // Cleanup
        return () => {
            window.removeEventListener('keydown', handleEnterKeyPress)
        }
    }, [canSave, email, nameDetails])

    return (
        <Stack
            flexDirection={'column'}
            minWidth={{ sx: '100%', md: '650px' }}
            gap={2}
            sx={{ backgroundColor: 'white', borderRadius: 1, width: '100%', maxWidth: '650px', padding: 3 }}
        >
            {/* Header */}
            <Stack
                flexDirection={'row'}
                justifyContent={'flex-start'}
                alignItems={'center'}
                gap={2}
            >
                <img src={'/assets/icons/wsc-icons/user-avatar.png'} alt={'edit candidate details'} />
                <Typography sx={{ fontWeight: 400, fontSize: '20px', lineHeight: '26px' }} variant={'h6'}>Edit candidate details</Typography>
            </Stack>
            {/* Name Row */}
            <Stack
                onClick={() => setActiveSection('NAME')}
                onMouseEnter={() => setHoveredSection('NAME')}
                onMouseLeave={() => setHoveredSection(null)}
                flexDirection={{ sx: 'column', md: 'row', cursor: 'pointer' }} alignItems={'center'} sx={{ width: '100%', minHeight: '30px' }} gap={2}>
                {
                    activeSection === 'NAME' ?
                        <>
                            <TextField
                                id="outlined-basic"
                                autoFocus={true}
                                label="First Name&#42;"
                                variant="outlined"
                                autoComplete='off'
                                sx={{ width: '50%' }}
                                value={nameDetails.firstName}
                                onChange={(e) => setNameDetails({ ...nameDetails, firstName: e.target.value })}
                            />
                            <TextField
                                id="outlined-basic"
                                label="Last Name&#42;"
                                autoComplete='off'
                                variant="outlined"
                                sx={{ width: '50%' }}
                                value={nameDetails.lastName}
                                onChange={(e) => setNameDetails({ ...nameDetails, lastName: e.target.value })}
                            />
                        </>
                        :
                        <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ width: '100%' }}>
                            <Stack flexDirection={'row'} alignItems={'center'} gap={2}>
                                {
                                    nameDetails.firstName || nameDetails.lastName ?
                                        <Typography sx={{ fontSize: '22px', color: '#21054C', fontWeight: '700', width: '100%' }} variant={'body1'}>{`${nameDetails?.firstName} ${nameDetails?.lastName}`}</Typography>
                                        :
                                        <Typography variant={'body1'} sx={{ width: '100%', fontWeight: '700', fontSize: '22px', color: errorFields.candidateName ? '#FF3C5D' : activeSection === 'NAME' ? '#9859E0' : '#21054C' }}>Candidate name</Typography>
                                }
                            </Stack>
                            {
                                hoveredSection === 'NAME' ?
                                    <EditOutlinedIcon sx={{ color: '#9BA0AE' }} />
                                    :
                                    null
                            }
                        </Stack>
                }

            </Stack>
            {/* Email Row */}
            <Stack
                onClick={() => setActiveSection('EMAIL')}
                onMouseEnter={() => setHoveredSection('EMAIL')}
                onMouseLeave={() => setHoveredSection(null)}
                flexDirection={'row'} sx={{ width: '100%', cursor: 'pointer', minHeight: '30px' }} alignItems={'center'} gap={2}>
                <Typography variant={'body1'} sx={{ width: '25%', fontWeight: '600', fontSize: '16px', lineHeight: '22.4px', color: errorFields.email ? '#FF3C5D' : activeSection === 'EMAIL' ? '#9859E0' : '#21054C' }}>Email</Typography>
                {
                    activeSection === 'EMAIL' ?
                        <TextField
                            id="outlined-basic"
                            autoFocus={true}
                            label="Email"
                            autoComplete='off'
                            variant="outlined"
                            type={'email'}
                            sx={{ width: '100%' }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        :
                        <Stack
                            flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ width: '100%' }}
                        >
                            <Stack flexDirection={'row'} alignItems={'center'} gap={2}>
                                {
                                    email ?
                                        <Typography variant={'body1'} sx={{ color: errorFields.email ? '#FF3C5D' : 'black' }}>{email}</Typography>
                                        :
                                        null
                                }
                            </Stack>
                            {
                                hoveredSection === 'EMAIL' ?
                                    <EditOutlinedIcon sx={{ color: '#9BA0AE' }} />
                                    :
                                    null
                            }
                        </Stack>
                }
            </Stack>
            {/* Phone Row */}
            <Stack
                onClick={() => setActiveSection('PHONE')}
                onMouseEnter={() => setHoveredSection('PHONE')}
                onMouseLeave={() => setHoveredSection(null)}
                flexDirection={'row'} sx={{ width: '100%', cursor: 'pointer', minHeight: '30px' }} alignItems={'center'} gap={2}>
                <Typography variant={'body1'} sx={{ width: '25%', fontWeight: '600', fontSize: '16px', lineHeight: '22.4px', color: activeSection === 'PHONE' ? '#9859E0' : '#21054C' }}>Phone</Typography>
                {
                    activeSection === 'PHONE' ?
                        <TextField
                            id="outlined-basic"
                            autoFocus={true}
                            autoComplete='off'
                            label="Phone"
                            variant="outlined"
                            sx={{ width: '100%' }}
                            type={'text'}
                            value={phone}
                            onChange={(e) => handlePhoneNumber(e)}
                        />
                        :
                        <Stack
                            flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ width: '100%' }}
                        >
                            <Stack flexDirection={'row'} alignItems={'center'} gap={2}>
                                {
                                    phone ?
                                        <Typography variant={'body1'}>{phone}</Typography>
                                        :
                                        null
                                }
                            </Stack>
                            {
                                hoveredSection === 'PHONE' ?
                                    <EditOutlinedIcon sx={{ color: '#9BA0AE' }} />
                                    :
                                    null
                            }
                        </Stack>
                }
            </Stack>
            {/* Notes row */}
            <Stack
                onClick={() => setActiveSection('NOTES')}
                onMouseEnter={() => setHoveredSection('NOTES')}
                onMouseLeave={() => setHoveredSection(null)}
                flexDirection={'row'} sx={{ width: '100%', cursor: 'pointer', minHeight: '30px' }} alignItems={'center'} gap={2}>
                <Typography variant={'body1'} sx={{ width: '25%', fontWeight: '600', fontSize: '16px', lineHeight: '22.4px', color: activeSection === 'NOTES' ? '#9859E0' : '#21054C' }}>Notes</Typography>
                {
                    activeSection === 'NOTES' ?
                        <TextField
                            id="outlined-basic"
                            autoFocus={true}
                            multiline
                            // minRows={3}
                            autoComplete='off'
                            label="Notes"
                            variant="outlined"
                            sx={{ width: '100%' }}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                        :
                        <Stack
                            flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ width: '100%' }}
                        >
                            <Stack flexDirection={'row'} alignItems={'center'} gap={2}>
                                {
                                    notes ?
                                        <Typography variant={'body1'}>{notes}</Typography>
                                        :
                                        null
                                }
                            </Stack>
                            {
                                hoveredSection === 'NOTES' ?
                                    <EditOutlinedIcon sx={{ color: '#9BA0AE' }} />
                                    :
                                    null
                            }
                        </Stack>
                }
            </Stack>
            {/* Save and Cancel button */}
            {
                errorMessage && showErrorMessageOnSubmit ?
                    <Alert severity="error">{errorMessage}</Alert>
                    :
                    null
            }
            <Stack
                flexDirection={'row'}
                justifyContent={'flex-end'}
                alignItems={'center'}
                gap={2}
                sx={{ padding: '1rem' }}
            >
                <Button
                    onClick={() => handleCancelAction()}
                    variant={'outlined'}>Cancel</Button>
                {
                    canSave
                        ?
                        <LoadingButton loading={saveLoad}
                            onClick={() => handleSaveAction()}
                            sx={{ backgroundColor: '#170058' }} variant={'contained'}>Save</LoadingButton>
                        :
                        null
                }
            </Stack>
        </Stack>
    )
}

export default CandidateDetails