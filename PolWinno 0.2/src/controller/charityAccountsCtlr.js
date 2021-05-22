const {
    ws_loadCharityAccounts,
    ws_createCharityAccounts,
    ws_updateCharityAccounts,
    ws_deleteCharityAccounts
} = require("../services/charityAccounts");
const {
    poolConnect,
    pool
} = require('../utils/charityDb');



exports.getCharityAccount = async (req, res) => {
   
    try {
        let query = req.query;
        // T03 - Method 01
        // path: /charityAccounts/?CharityAccountId=1&BankId=6&BranchName=Ame&OwnerName=Reza
        const result = await ws_loadCharityAccounts({
            pool,
            poolConnect
        }, {
            BankId: query.BankId,
            BranchName: query.BranchName,
            OwnerName: query.OwnerName,
            CardNumber: query.CardNumber,
            AccountNumber: query.AccountNumber,
            AccountName: query.AccountName,
            CharityAccountId: query.CharityAccountId,
            BaseTypeCode: query.BaseTypeCode,
        });
        // Easier way to send request is to send query object itself, but when it comes to typo it throws an error
        res.status(200).json({result});

    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
    }

}


exports.createCharityAccount = async (req, res) => {
 
    try {
        
        // T04 - Method 02
        // Attach params to body as an JSON format - Postman Request:
        // https://documenter.getpostman.com/view/6106774/TzCQa6DK#4b0dc741-d2e1-46d4-b63a-e763d1d32ac4
        const result = await ws_createCharityAccounts({
            pool,
            poolConnect
        }, req.body);
        
        
        if(result.status === 'Failed'){

            res.status(422).json({
                result
            });

        } else {
                    
            const charityAccount = await ws_loadCharityAccounts({
                pool,
                poolConnect
            }, {
                charityAccountId: result.recordset[0].CharityAccountId
            });

            res.status(201).json({
                charityAccount
            });
        }

    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
    }
};


exports.updateCharityAccount = async (req, res) => {

    try {
            // T04 - Method 03
        // Attach filters object and newValues to request body
        // parameters: sql connection, filters, newValues
        // returns charityAccounts Table
        let filters = req.params.charityAccountId
        let newValues = req.body.charityAcc;
  
        const result = await ws_updateCharityAccounts({
            pool,
            poolConnect
        },{CharityAccountId:filters} , newValues);

        if(result.status === 'Failed'){

            res.status(422).json({
                result
            });

        } else {
                    
            const charityAccount = await ws_loadCharityAccounts({
                pool,
                poolConnect
            }, {
                charityAccountId: result.recordset[0].CharityAccountId
            });

            res.status(200).json({
                charityAccount
            });
        }

        
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            err.statusCode = 500;
        }
    }
};


exports.deleteCharityAccount = async (req, res) => {

     try {
         // T04 - Method 04
        // parameters: sql connection, charityAccountId
        let id = req.params.charityAccountId;
        const result = await ws_deleteCharityAccounts({
            pool,
            poolConnect
        }, id );
        
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
};