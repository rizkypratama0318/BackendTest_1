require('dotenv').config()
const bodyParser = require("body-parser");
const express = require("express");
const passport = require("passport");
const app = express();
// const bodyParser = require('body-parser');
const router = require("./router");
const input = require("./dataUser/router");
const mongoose = require('mongoose');
const Redis = require('./redis.connect');

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
.then(res => {
    console.log('database terhubung')
})
.catch(e => {
    console.log('database error')
})

//passport authentication
// app.use(passport.initialize());
// require("./passportconfig")(passport);

app.use(bodyParser.json());
app.use('/', router);
app.use('/datauser', input);



app.listen(process.env.PORT, (req, res)=> {
    console.log(`server run port ${process.env.PORT}`)
})