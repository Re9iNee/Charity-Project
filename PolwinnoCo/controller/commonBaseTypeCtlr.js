const {ws_loadBaseType,ws_createBaseType,ws_updateBaseType,ws_deleteBaseType} = require("../services/commonBaseType");
const {poolConnect , pool} = require('../utils/charityDb ');



exports.getCommonBaseType = async (req, res) => {
    let query = req.query;
    // T01 - Method 01
    // path: /commonBaseType/?CommonBaseTypeId=4&BaseTypeCode=3&BaseTypeTitle=Asghar
    const result = await ws_loadBaseType({
        pool,
        poolConnect
    }, {
        BaseTypeCode: query.BaseTypeCode,
        BaseTypeTitle: query.BaseTypeTitle,
        CommonBaseTypeId: query.CommonBaseTypeId
    });
    res.send(result)
};

exports.creatCommonBaseType = async (req, res) => {
    // T01 - Method 02
    // Attach BaseTypeTitle via JSON File to request.body
    const result = await ws_createBaseType({
        pool,
        poolConnect
    }, req.body.BaseTypeTitle)
    res.send({
        result
    })
};

exports.updateCommonBaseType = async (req, res) => {
    // T01 - Method 03
    // Attach BaseTypeTitle And Filter Object via JSON File to request.body
    let filters = req.body.filters;
    let newTitle = req.body.BaseTypeTitle;
    const result = await ws_updateBaseType({
        pool,
        poolConnect
    }, filters, newTitle);
    res.send(result);
};

exports.deleteCommonBaseType = async (req, res) => {
    // T01 - Method 04
    // Attach commonBaseTypeId to JSON Body
    let id = req.body.commonBaseTypeId;
    const result = await ws_deleteBaseType({
        pool,
        poolConnect
    }, id);
    res.send({
        result
    });
}