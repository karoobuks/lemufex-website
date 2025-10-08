import mongoose from "mongoose";

let connected = false

const connectedDB = async () =>{
    mongoose.set('strictQuery', true)

    if(connected){
        console.log('mongoDB is connect✅')
        return
    }

    if(!process.env.MONGODB_URI){
        throw new Error("❌MONGO_URI not defined in .env")
    }

    

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // ⏱ fail fast (5s instead of 10s+)
        })
         
        connected = true
    } catch (error) {
        console.log("Mongo connection error:",error.message) 
        throw error       
    }
}

export default connectedDB