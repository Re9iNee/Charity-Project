const {pool , poolConnect} = require('../utils/charityDb');
const {ws_loadPersonal , ws_createPersonal , ws_updatePersonal , ws_deletePersonal} = require('../services/personal');
const fs = require('fs');


exports.getPersonalData = async (req , res) => {

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

    res.status(200).json({result});

  } catch (err) {
      console.log(err);
      if (!err.statusCode) {
         err.statusCode = 500;
      }
  }
};


exports.createPersonalData = async (req, res) => {

   try {
      
  
   let values = req.body;
   let image = req.files;
   
  
    if( !(typeof image[0] === 'undefined') ){
        const imagePath = fs.readFileSync(image[0].path);
        const encode_image = imagePath.toString('base64');
        let PersonPhoto = {contentType: image[0].mimetype , image: new Buffer.from(encode_image , 'base64')};

        const result = await ws_createPersonal( {pool , poolConnect} , values , PersonPhoto);

        if(result.status === 'Failed'){

            res.status(422).json({
                result
            });
    
        } else {
                    
            let person = await ws_loadPersonal({
                pool,
                poolConnect
            }, {
            PersonId: result.recordset[0].PersonId
            });
    
            res.status(201).json({
            person
            });
        }
    
    }else{
        const result = await ws_createPersonal( {pool , poolConnect} , values );

        if(result.status === 'Failed'){

            res.status(422).json({
                result
            });
    
        } else {
                    
            let person = await ws_loadPersonal({
                pool,
                poolConnect
            }, {
            PersonId: result.recordset[0].PersonId
            });
    
            res.status(201).json({
            person
            });
        }
  }

} catch (err) {
      console.log(err);
      if (!err.statusCode) {
          err.statusCode = 500;
      }
   }
};


exports.updatePersonalData = async (req, res) => {

 try {
    let newValues = req.body;
    let filters = req.params.personId


    const result = await ws_updatePersonal( {pool , poolConnect}  ,newValues , {PersonId : filters});

    if(result.status === 'Failed'){

        res.status(422).json({
            result
        });
  
    } else {
                
        let person = await ws_loadPersonal({
            pool,
            poolConnect
        }, {
           PersonId: result.recordset[0].PersonId
        });
  
        res.status(200).json({
           person
        });
    }

 } catch (err) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
     }
 }
};


exports.deletePersonalData = async (req, res) => {

   try {
    const accountId = req.params.personId;

    const result = await ws_deletePersonal( {pool , poolConnect} , accountId );

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