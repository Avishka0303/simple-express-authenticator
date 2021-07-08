const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation/validation');

//validation
const Joi = require('joi');

const schema =  Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
});

router.post('/register', async (req, res) =>{
    try{

        const {error} = registerValidation(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        //checking if the user is already in the database
        const emailExist = await User.findOne({email: req.body.email});
        if(emailExist) return res.status(400).send('Email already exists');

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            name : req.body.name,
            email : req.body.email,
            password : hashedPassword
        });
        
        const savedUser = await user.save();
        res.send({user:savedUser._id});

    }catch(err){
        console.log(err);
        res.status(400).send(err);
    }
});

router.post('/login' , async (req,res) =>{
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //checking if the user is already in the database
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email does not exist');
    //password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invaid password');

    //create and assign a token
    const token = jwt.sign({ _id : user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);

    //res.send('Logged in');
});

module.exports = router;
