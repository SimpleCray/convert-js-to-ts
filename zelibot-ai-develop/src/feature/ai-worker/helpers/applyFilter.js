export const applyFilter = ({ inputData, comparator, filterBy }) => {
    const stabilizedThis = inputData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    inputData = stabilizedThis.map((el) => el[0]);

    const { key: searchKey, value: searchValue, condition, threshold } = filterBy;

    if (condition === 'contains') {
        if ((threshold && searchValue.length >= threshold) || !threshold) {
            inputData = inputData.filter((data) => {
                if (data[searchKey].value) {
                    return data[searchKey].value.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1;    
                }
                return false;
            });
        }
    } else if (condition === 'match') {
        inputData = inputData.filter((data) => {
            return data[searchKey] === searchValue;
        });
    }

    return inputData;
};