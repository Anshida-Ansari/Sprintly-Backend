import Redis from 'ioredis'
import 'dotenv/config'
import env from '../env/env.validation'

export const redisClient = new Redis({
    host:env.REDIS_HOST, 
    port:Number(env.REDIS_PORT),
    password:env.REDIS_PASSWORD,
    
})

redisClient.on("connect", () => console.log(' Redis Cloud connected'))
redisClient.on("error", (error) => console.error(' Redis error', error))
