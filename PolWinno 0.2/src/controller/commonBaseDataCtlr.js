const {
    ws_loadBaseValue,
    ws_createBaseValue,
    ws_updateBaseValue,
    ws_deleteBaseValue
} = require("../services/commonBaseData");
const {
    poolConnect,
    pool
} = require('../utils/charityDb');


exports.getCommonBaseData = async (req, res) => {
    try {
         let query = req.query;
         // T02 - Method 01
         // path: /commonBaseData/?CommonBaseDataId=4&BaseCode=3&BaseValue=Asghar&CommonBaseTypeId=1
         const result = await ws_loadBaseValue({
             pool,
             poolConnect
         }, {
             CommonBaseDataId: query.CommonBaseDataId,
             BaseCode: query.BaseCode,
             BaseValue: query.BaseValue,
             CommonBaseTypeId: query.CommonBaseTypeId
         });
         res.status(200).json({result});
    } catch (err) {
     console.log(err);
     if (!err.statusCode) {
         err.statusCode = 500;
     }
    }
 };

exports.createCommonBaseData = async (req, res) => {
    // T02 - Method 02
    // Attach baseValue and commonBaseTypeId to request body
    const result = await ws_createBaseValue({
        pool,
        poolConnect
    }, req.body)
    res.send({
        result
    });
};

exports.updateCommonBaseData = async (req, res) => {
    // T02 - Method 03
    // Attach filters object and newValues to request body
    const result = await ws_updateBaseValue({
        pool,
        poolConnect
    }, req.body.filters, req.body.newValues);
    res.send({
        result
    });
};

exports.deleteCommonBaseData = async (req, res) => {
    // T02 - Method 04
    // Attach commonBaseDataId to request body
    const result = await ws_deleteBaseValue({
        pool,
        poolConnect
    }, req.body.commonBaseDataId);
    res.send({
        result
    });
};