import express from 'express'
const app = express()
import cors from 'cors'
import { adminRouter } from '../router/admin/admin.router'
import { authRouter } from '../router/auth/auth.router'
import { superadminRouter } from '../router/superadmin/superadmin.router'

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))


app.use(express.json())

app.use("/api/auth",authRouter)
app.use("/api/admin",adminRouter)
app.use("/api/superadmin",superadminRouter)


export default app