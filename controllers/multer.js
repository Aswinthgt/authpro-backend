const multer = require("multer");
const path = require("path");


let storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    },
})

const size =10 * 1024 * 1024;
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1000 * 1000 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const minetype = filetypes.test(file.mimetype);
        if (extname && minetype) {
            return cb(null, true)
        } else {
            cb(`Error: Images Only`)
        }

    }
})



module.exports = { upload };