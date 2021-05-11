const {
    pool,
    poolConnect
} = require('../utils/charityDb');
const {
    ws_loadNeedyAccount,
    ws_createNeedyAccount,
    ws_updateNeedyAccount,
    ws_deleteNeedyAccount
} = require('../services/needy');


exports.getNeedyAccount = async (req, res) => {

    try {
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

        res.send({
            result
        });
    } catch (err) {
        console.log(err);
    }
};


exports.createNeedyAccount = async (req, res) => {

    try {
        let values = req.body;

        const result = await ws_createNeedyAccount({
            pool,
            poolConnect
        }, values);

        res.send({
            result
        });

    } catch (err) {
        console.log(err);
    }
};

exports.updateNeedyAccount = async (req, res) => {

    try {
        let newValues = req.body.newValues;
        let filters = req.body.filters;

        const result = await ws_updateNeedyAccount({
            pool,
            poolConnect
        }, filters, newValues);

        res.send({
            result
        });
    } catch (err) {
        console.log(err);
    }
};


exports.deleteNeedyAccount = async (req, res) => {

    try {
        const {NeedyAccountId , NeedyId , AccountNumber} = req.body;

        const result = await ws_deleteNeedyAccount({
            pool,
            poolConnect
        }, NeedyAccountId , NeedyId , AccountNumber);

        res.send({
            result
        });
    } catch (err) {
        console.log(err);
    }
};