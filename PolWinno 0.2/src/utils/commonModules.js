const normalizeQueryString = (queryString, filters) => {
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
};
const toHex = int => int.toString(16);
const toInt = hex => parseInt(hex, 16);

const addZero = (number, length) => {
    number = String(number).split('');
    while(number.length < length){
        number.unshift(0);
    }
    number = number.join('');
    return number;
}

require("dotenv").config({
    path: "./utils/.env"
});
const {
    DB_DATABASE
} = process.env

const checkForeignKey = async (connection, parentTable, idValue) => {
    const {
        pool,
        poolConnect
    } = connection;
    // ensures that the pool has been created
    await poolConnect;
    const dependencies = await outputDependencies(connection, parentTable);
    for (let {TableName: table, ColName: column} of dependencies){
        // for query filtering
        let filters = {};
        filters[column] = idValue;

        let queryString = `SELECT TOP (1) [${column}]
        FROM [${DB_DATABASE}].[dbo].[${table}]
        WHERE 1=1`
        queryString = normalizeQueryString(queryString, filters);
        try {
            const request = pool.request();
            const result = await request.query(queryString);
            const canRemove = !result.recordset.length;
            if (!canRemove)
                throw new Error(`This Foreign key depends on ${table} table ${column} column, and can not be removed`)
        } catch (err) {
            console.error("SQL error: ", err);
            return false;
        }
    }
    return true;
}

const outputDependencies = async (connection, table) => {
    const {
        poolConnect,
        pool
    } = connection;
    await poolConnect;
    let queryString = `SELECT 
    OBJECT_NAME(f.parent_object_id) TableName,
    COL_NAME(fc.parent_object_id,fc.parent_column_id) ColName
 FROM 
    sys.foreign_keys AS f
 INNER JOIN 
    sys.foreign_key_columns AS fc 
       ON f.OBJECT_ID = fc.constraint_object_id
 INNER JOIN 
    sys.tables t 
       ON t.OBJECT_ID = fc.referenced_object_id
 WHERE 
    OBJECT_NAME (f.referenced_object_id) = '${table}'`
    try {
        const request = pool.request();
        const result = await request.query(queryString);
        return [...result.recordset];
    } catch (err) {
        console.error("SQL error: ", err);
        return false;
    }
}

const setToQueryString = (queryString, newValues) => {
    // queryString = 'UPDATE ... SET '
    // newValues = {sth: 2, test: 3}
    // returns: Update ... SET sth = 2, test = 3
    let objEntries = Object.entries(newValues);
    for (const [i, [property, value]] of objEntries.entries()) {
        if (i == 0) 
            queryString += ` ${property} = '${value}'`
        else if (i < objEntries.length)
            queryString += `, ${property} = '${value}'`
    }
    return queryString;
}

module.exports = {
    normalizeQueryString,
    toHex,
    toInt,
    addZero,
    checkForeignKey,
    setToQueryString
}