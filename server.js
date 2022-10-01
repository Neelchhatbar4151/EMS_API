const Dotenv = require('dotenv');
const Express = require('express');
const App = Express();
const Cors = require('cors');

Dotenv.config({path: './config.env'})
require('./DB/Conn')

App.use(Cors());

App.use(Express.json())

App.use(require('./router/Auth'))

const PORT = process.env.PORT || 5000;


// step 3: Heroku 

 

if ( process.env.NODE_ENV == "production"){

    App.use(Express.static("client/build"));

    const path = require("path");

    App.get("*", (req, res) => {

        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));

    })


}

App.listen(PORT);