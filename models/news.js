const mongoose = require('mongoose')

const newSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    image:{
        type:Buffer
    }
})

const News = mongoose.model('News',newSchema)
module.exports = News