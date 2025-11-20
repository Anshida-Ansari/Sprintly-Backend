import Redis from 'ioredis'

export const redisClient = new Redis({
    host: 'redis-15449.c93.us-east-1-3.ec2.cloud.redislabs.com', 
    port: 15449,
    password: 'wvtbGXzJW3UJ5joJouWedSzRYa4L1UA4',
    
})

redisClient.on("connect", () => console.log(' Redis Cloud connected'))
redisClient.on("error", (error) => console.error(' Redis error', error))
