const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
    courseId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;