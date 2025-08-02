import mongoose from "mongoose";

let connected = false

const connectedDB = async () =>{
    mongoose.set('strictQuery', true)

    if(connected){
        console.log('mongoDB is connect✅')
        return
    }

    

    try {
        await mongoose.connect(process.env.MONGODB_URI)
        connected = true
    } catch (error) {
        console.log(error)        
    }
}

export default connectedDB