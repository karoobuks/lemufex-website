// import {Schema, model, models} from "mongoose"
// import bcrypt from 'bcryptjs'


// const UserSchema = new Schema({
//     firstName:{
//         type:String,
//         required:[true, 'Please enter your firstName'],
//         trim:true,
//     },
//     lastName:{
//         type:String,
//         required:[true, 'Please enter your lastName'],
//         trim:true,
//     },
//     email:{
//         type:String,
//         required:[true, 'Please enter your email'],
//         unique:true,
//         trim:true
//     },
//     password:{
//         type:String,
        
//         minlength:6,
//         trim:true,
//     },
//     phone:{
//         type:String,
//         trim:true,
//     },
//     role:{
//         type:String,
//         enum:['admin', 'user'],
//         default:'user',
//     },
//     isTrainee: { type: Boolean, default: false }, // optional helper flag
//      disabled: { type: Boolean, default: false },
//     active:{
//         type:Boolean,
//         default:true,
//         select:false
//     }
// },{timestamps:true,
//      toJSON: { virtuals: true }, 
//   toObject: { virtuals: true }
// },)

// // ✅ Add a virtual hasPassword flag
// UserSchema.virtual("hasPassword").get(function () {
//   return !!this.password
// })

// // ✅ Remove password when sending to client
// UserSchema.set("toJSON", {
//   transform: (doc, ret) => {
//     delete ret.password
//     return ret
//   },
// })



// const User = models?.User || model('User', UserSchema)

// // UserSchema.pre('save', function(next){
// //     if(!this.isModified('password')) return next()
// //         try {
// //             this.password = bcrypt.hash(this.password, 10)
// //             next()
// //         } catch (error) {
// //           next(error)  
// //         }
// // })

// export default User


import { Schema, model, models } from "mongoose";


const UserSchema = new Schema(
  {
   
        firstName: {
      type: String,
      required: [true, "Please enter your firstName"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Please enter your lastName"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      trim: true,
      index:true,
    },
    password: {
      type: String,
      minlength: 6,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  
    authProvider: { type: String, enum: ["manual", "google"], default: "manual" },
    isTrainee: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    resetToken: String,
    resetTokenExpiry: Date,
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        delete ret.password; // ✅ hide password when returning JSON
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// ✅ Add a virtual hasPassword flag
UserSchema.virtual("hasPassword").get(function () {
  return !!this.password;
});

// ⛔ You don’t need a second `set("toJSON")` here anymore —
// it’s already defined in the schema options above

const User = models?.User || model("User", UserSchema);

export default User;
