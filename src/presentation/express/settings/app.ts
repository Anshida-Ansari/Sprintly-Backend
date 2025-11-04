import express from 'express'
const app = express()
import cors from 'cors'
import { authRouter } from '../router/auth/auth.router'

app.use(cors({
    origin:"http://localhost:2000",
    credentials:true
}))

app.use("/api/auth",authRouter)

app.use(express.json())



export default app