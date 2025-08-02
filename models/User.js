import {Schema, model, models} from "mongoose"
import bcrypt from 'bcryptjs'


const UserSchema = new Schema({
    firstName:{
        type:String,
        required:[true, 'Please enter your firstName'],
        trim:true,
    },
    lastName:{
        type:String,
        required:[true, 'Please enter your lastName'],
        trim:true,
    },
    email:{
        type:String,
        required:[true, 'Please enter your email'],
        unique:true,
        trim:true
    },
    password:{
        type:String,
        
        minlength:6,
        trim:true,
    },
    phone:{
        type:String,
        trim:true,
    },
    role:{
        type:String,
        enum:['admin', 'user'],
        default:'user',
    },
    isTrainee: { type: Boolean, default: false }, // optional helper flag
},{timestamps:true})

const User = models?.User || model('User', UserSchema)

// UserSchema.pre('save', function(next){
//     if(!this.isModified('password')) return next()
//         try {
//             this.password = bcrypt.hash(this.password, 10)
//             next()
//         } catch (error) {
//           next(error)  
//         }
// })

export default User