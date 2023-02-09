const { S3, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const fs = require('fs')
require('dotenv').config({ path: './config.env' });

const Region = "us-east-1";
const AccessKey = process.env.ACCESS_KEY;
const PrivateAccessKey = process.env.PRIVATE_ACCESS_KEY;

const s3 = new S3({
      region: Region,
      credentials: {
            accessKeyId: AccessKey,
            secretAccessKey: PrivateAccessKey
      }
})

exports.putObject = async (file, email) => {
      try {
            const fileStream = fs.readFileSync(file.path);
            const uploadParams = {
                  Bucket: "ems-code",
                  Body: fileStream,
                  Key: email,
                  ContentType: file.mimetype
            }
            return s3.send(new PutObjectCommand(uploadParams));
      } catch (error) {
            console.log(error)
            return error;
      }
}
exports.deleteFile = (fileName) => {
      const deleteParams = {
            Bucket: "ems-code",
            Key: fileName,
      }

      return s3.send(new DeleteObjectCommand(deleteParams));
}
exports.GetObject = async (key) => {
      try {
            const params = {
                  Bucket: 'ems-code',
                  Key: key
            }
            await s3.headObject(params);
            const command = new GetObjectCommand(params);
            const seconds = 10
            const url = await getSignedUrl(s3, command, { expiresIn: seconds });

            return url
      }
      catch (err) {
            if(err.name === 'NotFound'){
                  return 404;
            }
            else {
                  console.log(err)
                  return 500;
            }
      }
}







// AWS.config.update({
//       region: Region,
//       accessKeyId: AccessKey,
//       secretAccessKey: PrivateAccessKey
// });