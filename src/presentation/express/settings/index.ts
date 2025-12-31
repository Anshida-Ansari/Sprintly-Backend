import { config } from "dotenv";
config()    
import app from "./app.js"
import connectDB from "src/infrastructure/db/mongoose/connect.db.js";
import env from "src/infrastructure/providers/env/env.validation.js";

const PORT = env.PORT


connectDB()

app.listen(PORT,()=>{
    console.log(`server is running http://localhost:${PORT}`);
})