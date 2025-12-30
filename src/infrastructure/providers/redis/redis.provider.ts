import Redis from 'ioredis'
import 'dotenv/config'

export const redisClient = new Redis({
    host:process.env.REDIS_HOST, 
    port:Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    
})

redisClient.on("connect", () => console.log(' Redis Cloud connected'))
redisClient.on("error", (error) => console.error(' Redis error', error))
