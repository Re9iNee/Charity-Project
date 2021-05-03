const {
    pool,
    poolConnect
} = require('../utils/charityDb');
const {
    ws_loadPersonal,
    ws_createPersonal,
    ws_updatePersonal,
    ws_deletePersonal
} = require('../services/personal');


exports.getPersonalData = async (res, req) => {

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

    res.send({
        result
    });
};


exports.createPersonalData = async (req, res) => {

    let values = req.body;
    let image = req.files;
      
    const imagePath = fs.readFileSync(image[0].path);
    const encode_image = imagePath.toString('base64');
    let PersonPhoto = {contentType: image[0].mimetype , image: new Buffer.from(encode_image , 'base64')};
 
    const result = await ws_createPersonal({
        pool,
        poolConnect
    }, values , PersonPhoto);

    res.send(result);
};


exports.updatePersonalData = async (req, res) => {

    let newValues = req.body.newValues;
    let filters = req.body.filters;

    const result = await ws_updatePersonal({
        pool,
        poolConnect
    }, filters, newValues);

    res.send({
        result
    });
};


exports.deletePersonalData = async (req, res) => {

    const accountId = req.body.PersonId;

    const result = await ws_deletePersonal({
        pool,
        poolConnect
    }, accountId);

    res.send({
        result
    });
};