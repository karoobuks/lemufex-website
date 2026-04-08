import mongoose,{ Schema, models, model} from "mongoose";

const RequestQuoteSchema = new Schema({
    name:{
        type:String,
        required:[true, 'Please enter your name'],
        trim:true
    },
    email:{
        type:String,
        required:[true, 'Please enter your email'],
    },
    phone:{
        type:String,
        trim:true
    },
    message:{
        type:String,
        required:true,
    },
    service:{
        type:String,
        required:true,
        trim:true,
    },
    options:{
        type:String,
        trim:true,
    },
    image:{
        type:String,
    },
    status:{
        type:String,
        enum:['pending', 'replied', 'closed'],
        default:'pending',
    },
    adminReply:{
        type:String,
        default:null,
    },
    repliedAt:{
        type:Date,
        default:null,
    },
},{timestamps:true})

const RequestQuote = models?.RequestQuote || model('RequestQuote', RequestQuoteSchema)

export default RequestQuote