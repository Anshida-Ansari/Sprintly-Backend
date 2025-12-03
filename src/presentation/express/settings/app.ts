import express from 'express'
const app = express()
import cors from 'cors'
import { adminRouter } from '../router/admin/admin.router'
import { authRouter } from '../router/auth/auth.router'

app.use(cors({
    origin:"http://localhost:2000",
    credentials:true
}))


app.use(express.json())

app.use("/api/auth",authRouter)
app.use("/api",adminRouter)


export default app