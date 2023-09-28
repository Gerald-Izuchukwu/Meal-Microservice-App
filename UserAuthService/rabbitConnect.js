const amqp = require('amqplib/callback_api')
const amqpServer = `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@${process.env.RABBITMQ_DEFAULT_HOST}:${process.env.RABBITMQ_DEFAULT_PORT}`


async function connect(){
    // const amqpServer = process.env.RABBITMQ_CONNECTION_STRING
    return new Promise((resolve, reject)=>{
        amqp.connect(amqpServer, (connectionErr, connection)=>{
            if(connectionErr){
                console.log(connectionErr)
                reject(connectionErr)
            }
            connection.createChannel((channelError, channel)=>{
                if(channelError){
                    console.log(channelError)
                    reject(channelError)
                }
                channel.assertQueue("USER")
                resolve(channel)
            })
    
        })
    })
}


module.exports = connect

