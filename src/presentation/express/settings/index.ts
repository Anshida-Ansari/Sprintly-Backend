import { config } from "dotenv";
config()    
import app from "./app.js"
import connectDB from "src/infrastructure/db/mongoose/connect.db.js";

const PORT = process.env.PORT


connectDB()

app.listen(PORT,()=>{
    console.log(`server is running http://localhost:${PORT}`);
})