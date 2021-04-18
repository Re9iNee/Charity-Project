const {pool , poolConnect} = require('../utils/charityDb ');
const {ws_loadNeedyAccount , ws_createNeedyAccount , ws_updateNeedyAccount , ws_deleteNeedyAccount} = require('../services/needy');


exports.getNeedyAccount = async (res , req) => {

    let query = req.query;

    const result = await ws_loadNeedyAccount({
        pool,
        poolConnect
    }, {
        BankId: query.BankId,
        NeedyId: query.NeedyId,
        OwnerName: query.OwnerName,
        CardNumber: query.CardNumber,
        AccountNumber: query.AccountNumber,
        AccountName: query.AccountName,
        ShebaNumber: query.ShebaNumber,
    });

    res.send(result);
};


exports.createNeedyAccount = async (req, res) => {

    let values = req.body;

    const resault = await ws_createNeedyAccount( {pool , poolConnect} , values );

    res.send(resault);
};


exports.updateNeedyAccount = async (req, res) => {

    let newValues = req.body.values;
    let filters = req.body.filters;

    const resault = await ws_updateNeedyAccount( {pool , poolConnect} , filters ,newValues );

    res.send(resault);
};


exports.deleteNeedyAccount = async (req, res) => {

    const accountId = req.body.NeedyAccountId;

    const result = await ws_deleteNeedyAccount( {pool , poolConnect} , accountId );

    res.send(result);
};

