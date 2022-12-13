const Dotenv = require('dotenv');
const Express = require('express');
const App = Express();
const Cors = require('cors');
const mongoose = require('mongoose');
const path = require("path");
Dotenv.config({ path: './config.env' })
App.use(Cors());

App.use(Express.json())

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

App.use(require("./router/Auth"))

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    App.listen(PORT, () => {
        console.log("listening for requests");
    })

    // App.use(Express.static(path.join(__dirname, "./client/build")));

    // App.get("*", (req, res) => {

    //     res.sendFile(path.join(__dirname, "./client/build/index.html"), function (err) { res.status(500).send(err); });

    // })
})

// App.listen(PORT);

// "client": "npm start --prefix client",