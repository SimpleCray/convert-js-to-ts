import moment from 'moment';

// ----------------------------------------------------------------------
// All rights reserved - SEDZ PTY LTD - 2023
// ----------------------------------------------------------------------

import { ORDER_TYPE } from './useTable';

export function emptyRows(page, rowsPerPage, arrayLength) {
	return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

export function getComparator(order, orderBy) {
	return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

export function getCustomComparator({ valueA, valueB, order = 'desc', orderType = ORDER_TYPE.ALPHABETICALLY, timeFormat = 'DD/MM/YYYY' }) {
	let returnValue = 0;
	if (orderType === ORDER_TYPE.ALPHABETICALLY) {
		returnValue = valueB?.toLowerCase()?.localeCompare(valueA?.toLowerCase());
	} else if (orderType === ORDER_TYPE.TIME) {
		try {
			const momentA = moment(valueA, timeFormat).toDate().getTime();
			const momentB = moment(valueB, timeFormat).toDate().getTime();
			returnValue = momentB - momentA;
		} catch (err) {
			// console.log('err', err);
			return 0;
		}
	} else if (orderType === ORDER_TYPE.BOOLEAN) {
		returnValue = valueA === valueB ? 0 : valueA ? 1 : -1;
	} else if (orderType === ORDER_TYPE.NUMBER) {
		returnValue = +valueB - +valueA;
	}
	return order === 'desc' ? returnValue : -returnValue;
}
