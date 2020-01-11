const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config();

aws.config.update({
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  accessKeyId: process.env.ACCESS_KEY_ID,
  region: 'eu-west-2'
});

const s3 = new aws.S3({});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'backend-shop-images',
    acl: 'public-read',
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
      cb(null, `image-${Date.now().toString()}`);
    }
  })
});

module.exports = upload;
