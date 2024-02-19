import { useState, useCallback } from 'react';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

export const ORDER_TYPE = {
	ALPHABETICALLY: 'alphabetically',
	TIME: 'time',
	BOOLEAN: 'boolean',
	NUMBER: 'number',
};

export default function useTable(props) {
	const [dense, setDense] = useState(!!props?.defaultDense);

	const [orderBy, setOrderBy] = useState(props?.defaultOrderBy || 'name');

	const [order, setOrder] = useState(props?.defaultOrder || 'asc');

	const [orderType, setOrderType] = useState(props?.defaultOrderType || ORDER_TYPE.ALPHABETICALLY);

	const [page, setPage] = useState(props?.defaultCurrentPage || 0);

	const [rowsPerPage, setRowsPerPage] = useState(props?.defaultRowsPerPage || 10);

	const [selected, setSelected] = useState(props?.defaultSelected || []);

	const onSort = useCallback(
		(id, newOrderType = ORDER_TYPE.ALPHABETICALLY) => {
			const isAsc = orderBy === id && order === 'asc';
			if (id !== '') {
				setOrder(isAsc ? 'desc' : 'asc');
				setOrderBy(id);
			}
			if (newOrderType !== orderType) {
				setOrderType(newOrderType);
			}
		},
		[order, orderBy, orderType]
	);

	const onSelectRow = useCallback(
		(id) => {
			const selectedIndex = selected.indexOf(id);

			let newSelected = [];

			if (selectedIndex === -1) {
				newSelected = newSelected.concat(selected, id);
			} else if (selectedIndex === 0) {
				newSelected = newSelected.concat(selected.slice(1));
			} else if (selectedIndex === selected.length - 1) {
				newSelected = newSelected.concat(selected.slice(0, -1));
			} else if (selectedIndex > 0) {
				newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
			}
			setSelected(newSelected);
		},
		[selected]
	);

	const onSelectAllRows = useCallback((checked, newSelecteds) => {
		if (checked) {
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	}, []);

	const onChangePage = useCallback((event, newPage) => {
		setPage(newPage);
	}, []);

	const onChangeRowsPerPage = useCallback((event) => {
		setPage(0);
		setRowsPerPage(parseInt(event.target.value, 10));
	}, []);

	const onChangeDense = useCallback((event) => {
		setDense(event.target.checked);
	}, []);

	return {
		orderType,
		dense,
		page,
		order,
		orderBy,

		rowsPerPage,
		//
		selected,
		onSelectRow,
		onSelectAllRows,
		//
		onSort,
		onChangePage,
		onChangeDense,
		onChangeRowsPerPage,
		//
		setPage,
		setDense,
		setOrder,
		setOrderBy,
		setSelected,
		setRowsPerPage,
	};
}
