import express from 'express'
const app = express()
import cors from 'cors'

app.use(cors({
    origin:"http://localhost:2000",
    credentials:true
}))

app.use(express.json())



export default app