exports.normalizeQueryString = (queryString, filters) => {
    for (let property in filters) {
        const filterValue = filters[property];
        if (filterValue) {
            if (typeof filterValue !== "string")
                queryString += ` AND ${property}=${filterValue}`;
            else
                queryString += ` AND ${property}='${filterValue}'`;
        }
    }
    return queryString;
}
exports.toHex = int => int.toString(16);
exports.toInt = hex => parseInt(hex, 16);
exports.addZero = (number, length) => {
    number = String(number).split('');
    while(number.length < length){
        number.unshift(0);
    }
    number = number.join('');
    return number;
}