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

exports.putObject = async (file) => {
      try {
            const fileStream = fs.readFileSync(file.path);
            const uploadParams = {
                  Bucket: "ems-code",
                  Body: fileStream,
                  Key: file.filename,
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

      return s3Client.send(new DeleteObjectCommand(deleteParams));
}
exports.GetObject = async (key) => {
      const params = {
            Bucket: 'ems-code',
            Key: key
      }

      const command = new GetObjectCommand(params);
      const seconds = 60
      const url = await getSignedUrl(s3, command, { expiresIn: seconds });

      return url
}







// AWS.config.update({
//       region: Region,
//       accessKeyId: AccessKey,
//       secretAccessKey: PrivateAccessKey
// });