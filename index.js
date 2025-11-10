require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const AdminRouter = require("./routes/admin.route");
const CourseRouter = require("./routes/course.route");
const UserRouter = require("./routes/user.route");
const mongoose = require("mongoose");
const app = express();



app.use(express.json());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));

app.use("/api/v1/admin/", AdminRouter);
app.use("/api/vi/course/", CourseRouter)
app.use("/api/v1/user/", UserRouter);


async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGOURL)
        console.log("DB connected")
    }catch(e){
        console.log(e);
    }
    
}
connectDB(); 

app.listen(3000, function() {
    console.log("Server listening on port 3000");
})


