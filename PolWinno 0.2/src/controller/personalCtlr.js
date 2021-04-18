const {pool , poolConnect} = require('../utils/charityDb ');
const {ws_loadPersonal , ws_createPersonal , ws_updatePersonal , ws_deletePersonal} = require('../services/personal');


exports.getPersonalData = async (res , req) => {

    let query = req.query;

    const result = await ws_loadPersonal({
        pool,
        poolConnect
    }, {
        Name: query.Name,
        Family: query.Family,
        NationalCode: query.NationalCode,
        IdNumber: query.IdNumber,
        Sex: query.Sex,
        BirthDate: query.BirthDate,
        BirthPlace: query.BirthPlace,
        PersonType: query.PersonType,
        PersonPhoto: query.PersonPhoto,
    });

    res.send(result);
};


exports.createPersonalData = async (req, res) => {

    let values = req.body;

    const resault = await ws_createPersonal( {pool , poolConnect} , values );

    res.send(resault);
};


exports.updatePersonalData = async (req, res) => {

    let newValues = req.body.values;
    let filters = req.body.filters;

    const resault = await ws_updatePersonal( {pool , poolConnect} , filters ,newValues );

    res.send(resault);
};


exports.deletePersonalData = async (req, res) => {

    const accountId = req.body.PersonId;

    const result = await ws_deletePersonal( {pool , poolConnect} , accountId );

    res.send(result);
};