const {
    ws_loadBaseType,
    ws_createBaseType,
    ws_updateBaseType,
    ws_deleteBaseType
} = require("../services/commonBaseType");
const {
    poolConnect,
    pool
} = require('../utils/charityDb');



exports.getCommonBaseType = async (req, res) => {
    try {
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
        res.status(200).json({result});

    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
    }
};

exports.creatCommonBaseType = async (req, res) => {
    
    try {
        // T01 - Method 02
        // Attach BaseTypeTitle via JSON File to request.body
        const result = await ws_createBaseType({
            pool,
            poolConnect
        }, req.body.BaseTypeTitle);


        if(result.status === 'Failed'){

            res.status(422).json({
                result
            });

        } else {

            const baseType = await ws_loadBaseType({
                pool,
                poolConnect
            }, {
                CommonBaseTypeId: result.recordset[0].CommonBaseTypeId
            });

            res.status(201).json({
                baseType
            });
        }    

    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
    }
};

exports.updateCommonBaseType = async (req, res) => {
 
    try {
        // T01 - Method 03
        // Attach BaseTypeTitle And Filter Object via JSON File to request.body
        let filters = req.params.commonBaseTypeId;
        let newBaseTypeTitle = req.body.BaseTypeTitle;

        const result = await ws_updateBaseType({
            pool,
            poolConnect
        }, {CommonBaseTypeId : filters}, {BaseTypeTitle : newBaseTypeTitle});

     

        if(result.status === 'Failed'){

            res.status(422).json({
                result
            });

        } else {

            const baseType = await ws_loadBaseType({
                pool,
                poolConnect
            }, {
                CommonBaseTypeId: result.recordset[0].CommonBaseTypeId
            });

            res.status(200).json({
                baseType
            });
        }

    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
    }
};

exports.deleteCommonBaseType = async (req, res) => {
   
    try {
            // T01 - Method 04
        // Attach commonBaseTypeId to JSON Body
        let id = req.params.commonBaseTypeId;
        const result = await ws_deleteBaseType({
            pool,
            poolConnect
        }, id);

        if(result.status === 'Failed'){
            res.status(422).json({
                result
            });
        } else {
            res.status(200).json({
                result
            });
        }
        
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
    }
}