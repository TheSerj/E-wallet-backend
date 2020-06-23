const express = require('express');
const bodyParser = require('body-parser');
const authRouter = require('./routers/AuthRouter');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.get('/', (req, res)=>{
    res.send("Hello");
})
app.use('/', authRouter);
app.use('/dontAskWhy', express.static(path.join(__dirname, './public/')));
const port = process.env.PORT||3001;
app.listen(port, ()=>{
    console.log("App is running on 4000");
})