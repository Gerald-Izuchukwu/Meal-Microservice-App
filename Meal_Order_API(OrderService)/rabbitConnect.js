const amqp = require('amqplib/callback_api')

async function connect(){
    const amqpServer = `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@${process.env.RABBITMQ_DEFAULT_HOST}:${process.env.RABBITMQ_DEFAULT_PORT}`
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
                channel.assertQueue("ORDER")
                resolve(channel)
            })
    
        })
    })
}


module.exports = connect

