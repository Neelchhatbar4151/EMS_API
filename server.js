const Dotenv = require('dotenv');
const Express = require('express');
const App = Express();
const Cors = require('cors');
const mongoose = require('mongoose');
const path = require("path");
const fs = require('fs');
const https = require('https');
const s3 = require('./router/s3');
Dotenv.config({ path: './config.env' })
App.use(Cors());

App.use(Express.json())

const key = fs.readFileSync('private.key');
const cert = fs.readFileSync('certificate.crt');

const cred = {
      key,
      cert
}

const PORT = process.env.PORT || 5000;

const DB = process.env.DATABASE;

const connectDB = async () => {
      try {
            const conn = await mongoose.connect(DB, {
                  useNewUrlParser: true,
                  useUnifiedTopology: true,
            });
            console.log(`MongoDB Connected `);
      } catch (error) {
            console.log(error);
            process.exit(1);
      }
}

App.get("/.well-known/pki-validation/A1113D57B8C69E1E3A7D40479FDE003A.txt", (req, res) => {
      res.sendFile(path.join(__dirname, "./A1113D57B8C69E1E3A7D40479FDE003A.txt"), function (err) { res.status(500).send(err); });
})

App.use(require("./router/Auth"))

connectDB().then(() => {
//           https.createServer(cred, App)
//               .listen(443, function (req, res) {
//                   console.log("Server started at port 443");
//               });
      App.listen(PORT)
})
