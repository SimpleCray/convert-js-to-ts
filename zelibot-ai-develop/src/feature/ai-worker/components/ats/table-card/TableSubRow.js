import { useEffect, useRef, useState } from 'react';
import { CircularProgress, Autocomplete, Stack, Typography, Button, IconButton, TextField } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { set } from 'lodash';
import { LoadingButton } from '@mui/lab';


const TableRowSubComponent = ({ row, title, options, inputOnChangeHandler, inputClearHandler, submitHandler, isLoading, setIsSubRowVisible, refetchData }) => {
	const changeHandler = (e) => {
		// console.log('input on change event');
		inputOnChangeHandler(e);
	};

	const [buttonLoading, setButtonLoading] = useState(false);

	const assignCandidateRef = useRef(null);
	useEffect(() => {
		const checkClickOutsideAssignRow = (e) => {
			// console.log('Clicked on the window', e.target)
			if (assignCandidateRef?.current && !assignCandidateRef.current.contains(e.target) && e.target.getAttribute('title') !== 'sub-row-select-item') {
				// console.log('Clicking outside the document!!!')
				setIsSubRowVisible(false);
			}
		}
		if (title === 'Assign candidate to:') {
			// console.log('Adding event listener for click in sub row component!')
			window.addEventListener("click", checkClickOutsideAssignRow);
		}
		return () => {
			window.removeEventListener("click", checkClickOutsideAssignRow);
		}
	}, [assignCandidateRef?.current])

	useEffect(() => {
		if (refetchData) {
			setButtonLoading(false);
		}
	}, [refetchData])

	const clearInput = (e) => {
		inputClearHandler();
	};

	const onSubmit = (e) => {
		submitHandler(selectedOption);
		setSelectedOption(null);
	};

	const [selectedOption, setSelectedOption] = useState(null);

	const onOptionSelect = (_, option) => {
		setSelectedOption(option);
	};

	return (
		<Stack ref={assignCandidateRef} direction='row' gap={2} justifyContent='space-between' px={2} alignItems='center'>
			<Typography variant='body2'>{title}</Typography>
			<Stack direction='row' alignItems='center' flex={1} px={2}>
				{/* <TextField
                    onChange={changeHandler}
                    InputProps={{
                        endAdornment: 
                            <InputAdornment position='end'>
                                <IconButton onClick={clearInput} edge="end">
                                    <ClearRoundedIcon />
                                </IconButton>
                            </InputAdornment>
                    }}
                    sx={{
                        '& .MuiInputBase-root': {
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                        },
                        'input': {
                            paddingY: (theme) => theme.spacing(1.5),
                        },
                    }}
                /> */}
				<Autocomplete
					options={options}
					getOptionLabel={(option) => option.label}
					renderOption={(props, option) => {
						return (
							<li title={'sub-row-select-item'} {...props} key={option.id}>
								{option.label}
							</li>
						);
					}}
					noOptionsText='No options'
					onChange={onOptionSelect}
					renderInput={(params) => <TextField variant='outlined' {...params} />}
					sx={{
						flex: 1,
						'& .MuiInputBase-root': {
							borderTopRightRadius: 0,
							borderBottomRightRadius: 0,
						},
						'& .MuiAutocomplete-inputRoot': {
							paddingY: (theme) => theme.spacing(0.5),
						},
					}}
					label='djgguidjk'
					value={selectedOption}
					autoSelect
					autoHighlight
				/>
				<IconButton
					sx={{
						borderTopRightRadius: (theme) => theme.spacing(1),
						borderBottomRightRadius: (theme) => theme.spacing(1),
						borderTopLeftRadius: 0,
						borderBottomLeftRadius: 0,
						backgroundColor: '#170058',
						color: 'white',
						padding: (theme) => theme.spacing(1.25),
						'&:hover': {
							backgroundColor: (theme) => theme.palette.primary.main,
						},
					}}
				>
					<SearchRoundedIcon />
				</IconButton>
			</Stack>
			<LoadingButton
				onClick={(e) => {
					onSubmit(e);
					setButtonLoading(true)
				}}
				disabled={buttonLoading}
				sx={{
					'&:hover': {
						backgroundColor: 'gray'
					}, backgroundColor: '#21044c', color: 'white', width: 'auto', fontSize: '14px'
				}}
				loading={buttonLoading}
			>
				Submit
			</LoadingButton>
		</Stack>
	);
};

export default TableRowSubComponent;
