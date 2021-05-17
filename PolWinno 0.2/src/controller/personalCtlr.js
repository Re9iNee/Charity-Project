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
const fs = require('fs');


exports.getPersonalData = async (req, res) => {

   try {
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
         SecretCode: query.SecretCode
      });

      res.send({
         result
      });

   } catch (err) {
      console.log(err);
   }
};


exports.createPersonalData = async (req, res) => {

   try {

      let values = req.body;
      let image = req.files;

      const imagePath = fs.readFileSync(image[0].path);
      const encode_image = imagePath.toString('base64');
      let PersonPhoto = {
         contentType: image[0].mimetype,
         image: new Buffer.from(encode_image, 'base64')
      };


      const result = await ws_createPersonal({
         pool,
         poolConnect
      }, values, PersonPhoto);

      res.send({
         result
      });

   } catch (err) {
      console.log(err);
   }
};


exports.updatePersonalData = async (req, res) => {

   try {
      let newValues = req.body.newValues;
      let filters = req.body.filters

      const result = await ws_updatePersonal({
         pool,
         poolConnect
      }, newValues, filters);

      res.send({
         result
      });

   } catch (err) {
      console.log(err);
   }
};


exports.deletePersonalData = async (req, res) => {

   try {
      const accountId = req.body.PersonId;

      const result = await ws_deletePersonal({
         pool,
         poolConnect
      }, accountId);

      res.send({
         result
      });

   } catch (err) {
      console.log(err);
   }
};