//클라우드 인멤과 연결
//const REDISHOST= process.env.REDISHOST || 'localhost'
//const REDISPORT= process.env.REDISPORT || 6379
const REDISHOST= '192.168.1.8'
//const REDISHOST= '192.168.0.14'

const REDISPORT= 6379
const redis=require('redis').createClient(REDISPORT, REDISHOST)
redis.on("error", function(err){
    console.log("Redis err "+err)
})

module.exports = redis