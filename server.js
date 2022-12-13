const Dotenv = require('dotenv');
const Express = require('express');
const App = Express();
const Cors = require('cors');
const path = require("path");
Dotenv.config({path: './config.env'})
App.use(Cors());

App.use(Express.json())

App.use(require("./router/Auth"))

const PORT = process.env.PORT || 5000;

// App.use(Express.static(path.join(__dirname, "./client/build")));

// App.get("*", (req, res) => {

//     res.sendFile(path.join(__dirname, "./client/build/index.html"), function(err){res.status(500).send(err);});

// })

App.listen(PORT);

// "client": "npm start --prefix client",