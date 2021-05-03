const multer = require('multer');




    const storage = multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, "./public/uploads");
        },
        filename: (req, file, callback) => {
            callback(null, file.fieldname + '-' + Date.now());
        },
    });

    const fileFilter = (req, file, callback) => {
        if (file.mimetype == "image/png") {
            callback(null, true);
        } else {
            callback("تنها پسوند png پشتیبانی میشود", false);
        }
    };

    const upload = multer({
        storage: storage,
        fileFilter: fileFilter
    });

   

    module.exports = upload;