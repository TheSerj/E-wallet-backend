const express = require('express');
const bodyParser = require('body-parser');
const authRouter = express.Router();
const users = require('../models/users');
const profiles = require('../models/profile');
const mongoose = require('mongoose');
const url = "mongodb+srv://devmittalciv16:dev%40gmail@cluster0-bkkbu.mongodb.net";
const username = "devmittalciv16";
const password = "dev@gmail";
const connect = mongoose.connect(`mongodb+srv://${username}:${password}@cluster0-bkkbu.mongodb.net`, {
    useNewUrlParser:true
});
const jwt = require('jsonwebtoken');

connect.then((db) =>{
    console.log('Connect to database');
});

authRouter.use(bodyParser.json());

authRouter.post('/signup', (req, res)=>{
    users.findOne({email:req.body.email}).then(data=>{
        if(data){
            res.json({message:"user already exists with this email"});
        }else{
            var newUser = users(req.body);
            var newProfile = profiles(req.body);
            newProfile.save((err, doc)=>{
                console.log(doc);
            });
            newUser.save((err, doc)=>{
                console.log(doc);
            });
            res.json({message:"user created"});
        }
    })
});

authRouter.post('/getprofile', (req, res)=>{
    var email = req.body.email;
    var token = req.body.token;
    var legit = jwt.verify(token, "secret", {expiresIn: "3hr"});
    if(legit.email!=email)return;
    profiles.findOne({email:email}).then(data=>{
        res.json(data);
    })
})

authRouter.post('/login', (req, res)=>{
    res.setHeader('Content-Type', 'application/json');
    var email = req.body.email;
    var password = req.body.password;
    users.findOne({email:email, password:password}).then(data=>{
        if(data){
            const token = jwt.sign(
                { email: email, _id: data._id },
                "secret",
                {expiresIn: "3hr"}
            );
            res.json({token:token, email:email});
        }else{
            res.json("wrong info");
        }
    })
});

authRouter.post('/addmoney', (req, res)=>{
    var amount = req.body.amount;
    var email = req.body.email;
    var token = req.body.token;
    var legit = jwt.verify(token, "secret", {expiresIn: "3hr"});
    if(legit.email!=email)return;
    var dateObject = new Date();
    var date = dateObject.toISOString();

    var trans = {
        transType:"Money Added",
        amount:amount,
        date:date
    }
    
    profiles.findOne({email:email}, (err, doc)=>{
        var balance = doc.balance;
        var update = {$set:{balance:balance+amount}, $push:{transHistory:trans}};
        profiles.findOneAndUpdate({email:email}, update, (err, doc)=>{
            res.send(doc);
        });
    });

});

authRouter.post('/withdrawmoney', (req, res)=>{
    var amount = req.body.amount;
    var email = req.body.email;
    var token = req.body.token;
    var legit = jwt.verify(token, "secret", {expiresIn: "3hr"});
    if(legit.email!=email)return;
    var dateObject = new Date();
    var date = dateObject.toISOString();

    var trans = {
        transType:"Money Withdrawn",
        amount:amount,
        date:date
    }
    
    profiles.findOne({email:email}, (err, doc)=>{
        var balance = doc.balance;
        var update = {$set:{balance:balance-amount}, $push:{transHistory:trans}};
        profiles.findOneAndUpdate({email:email}, update, (err, doc)=>{
            res.send(doc);
        });
    });
});

authRouter.get('/users', (req, res)=>{
    profiles.find({}, (err, doc)=>{
        res.send(doc);
    });
});

authRouter.get('/delete', (req, res)=>{
    profiles.remove({}, (err)=>{
        console.log("All profiles deleted");
    })
    users.remove({}, (err)=>{
        console.log("All users deleted");
    })
})


module.exports = authRouter;