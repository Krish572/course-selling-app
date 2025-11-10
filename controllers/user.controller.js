const jwt = require("jsonwebtoken");
const {signupSchema} = require("../validations/signupValidation");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");

async function signup(req, res){
    const parseSuccess = signupSchema.safeParse(req.body);

    if(!parseSuccess.success){
        return res.status(400).json({
            message: (JSON.parse(parseSuccess.error.message)).map(er => er.message)
        })
    }
    const {email, firstName, lastName, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 5);
    
    try{
        await User.create({
            email,
            firstName,
            lastName,
            password: hashedPassword
        })
        res.status(201).json({message: "Sign up successfull"});
    }catch(e){
        res.status(500).json({message: "Internal Server problem"});
    }
}

async function signin(req, res){
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                message: "Incorrect username or password"
            })
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch){
            return res.status(401).json({
                message: "Incorrect password"
            })
        }
        const token = jwt.sign({id: user._id}, process.env.USER_JWT_SECRET);
        res.status(200).json({token});
    }catch(e){
        res.status(500).json({
            message: "Internal server problem"
        })
    }
}

module.exports = {
    signup,
    signin
}