// const { RedisClient } = require('redis')

const RedisClient = require('redis').createClient

const RedisCon = RedisClient(6379, "localhost")


//get redis cache

function get(redis_key) {
    return new Promise((resolve) => {
        RedisCon.get(redis_key, (err, reply) => {
            if(err) {
                console.log('Redis con', err);
            }
            else {
                console.log('Success Redis Get', redis_key);
            }
            resolve ({ reply });
        })
    })
}

function set(redis_key, redis_value) {
    console.log('Success Redis Set', redis_key, redis_value);
        RedisCon.set(redis_key, redis_value)
        
            
            // resolve ({ reply });
        }
    

module.exports.get = get;
module.exports.set = set;