const Dotenv = require('dotenv');
const Express = require('express');
const App = Express();
const Cors = require('cors');
const mongoose = require('mongoose');
const path = require("path");
const fs = require('fs');
const https = require('https');
Dotenv.config({ path: './config.env' })
App.use(Cors());

App.use(Express.json())

const key = fs.readFileSync('private.key');
const cert = fs.readFileSync('certificate.crt');

const cred = {
    key,
    cert
}

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

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    // App.listen(PORT, () => {
    //     console.log("listening for requests");
    // })
    https.createServer(cred, App)
        .listen(5000, function (req, res) {
            console.log("Server started at port 5000");
        });
    // App.use(Express.static(path.join(__dirname, "./client/build")));

    // App.get("*", (req, res) => {

    //     res.sendFile(path.join(__dirname, "./client/build/index.html"), function (err) { res.status(500).send(err); });

    // })
})

// App.listen(PORT);

// "client": "npm start --prefix client",
