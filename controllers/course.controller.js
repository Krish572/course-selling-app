const {cloudinary} = require("../cloudinary");
const Course = require("../models/course.model")

async function createCourse(req, res) {

    try{
        const {title, description, price} = req.body;

        if(!title || !description || !price){
            return res.status(400).json("All fields are required");
        }
        const {image} = req.files
        if(!image || Object.keys(req.files).length == 0){
            res.status(400).json("No files uploaded");
        }
        const allowedFormat = ["image/png", "image/jpeg"];
        if(!allowedFormat.includes(image.mimetype)){
            return res.status(400).json({
                message: "Invalid file format"
            })
        }
        const response = await cloudinary.uploader.upload(image.tempFilePath);
        if(!response || response.error){
            return res.status(400).json({
                message: "Error while uploading the image to cloudinary"
            })
        }

        await Course.create({
            title,
            description,
            price,
            creatorId : req.id,
            image: response.secure_url
        })

        res.status(200).json("Course succesfully created");

    }catch(e){
        res.status(500).json({
            message: "Error while creating course"
        })
        console.log(e);
    }
}

async function courses(req, res){
    try{
        const courses = await Course.find({});
        res.status(200).json({
            "course": courses
        })
    }catch(e){
        res.status(500).json({message: "Internal Server Error"});
    }
}

async function updateCourse(req, res){
    const {id} = req.params;
    const course = await Course.findById(id);
    if(!course){
        return res.status(404).json({message: "Course not found"});
    }
    if(!req.files.image || Object.keys(req.files).length == 0){
        return res.status(404).json({message: "Image field is required"});
    }
    const image = req.files.image;
    const allowedFormat = ["image/jpeg", "image/png"];
    if(!allowedFormat.includes(image.mimetype)){
        return res.status(404).json({message: "Invalid format"});
    }
    const imageUpload = await cloudinary.uploader.upload(req.files.image.tempFilePath);
    if(!imageUpload || imageUpload.error){
        return res.status(500).json("Error while uploading image to cloud");
    }
    await Course.findByIdAndUpdate(id, {
        title: req.body.title,
        description: req.body.description,
        image: imageUpload.secure_url,
        price: req.body.price
    }, {new: true})
    res.status(200).json({message: "Course Updated Successfully"});
}

module.exports = {
    createCourse,
    courses,
    updateCourse
}