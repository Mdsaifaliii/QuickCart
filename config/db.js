import mongoose from "mongoose";

let cached = global.mongoosee

if (!cached) {
    cached = global.mongoosee = { conn: null, promise: null }
}
async function connectDB() {
    
    if(cached.conn){
        return cached.conn;
       
    }
     if(!cached.promise){
            const opts = {
                bufferCommands: false,
            }
            cached.promise = mongoose.connect(`${process.env.MONGODB_URI}/quickcart`,opts).then( mongoose =>{
                return mongoose;
     })
                
        }
        cached.conn = await cached.promise
        return cached.conn
}

export default connectDB;