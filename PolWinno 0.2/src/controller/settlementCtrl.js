const {
    ws_Settelment
} = require("../services/settlement");
const {
    poolConnect,
    pool
} = require('../utils/charityDb');




exports.createSettlement = async (req, res) => {

    try {
        let values = req.body;

        const result = await ws_Settelment({
            pool,
            poolConnect
        }, values);

        res.send( {result} );

    } catch (err) {
        console.log(err);
    }
};
