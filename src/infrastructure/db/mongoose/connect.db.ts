import mongoose from "mongoose";


const connectDB = async(): Promise<void> =>{
    try {
        console.log('db is starting');
        
      let db =   await mongoose.connect(process.env.MONGO_URI as string)
      
        console.log('MongoDB Connected Successfully');
        
    } catch (error) {

        console.log('MongoDB Connection Error:', error);
        process.exit(1)
    }
}


export default connectDB