import { Table as MuiTable, Tooltip, TableBody, IconButton, TableContainer, TableCell, Box } from '@mui/material';
import { Iconify } from '@zelibot/zeligate-ui';
import { useTable, getComparator, emptyRows, TableNoData, TableEmptyRows, TableSelectedAction } from 'src/components/table';
import { TableHead as CustomTableHead } from './TableHead';
import { Loading } from 'src/components/loading-screen';

const Table = ({ tableData, tableHead, handleOpenConfirm, isNotFound, loading, children }) => {
    const {
        dense,
        page,
        order,
        orderBy,
        rowsPerPage,
        selected,
        setSelected,
        onSelectAllRows,
        onSort,
    } = useTable();

    const denseHeight = dense ? 52 : 72;

    return (
        <Box sx={{ display: isNotFound && 'none' }}>
            <MuiTable size={dense ? 'small' : 'medium'} stickyHeader>
                <CustomTableHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={tableHead}
                    rowCount={tableData.length}
                    numSelected={selected.length}
                    onSort={onSort}
                />
            </MuiTable>
            <TableContainer sx={{ position: 'relative', overflow: 'unset', maxHeight: '390px', overflowY: 'auto' }}>
                <TableSelectedAction
                    dense={dense}
                    numSelected={selected.length}
                    rowCount={tableData.length}
                    onSelectAllRows={(checked) =>
                        onSelectAllRows(
                            checked,
                            tableData.map((row) => row.sk)
                        )
                    }
                    action={
                        <Tooltip title='Delete'>
                            <IconButton color='primary' onClick={handleOpenConfirm}>
                                <Iconify icon='eva:trash-2-outline' />
                            </IconButton>
                        </Tooltip>
                    }
                />

                <MuiTable size={dense ? 'small' : 'medium'} stickyHeader>
                    <TableBody sx={{ maxHeight: '100%' }}>
                        {loading && (
                            // Make simple component for this
                            <tr>
                                <TableCell colSpan={12}>
                                    <Box sx={{
                                        height: '360px',
                                    }}
                                    >
                                        <Loading />
                                    </Box>
                                </TableCell>
                            </tr>
                        )}
                        {children}

                        <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                        {!loading && (
                            <TableNoData isNotFound={isNotFound} />
                        )}
                    </TableBody>
                </MuiTable>
            </TableContainer>
        </Box>
    );
}

export default Table;
export { Table };