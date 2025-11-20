import express from 'express'
const app = express()
import cors from 'cors'
import router from '../router/auth/auth.router'

app.use(cors({
    origin:"http://localhost:2000",
    credentials:true
}))


app.use(express.json())

app.use("/api/auth",router)

export default app