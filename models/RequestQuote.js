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
        unique:true,
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
        type:mongoose.Schema.Types.ObjectId,
        ref:'Service'
    },
    options:{
        type:String,
        required:true,
        trim:true,
    },
    image:{
        type:String,
    },
    status:{
        type:String,
        enum:['pending', 'confirmed'],
        default:'pending',
    },

},{timestamps:true})

const RequestQuote = models?.RequestQuote || model('RequestQuote', RequestQuoteSchema)

export default RequestQuote