const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_secret = "ThisIsSecretMessage";
const fetchuser = require('../middleware/fetchuser');

// ROUTE 1 : Create a user using : POST "/api/auth/createUser".   No login required
router.post('/createUser', [
    body('name','Enter a valid name').isLength({min:3}),
    body('email','Enter a valid email').isEmail(),
    body('password','Password should contain atleast 5 characters').isLength({min:5}),
], async (req,res)=>{
    // console.log(req.body);
    // const user = User(req.body);
    // user.save();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()});
    }

    let success = false;

    // To find if an email already exist (we have made unique in the schema so we actually don't need to check)
    let emailExist = await User.findOne(({email:req.body.email}));
    if(emailExist){
        return res.status(400).json({success,error:"Sorry this email already exists"});
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password,salt);

    try{
        // Using async/await
        let user = await User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: secPass
                });
        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data,JWT_secret);  // No need to write await cause it Synchronous.
        success = true;      
        res.json({success,authtoken});
        // res.json(user);


        // Using .then()
        // User.create({
        //     name: req.body.name,
        //     email: req.body.email,
        //     password: req.body.password
        // }).then(user => res.json(user)).catch(err => {res.json({error: "Please enter a unique email", message:err.message})});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).send("Internal server error");
    }
    // res.send(req.body);
})

// ROUTE 2 : Create a login using : POST "/api/auth/login".   No login required
router.post('/login', [
    body('email','Enter a valid email').isEmail(),
    body('password','Passward cannot be blank').exists(),
], async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()});
    }

    const {email,password} = req.body;
    try{
        let success = false;
        let emailExist = await User.findOne(({email}));
        if(!emailExist){
            return res.status(400).json({success, error:"Please login with correct email"});
        }

        let user = emailExist;
        const passwordCompare = await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            return res.status(400).json({success,error:"Incorrect password"});
        }
        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data,JWT_secret);  // No need to write await cause it Synchronous. 
        success = true;     
        res.json({success,authtoken});
    }
    catch(error){
        // console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

// ROUTE 3 : Get logged in user details : POST "/api/auth/getuser".   Login required
router.post('/getuser', fetchuser, async (req,res)=>{
    try{
        const userId = req.user.id;  
        const user = await User.findById(userId).select("-password");  // finding the person with the user Id and selecting all the details of the user except the password.
        res.send(user);  
    }
    catch(error){
        // console.error(error.message);
        res.status(500).send("Internal server error");
    }
})


module.exports = router
