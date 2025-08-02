import mongoose,{Schema, models, model} from "mongoose";

const ServiceSchema = new Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    image:{
        type:String,
    },
    category:{
        type:String,
    },
    slug:{
        type:String,
    }
},{timestamps:true})

const Service = models?.Service || model('Service', ServiceSchema)

export default Service