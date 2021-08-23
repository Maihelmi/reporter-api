const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const reporterSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true      
    },
    age:{
        type:Number,
        default:20,
        validate(value){
            if(value < 0){
                throw new Error ('Age must be positive number')
            }
        }
    },
    email:{
        type:String,
        trim:true,
        required:true,
        lowercase:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password:{
        type:String, 
        required:true,
        trim:true,
        minLength:6
    },
    phoneNumber:{
        type:Number, 
        required:true,
        trim:true,
        minLength:11
    },

    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ],

    avatar:{
        type:Buffer
    }
})

reporterSchema.virtual('reporters',{
    ref:'News',    
    localField:'_id',
    foreignField:'owner'
})


reporterSchema.pre('save',async function(next){
    
    const reporter = this
    if(reporter.isModified('password')){
        reporter.password = await bcrypt.hash(reporter.password,8)
    }
    next()
})


reporterSchema.statics.findByCredentials = async(email,password) =>{
    const reporter = await Reporter.findOne({email})
    console.log(reporter)

    if(!reporter){
        throw new Error('Unable to login. Please check email or password')
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error('Unable to login. Please check email or password')
    }

    return reporter
}



reporterSchema.methods.generateToken = async function(){
    const reporter = this
    const token = jwt.sign({_id:user._id.toString()},'node-course',{expiresIn:'7 days'})

    reporter.tokens = reporter.tokens.concat({token:token})
    await reporter.save()

    return token
}


const Reporter = mongoose.model('Reporter',reporterSchema)
module.exports = Reporter