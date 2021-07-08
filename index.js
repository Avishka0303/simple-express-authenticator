const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

//import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

//connect to db
mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true },
).then(
    ()=>{console.log('successfull connected to database')},
    err =>{console.log(err)}
);

//middelware
app.use(express.json())
//route middleware
app.use('/api/user', authRoute); //api/user is prefix
app.use('/api/posts', postRoute);

app.listen(3000, ()=>{
    console.log('Server up and running');
})
