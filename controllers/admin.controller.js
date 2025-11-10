const {z} = require("zod");
const bycrpt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {signupSchema} = require("../validations/signupValidation")
const Admin = require("../models/admin.model");

async function signup(req, res) {
    
    const parseSuccess = await signupSchema.safeParse(req.body);

    if(!parseSuccess.success){
        return res.status(400).json({
            message: (JSON.parse(parseSuccess.error.message)).map(er => er.message)
        })
    }

    const {email, password, firstName, lastName} = req.body;

    const hashedPassword = await bycrpt.hash(password, 5);

    try{
        const admin = await Admin.findOne({email});
        if(admin){
            return res.status(401).json({
                message: "Email already exits"
            })
        }
        await Admin.create({
            email,
            password: hashedPassword,
            firstName,
            lastName
        })
        res.status(201).json({
            message: "Admin Sign Up succesfull"
        })
    }catch(e){
        res.status(500).json({
            message: "Error in signing up"
        })
        console.log("Error while signing up " + e);
    }
}

async function signin(req, res) {
    const {email, password} = req.body;

    try{
        const admin = await Admin.findOne({email});
        if(!admin){
            return res.status(401).json({
                message: "Incorrect email or password"
            })
        }
        const passwordMatch = await bycrpt.compare(password, admin.password);

        if(!passwordMatch){
            return res.status(401).json({
                message: "Incorrect password"
            })
        }

        const token = jwt.sign({id : admin._id}, process.env.ADMIN_JWT_SECRET);

        res.status(200).json({
            token
        });

    }catch(e){
        res.status(500).json({
            message : "Error while signing in"
        })
    }

}

module.exports = {
    signup,
    signin
}