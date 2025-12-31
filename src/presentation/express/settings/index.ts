import { config } from "dotenv";

config();


import connectDB from "src/infrastructure/db/mongoose/connect.db.js";
import env from "src/infrastructure/providers/env/env.validation.js";
import app from "./app.js";


const PORT = env.PORT;

connectDB();

app.listen(PORT, () => {
	console.log(`server is running http://localhost:${PORT}`);
});
