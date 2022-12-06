const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser')
const cors = require('cors')
const userRouter = require('./routes/user')

const app = express();

dotenv.config();
require('./db_connections/mongodbAtlas')

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: false} ))

app.get('/', (req, res)=> {
    res.send({msg: 'Response from this'});
})
app.post('/', (req, res)=> {
    res.send({msg: 'Response from Post'});
})

app.use('/api/user', userRouter);

app.listen(process.env.PORT, ()=>{
    console.log(`Backend is Running at ${process.env.PORT}`);
})